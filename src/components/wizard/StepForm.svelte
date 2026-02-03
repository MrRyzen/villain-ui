<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Action } from 'svelte/action';
	import type {
		StepDefinition,
		StepOrientation,
		StepController,
		StepControllerOptions,
		StepRailSnippetContext,
		StepPanelSnippetContext,
		StepActionsSnippetContext,
	} from './step.types';
	import { createStepController } from './step.service';

	type TId = string;

	interface Props {
		/** Step definitions */
		steps: StepDefinition<TId>[];
		/** Optional external controller - if not provided, one is created internally */
		controller?: StepController<TId>;
		/** Layout orientation */
		orientation?: StepOrientation;
		/** Initial step ID */
		initialStepId?: TId;
		/** Controller options (only used when creating internal controller) */
		controllerOptions?: Partial<StepControllerOptions<TId>>;
		/** Superforms enhance action - pass the enhance function from superForm() */
		enhance?: Action<HTMLFormElement>;
		/** Form method attribute */
		method?: 'GET' | 'POST' | 'get' | 'post';
		/** Form action attribute */
		action?: string;
		/** Custom rail snippet */
		rail?: Snippet<[StepRailSnippetContext<TId>]>;
		/** Step content snippet */
		step?: Snippet<[StepPanelSnippetContext<TId>]>;
		/** Actions snippet */
		actions?: Snippet<[StepActionsSnippetContext<TId>]>;
		/** Additional CSS classes */
		class?: string;
	}

	// No-op action fallback when enhance is not provided
	const noop: Action<HTMLFormElement> = () => {};

	let {
		steps: stepDefs,
		controller: externalController,
		orientation = 'horizontal',
		initialStepId,
		controllerOptions = {},
		enhance = noop,
		method = 'POST',
		action: formAction,
		rail,
		step: stepSnippet,
		actions,
		class: className = '',
		...restProps
	}: Props = $props();

	// Create or use external controller (captured once at init)
	const ctrl: StepController<TId> =
		externalController ??
		createStepController<TId>({
			steps: stepDefs,
			initialStepId,
			orientation,
			...controllerOptions,
		});

	// Extract stores from controller for $ prefix subscription
	const stepsStore = ctrl.steps;
	const currentStore = ctrl.current;
	const indexStore = ctrl.currentIndex;

	// Use $ prefix to subscribe to nanostores (Svelte store contract)
	const runtimeSteps = $derived($stepsStore);
	const currentStep = $derived($currentStore);
	const currentIndex = $derived($indexStore);

	// Computed loading state
	const isLoading = $derived($currentStore.state === 'loading');

	// Check if on first/last step
	const isFirstStep = $derived(currentIndex === 0);
	const isLastStep = $derived(currentIndex === stepDefs.length - 1);

	// Check if current step is a submit step
	// Explicitly defined as type 'submit'
	const isSubmitStep = $derived(
		currentStep?.type === 'submit'
	);

	// Build snippet contexts
	const railContext = $derived<StepRailSnippetContext<TId>>({
		steps: runtimeSteps,
		current: currentStep,
		orientation,
		goTo: ctrl.goTo,
	});

	const stepContext = $derived<StepPanelSnippetContext<TId>>({
		step: currentStep,
		isLoading: isLoading,
	});

	const actionsContext = $derived<StepActionsSnippetContext<TId>>({
		loading: isLoading,
		step: currentStep,
		isFirst: isFirstStep,
		isLast: isLastStep,
		isSubmit: isSubmitStep,
	});

	// Layout classes based on orientation
	const layoutClasses = $derived(() => {
		switch (orientation) {
			case 'vertical-left':
				return 'flex flex-row gap-8';
			case 'vertical-right':
				return 'flex flex-row-reverse gap-8';
			case 'horizontal':
			default:
				return 'flex flex-col gap-6';
		}
	});
</script>

<form
	{method}
	action={formAction}
	class="w-full relative {layoutClasses()} {className}"
	use:enhance
	{...restProps}
>
	<!-- Rail Section -->
	{#if rail}
		<div class="{orientation !== 'horizontal' ? 'shrink-0' : ''}">
			{@render rail(railContext)}
		</div>
	{/if}

	<!-- Content Section -->
	<div class="flex-1 min-w-0 relative">
		{#if stepSnippet}
			<div class="animate-[content-fade-in_var(--step-med)_var(--step-ease)]">
				{@render stepSnippet(stepContext)}
			</div>
		{/if}

		<!-- Actions Section -->
		{#if actions}
			<div class="flex justify-between items-center gap-4 mt-6 pt-6 border-t border-[var(--color-border)]">
				{@render actions(actionsContext)}
			</div>
		{/if}
	</div>
</form>

<style>
	@keyframes content-fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
