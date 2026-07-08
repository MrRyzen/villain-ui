import { atom, computed } from 'nanostores';
import type {
	StepState,
	StepDefinition,
	StepRuntime,
	StepController,
	StepControllerOptions,
	StepChangeContext,
	SuperFormLike,
} from './step.types';

/**
 * Internal step data without the computed `state` property.
 * Used for the mutable base store; `state` is derived in $runtimeSteps.
 */
type StepInternalData<TId extends string> = StepDefinition<TId> & {
	index: number;
	visited: boolean;
	completed: boolean;
	active: boolean;
	valid?: boolean;
	/** Explicit state override set via setStepState. Takes precedence over computed state. */
	stateOverride?: StepState;
};

/**
 * Creates a headless step controller using nanostores.
 * This service owns all step state, transitions, and guards.
 *
 * @template TId Step identifier type
 */
export function createStepController<TId extends string>(
	options: StepControllerOptions<TId>,
): StepController<TId> {
	const {
		steps: stepDefs,
		initialStepId,
		navigation,
		onBeforeStepChange,
		onStepChange,
		onStepComplete,
		onError,
	} = options;

	const allowBack = navigation?.allowBackNavigation ?? true;
	const lockWhileLoading = navigation?.lockWhileLoading ?? true;
	let formIntegration: SuperFormLike<any> | null = null;
	let unsubSubmitting: (() => void) | undefined;
	let unsubErrors: (() => void) | undefined;
	let unsubMessage: (() => void) | undefined;

	/**
	 * Internal loading state.
	 */
	const $loading = atom(false);

	/**
	 * Per-step error messages, keyed by step id.
	 */
	const $stepErrors = atom<Partial<Record<TId, string[]>>>({});

	/**
	 * Base step store (authoritative mutable data).
	 */
	const $steps = atom<StepInternalData<TId>[]>(
		stepDefs.map((def, index) => ({
			...def,
			index,
			visited: false,
			completed: false,
			active: false,
		})),
	);

	/**
	 * Resolve initial step index eagerly.
	 */
	const initialIndex =
		initialStepId != null
			? Math.max(
					0,
					stepDefs.findIndex((s) => s.id === initialStepId),
				)
			: 0;

	/**
	 * Current step index store.
	 */
	const $currentIndex = atom<number>(initialIndex);

	/**
	 * Derived runtime steps.
	 * This is the single source of truth for step state.
	 */
	const $runtimeSteps = computed(
		[$steps, $currentIndex, $loading],
		(steps, index, loading) =>
			steps.map((step, i) => {
				const active = i === index;

				// Explicit stateOverride takes full precedence
				let state: StepState;
				if (step.stateOverride !== undefined) {
					state = step.stateOverride;
				} else if (loading && active) {
					state = 'loading';
				} else if (step.completed) {
					state = 'completed';
				} else if (active) {
					state = 'active';
				} else {
					state = 'idle';
				}

				return {
					...step,
					active,
					state,
				};
			}),
	);

	/**
	 * Current active step store.
	 */
	const $currentStep = computed(
		[$runtimeSteps, $currentIndex],
		(steps, index) => steps[index] ?? steps[0],
	);

	const $isLastStep = computed(
		[$currentIndex, $runtimeSteps],
		(index, steps) => index === steps.length - 1,
	);

	/**
	 * Sets the loading state.
	 *
	 * @param loading Whether loading is active
	 */
	function setLoading(loading: boolean): void {
		$loading.set(loading);
	}

	/**
	 * Runs step change guards.
	 *
	 * @param context Transition context
	 * @returns Whether transition is allowed
	 */
	async function runGuards(
		context: StepChangeContext<TId>,
	): Promise<boolean> {
		if (!onBeforeStepChange) return true;
		const result = await onBeforeStepChange(context);
		return result !== false;
	}

	/**
	 * Performs validation for a step if configured.
	 *
	 * NOTE:
	 * validator.validator is expected to be an adapter-provided async function.
	 * This service does not assume Zod or superforms directly.
	 *
	 * @param step Runtime step
	 * @returns Whether validation passed
	 */
	/**
	 * Assigns a step's validator to the attached form's options.validators.
	 * Steps without a validator leave whatever is currently set — matches the
	 * behavior for wizards that configure a single schema up front.
	 *
	 * @param step Step whose validator should become active
	 */
	function applyStepValidator(
		step: StepRuntime<TId> | StepInternalData<TId>,
	): void {
		if (!formIntegration?.options) return;
		if (step.validator !== undefined) {
			formIntegration.options.validators = step.validator;
		}
	}

	async function validateStep(step: StepRuntime<TId>): Promise<boolean> {
		setLoading(true);

		try {
			const result = await formIntegration?.validateForm({
				update: true,
			});

			return result?.valid ?? true;
		} catch (err) {
			onError?.(step, err);
			return false;
		} finally {
			setLoading(false);
		}
	}

	/**
	 * Changes the active step index.
	 *
	 * @param targetIndex Index to move to
	 * @param direction Transition direction
	 */
	async function changeStep(
		targetIndex: number,
		direction: 'forward' | 'backward' | 'jump',
	): Promise<boolean> {
		const steps = $runtimeSteps.get();
		const current = steps[$currentIndex.get()];
		const target = steps[targetIndex];

		if (!target) return false;
		if (lockWhileLoading && $loading.get()) return false;
		if (target.disabled) return false;
		if (direction === 'backward' && !allowBack) return false;
		
		const fromPolicy = current.jumpPolicy ?? 'free';
		const toPolicy = target.jumpPolicy ?? 'free';

		if (direction === 'jump') {
			if (fromPolicy === 'no-exit' || fromPolicy === 'locked') return false;
			if (toPolicy === 'no-enter' || toPolicy === 'locked') return false;
		}

		const context: StepChangeContext<TId> = {
			from: current,
			to: target,
			direction,
		};

		if (!(await runGuards(context))) return false;

		$steps.set(
			$steps
				.get()
				.map((s) =>
					s.index === current.index ? { ...s, visited: true } : s,
				),
		);

		$currentIndex.set(targetIndex);
		applyStepValidator(target);
		onStepChange?.(target);
		return true;
	}

	/**
	 * Advances to the next step.
	 */
	async function next(): Promise<boolean> {
		const current = $currentStep.get();
		const index = $currentIndex.get();
		const nextStep = $runtimeSteps.get()[index + 1];

		if (!nextStep) return false;

		if (current.type === 'submit') {
			console.warn('Use submit()/onSubmitSuccess() for submit steps');
			return false;
		}

		// Validate current step before proceeding only if not a submit step
		// Submit steps are expected to handle validation via form submission (user handled but we react to it)
		// Validate against the step being LEFT, with its own validator active.
		const shouldValidate =
			current.validateOnNext ?? current.validator !== undefined;
		if (shouldValidate) {
			applyStepValidator(current);
			if (!(await validateStep(current))) {
				onError?.(current);
				return false;
			}
		} else if (!(await validateStep(current))) {
			onError?.(current);
			return false;
		}

		clearStepState(current.id);

		markCompleted(current.id);

		onStepComplete?.({
			...current,
			completed: true,
		});

		return changeStep(index + 1, 'forward');
	}

	/**
	 * Moves to the previous step.
	 */
	async function prev(): Promise<boolean> {
		const index = $currentIndex.get();
		if (index === 0) return false;
		return changeStep(index - 1, 'backward');
	}

	/**
	 * Jumps to a specific step by id.
	 *
	 * @param id Step identifier
	 */
	async function goTo(id: TId): Promise<boolean> {
		const index = $runtimeSteps.get().findIndex((s) => s.id === id);
		if (index < 0) return false;
		return changeStep(index, 'jump');
	}

	const resolveCurrentStep = async (): Promise<boolean> => {
		const current = $currentStep.get();
		clearStepState(current.id);
		markCompleted(current.id);
		$steps.set(
			$steps
				.get()
				.map((s) =>
					s.index === current.index ? { ...s, visited: true } : s,
				),
		);
		onStepComplete?.({
			...current,
			completed: true,
		});

		return true;
	};

	const onSubmitSuccess = async (): Promise<boolean> => {
		const current = $currentStep.get();
		const index = $currentIndex.get();
		const nextStep = $runtimeSteps.get()[index + 1];
		if (!nextStep) return false;
		setLoading(false);
		clearStepState(current.id);
		markCompleted(current.id);

		onStepComplete?.({
			...current,
			completed: true,
		});
		return changeStep(index + 1, 'forward');
	};

	/**
	 * Forces a step state override. This takes precedence over computed state.
	 *
	 * @param id Step identifier
	 * @param state New state
	 */
	function setStepState(id: TId, state: StepState): void {
		$steps.set(
			$steps
				.get()
				.map((s) => (s.id === id ? { ...s, stateOverride: state } : s)),
		);
	}

	/**
	 * Clears the state override for a step, returning to computed state.
	 *
	 * @param id Step identifier
	 */
	function clearStepState(id: TId): void {
		$steps.set(
			$steps
				.get()
				.map((s) =>
					s.id === id ? { ...s, stateOverride: undefined } : s,
				),
		);
	}

	/**
	 * Sets human-readable error messages on a step and flips its rail state.
	 *
	 * @param id Step identifier
	 * @param error Message or list of messages
	 */
	function setStepError(id: TId, error: string | string[]): void {
		$stepErrors.set({
			...$stepErrors.get(),
			[id]: Array.isArray(error) ? error : [error],
		});
		setStepState(id, 'error');
		const step = $runtimeSteps.get().find((s) => s.id === id);
		if (step) onError?.(step, $stepErrors.get()[id]);
	}

	/**
	 * Clears a step's error messages and its rail error state.
	 *
	 * @param id Step identifier
	 */
	function clearStepError(id: TId): void {
		const next = { ...$stepErrors.get() };
		delete next[id];
		$stepErrors.set(next);
		clearStepState(id);
	}

	/**
	 * Marks a step as completed.
	 *
	 * @param id Step identifier
	 */
	function markCompleted(id: TId): void {
		$steps.set(
			$steps
				.get()
				.map((s) => (s.id === id ? { ...s, completed: true } : s)),
		);
	}

	/**
	 * Resets the controller state.
	 *
	 * @param toStepId Optional step id to reset to
	 */
	function reset(toStepId?: TId): void {
		$steps.set(
			stepDefs.map((def, index) => ({
				...def,
				index,
				visited: false,
				completed: false,
				active: false,
			})),
		);

		$stepErrors.set({});

		if (toStepId) {
			const idx = stepDefs.findIndex((s) => s.id === toStepId);
			$currentIndex.set(idx >= 0 ? idx : 0);
		} else {
			$currentIndex.set(0);
		}

		setLoading(false);
	}

	/**
	 * Debug store with useful internal state.
	 * For development purposes only.
	 */
	const $debug = computed(
		[$runtimeSteps, $currentStep, $currentIndex, $loading],
		(steps, current, index, loading) => ({
			index,
			loading,
			current,
			steps,
		}),
	);

	/**
	 * Flattens a superforms nested error object into dot-path keys → messages.
	 * e.g. { user: { email: ['Invalid'] } } → { 'user.email': ['Invalid'] }.
	 */
	const flattenErrorMessages = (
		value: unknown,
		prefix = '',
	): Record<string, string[]> => {
		if (Array.isArray(value)) {
			return value.length > 0 && prefix ? { [prefix]: value } : {};
		}

		if (value && typeof value === 'object') {
			return Object.entries(value).reduce<Record<string, string[]>>(
				(acc, [key, child]) => {
					const path = prefix ? `${prefix}.${key}` : key;
					return { ...acc, ...flattenErrorMessages(child, path) };
				},
				{},
			);
		}

		return {};
	};

	const attachFormIntegration = (form: SuperFormLike<any>) => {
		// Implementation for attaching form integration
		formIntegration = form;

		// Apply the initial step's validator so the first next() validates
		// against the right schema even before any step change fires.
		applyStepValidator($currentStep.get());

		// Subscribe to form submitting state
		unsubSubmitting = formIntegration.submitting.subscribe((submitting) => {
			// Clear any error on submit start (user is fixing things)
			if (submitting) {
				clearStepError($currentStep.get().id);
			}
			setLoading(submitting);
		});

		unsubErrors = formIntegration.errors.subscribe((errors) => {
			const flat = flattenErrorMessages(errors);
			if (Object.keys(flat).length === 0) {
				stepDefs.forEach((step) => clearStepError(step.id));
				return;
			}
			stepDefs.forEach((step) => {
				const messages = Object.entries(flat)
					.filter(([key]) =>
						(step.data ?? []).includes(key.split('.')[0]),
					)
					.flatMap(([, msgs]) => msgs);
				if (messages.length > 0) setStepError(step.id, messages);
				else clearStepError(step.id);
			});
		});
	};

	return {
		/** Reactive stores */
		steps: $runtimeSteps,
		current: $currentStep,
		currentIndex: $currentIndex,
		isLastStep: $isLastStep,
		stepErrors: $stepErrors,
		debug: $debug,

		/** Navigation */
		next,
		prev,
		goTo,
		resolveCurrentStep,

		/** Submission handling */
		onSubmitSuccess,

		/** State control */
		setStepState,
		clearStepState,
		setStepError,
		clearStepError,
		markCompleted,
		setLoading,
		reset,
		attachFormIntegration,

		/** Clean up resources */
		destroy: () => {
			unsubSubmitting?.();
			unsubErrors?.();
			unsubMessage?.();
		},
	};
}
