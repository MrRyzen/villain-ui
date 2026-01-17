<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContext, tick } from 'svelte';
	import type {
		StepState,
		ValidationMode,
		StepRegistration,
		StepperFormContext,
		StepMeta,
		StepContext,
	} from './Stepper.types';

	import { STEPPER_CONTEXT_KEY } from './StepContext';

	interface Props {
		form: any;
		validationMode?: ValidationMode;
		initialStep?: number;
		onStepChange?: (stepIndex: number, stepId: string) => void;
		onValidationError?: (stepId: string, errors: string[]) => void;
		onComplete?: () => void;
		header?: Snippet<[StepperFormContext]>;
		footer?: Snippet<[StepperFormContext]>;
		children?: Snippet<[StepperFormContext]>;
		class?: string;
	}

	let {
		form,
		validationMode = 'strict',
		initialStep = 0,
		onStepChange,
		onValidationError,
		onComplete,
		header,
		footer,
		children,
		class: className = '',
	}: Props = $props();

	let registeredSteps = $state<StepRegistration[]>([]);
	let currentStepIndex = $state(initialStep);
	let stepStates = $state<Map<string, StepState>>(new Map());
	let stepErrors = $state<Map<string, string[]>>(new Map());

	const totalSteps = $derived(registeredSteps.length);
	const currentStepId = $derived(registeredSteps[currentStepIndex]?.id ?? '');
	const isFirstStep = $derived(currentStepIndex === 0);
	const isLastStep = $derived(currentStepIndex === totalSteps - 1);
	const canBack = $derived(!isFirstStep);

	const canNext = $derived(
		validationMode === 'submit-only'
			? true
			: (() => {
					const step = registeredSteps[currentStepIndex];
					if (!step) return false;
					return (stepErrors.get(step.id) ?? []).length === 0;
				})(),
	);

	const steps = $derived<StepMeta[]>(
		registeredSteps.map((step, i) => ({
			id: step.id,
			label: step.label,
			fields: step.fields ?? [],
			optional: step.optional ?? false,
			state:
				stepStates.get(step.id) ??
				(i < currentStepIndex
					? 'completed'
					: i === currentStepIndex
						? 'active'
						: 'idle'),
		})),
	);

	async function validateStepFields(stepId: string): Promise<boolean> {
		const step = registeredSteps.find((s) => s.id === stepId);
		if (!step?.fields?.length) return true;

		const formErrors = form?.errors;
		if (!formErrors) return true;

		const errors: string[] = [];

		for (const field of step.fields) {
			const fieldErrors = $state.snapshot(formErrors)?.[field];
			if (Array.isArray(fieldErrors)) errors.push(...fieldErrors);
		}

		if (errors.length) {
			stepErrors.set(stepId, errors);
			stepStates.set(stepId, 'error');
			onValidationError?.(stepId, errors);
			return false;
		}

		stepErrors.delete(stepId);
		stepStates.set(stepId, 'active');
		return true;
	}

	async function validateCurrentStep(): Promise<boolean> {
		if (validationMode === 'submit-only') return true;
		return validateStepFields(currentStepId);
	}

	async function next(): Promise<boolean> {
		if (isLastStep) {
			onComplete?.();
			return true;
		}

		if (validationMode !== 'submit-only') {
			const valid =
				validationMode === 'strict'
					? await validateCurrentStep()
					: (await validateCurrentStep(), true);
			if (!valid) return false;
		}

		stepStates.set(currentStepId, 'completed');
		currentStepIndex++;

		const newStepId = registeredSteps[currentStepIndex].id;
		stepStates.set(newStepId, 'active');

		await tick();
		onStepChange?.(currentStepIndex, newStepId);
		return true;
	}

	function back(): void {
		if (isFirstStep) return;

		stepStates.set(currentStepId, 'idle');
		currentStepIndex--;

		const newStepId = registeredSteps[currentStepIndex].id;
		stepStates.set(newStepId, 'active');

		onStepChange?.(currentStepIndex, newStepId);
	}

	async function goto(stepId: string): Promise<boolean> {
		const targetIndex = registeredSteps.findIndex((s) => s.id === stepId);
		if (targetIndex === -1) return false;

		if (targetIndex > currentStepIndex && validationMode === 'strict') {
			for (let i = currentStepIndex; i < targetIndex; i++) {
				const ok = await validateStepFields(registeredSteps[i].id);
				if (!ok) return false;
				stepStates.set(registeredSteps[i].id, 'completed');
			}
		}

		for (let i = 0; i < registeredSteps.length; i++) {
			stepStates.set(
				registeredSteps[i].id,
				i < targetIndex
					? 'completed'
					: i === targetIndex
						? 'active'
						: 'idle',
			);
		}

		currentStepIndex = targetIndex;

		await tick();
		onStepChange?.(targetIndex, stepId);
		return true;
	}

	function getStepErrors(stepId: string): string[] {
		return stepErrors.get(stepId) ?? [];
	}

	function getStepState(id: string): StepState {
		return stepStates.get(id) ?? 'idle';
	}

	function registerStep(step: StepRegistration): void {
		if (registeredSteps.some((s) => s.id === step.id)) return;

		registeredSteps = [...registeredSteps, step].sort(
			(a, b) => (a.order ?? 0) - (b.order ?? 0),
		);

		if (!registeredSteps[currentStepIndex]) {
			currentStepIndex = 0;
		}

		const id = registeredSteps[currentStepIndex].id;
		stepStates.set(id, 'active');
	}

	function unregisterStep(id: string): void {
		registeredSteps = registeredSteps.filter((s) => s.id !== id);
		stepStates.delete(id);
		stepErrors.delete(id);

		if (currentStepIndex >= registeredSteps.length) {
			currentStepIndex = Math.max(registeredSteps.length - 1, 0);
		}

		const active = registeredSteps[currentStepIndex];
		if (active) stepStates.set(active.id, 'active');
	}

	const stepContext: StepContext = {
		registerStep,
		unregisterStep,
		get currentStepId() {
			return currentStepId;
		},
		getStepState,
	};

	setContext(STEPPER_CONTEXT_KEY, stepContext);

	const slotContext = $derived<StepperFormContext>({
		next,
		back,
		goto,
		currentStep: currentStepIndex,
		currentStepId,
		totalSteps,
		canNext,
		canBack,
		isFirstStep,
		isLastStep,
		steps,
		validateCurrentStep,
		getStepErrors,
	});
</script>

<div class={`stepper-form ${className}`} data-current-step={currentStepId}>
	{#if header}
		<div class="stepper-form-header">
			{@render header(slotContext)}
		</div>
	{/if}

	<div class="stepper-form-content">
		{@render children?.(slotContext)}
	</div>

	{#if footer}
		<div class="stepper-form-footer">
			{@render footer(slotContext)}
		</div>
	{/if}
</div>
