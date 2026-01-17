<script lang="ts">
	import type { Snippet } from 'svelte';

	export type StepState = 'idle' | 'active' | 'completed' | 'error' | 'disabled';

	export interface StepConfig {
		id: string;
		label: string;
		description?: string;
		icon?: Snippet;
		state?: StepState;
	}

	interface Props {
		/** Array of step labels or full step configs */
		steps: (string | StepConfig)[];
		/** Current step index (0-based) */
		current?: number;
		/** Optional explicit states (must match steps length) */
		states?: StepState[];
		/** Visual variant */
		variant?: 'default' | 'compact' | 'minimal';
		/** Orientation */
		orientation?: 'horizontal' | 'vertical';
		/** Show step numbers */
		showNumbers?: boolean;
		/** Show progress bar (horizontal only) */
		showProgress?: boolean;
		/** Allow clicking on completed steps */
		clickable?: boolean;
		/** Callback when a step is clicked */
		onStepClick?: (index: number) => void;
		/** Additional CSS class */
		class?: string;
	}

	let {
		steps,
		current = 0,
		states,
		variant = 'default',
		orientation = 'horizontal',
		showNumbers = true,
		showProgress = true,
		clickable = false,
		onStepClick,
		class: className = ''
	}: Props = $props();

	/* ---------------------------------------------
	 * Normalize steps (stable IDs, StepForm friendly)
	 * --------------------------------------------- */
	const normalizedSteps = $derived<StepConfig[]>(
		steps.map((step, _) =>
			typeof step === 'string'
				? {
						id: step.toLowerCase().replace(/\s+/g, '-'),
						label: step
				  }
				: step
		)
	);

	/* ---------------------------------------------
	 * Resolve step states
	 * Priority:
	 * 1. explicit `states` prop
	 * 2. per-step `state`
	 * 3. derive from `current`
	 * --------------------------------------------- */
	const derivedStates = $derived<StepState[]>(
		states && states.length === normalizedSteps.length
			? states
			: normalizedSteps.map((step, i) => {
					if (step.state) return step.state;
					if (i < current) return 'completed';
					if (i === current) return 'active';
					return 'idle';
			  })
	);

	/* ---------------------------------------------
	 * Progress bar percentage
	 * --------------------------------------------- */
	const progressPercent = $derived(
		normalizedSteps.length > 1
			? ((current + 1) / normalizedSteps.length) * 100
			: 100
	);

	/* ---------------------------------------------
	 * Interaction handlers
	 * --------------------------------------------- */
	function handleStepClick(index: number) {
		if (!clickable) return;
		const state = derivedStates[index];
		if (state !== 'completed') return;
		onStepClick?.(index);
	}

	function handleKeyDown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleStepClick(index);
		}
	}

	/* ---------------------------------------------
	 * Styling maps
	 * --------------------------------------------- */
	const stateStyles: Record<StepState, { circle: string; label: string; connector: string }> = {
		idle: {
			circle: 'bg-[var(--color-base-2)] text-[var(--color-text-tertiary)]',
			label: 'text-[var(--color-text-tertiary)]',
			connector: 'bg-[var(--color-base-2)]'
		},
		active: {
			circle:
				'bg-[var(--color-accent-primary)] text-white shadow-[0_0_0_4px_rgba(139,92,246,0.3)]',
			label: 'text-[var(--color-accent-primary)]',
			connector: 'bg-[var(--color-base-2)]'
		},
		completed: {
			circle: 'bg-[var(--color-accent-primary)] text-white',
			label: 'text-[var(--color-text-secondary)]',
			connector: 'bg-[var(--color-accent-primary)]'
		},
		error: {
			circle: 'bg-[var(--color-error)] text-white',
			label: 'text-[var(--color-error)]',
			connector: 'bg-[var(--color-error)]'
		},
		disabled: {
			circle: 'bg-[var(--color-base-1)] text-[var(--color-text-tertiary)] opacity-50',
			label: 'text-[var(--color-text-tertiary)] opacity-50',
			connector: 'bg-[var(--color-base-1)]'
		}
	};

	const sizeConfig = {
		default: { circle: 'w-8 h-8', text: 'text-sm', connector: 'h-0.5', gap: 'gap-3' },
		compact: { circle: 'w-6 h-6', text: 'text-xs', connector: 'h-0.5', gap: 'gap-2' },
		minimal: { circle: 'w-3 h-3', text: 'text-xs', connector: 'h-0.5', gap: 'gap-1' }
	};

	const sizes = $derived(sizeConfig[variant]);
</script>

<!-- ========================================================= -->
<!-- Root -->
<!-- ========================================================= -->
<div
	class="stepper {className}"
	class:stepper-horizontal={orientation === 'horizontal'}
	class:stepper-vertical={orientation === 'vertical'}
	role="group"
	aria-label="Progress"
>
	<!-- ========================================================= -->
	<!-- Horizontal -->
	<!-- ========================================================= -->
	{#if orientation === 'horizontal'}
		<div class="w-full">
			{#if showProgress && variant !== 'minimal'}
				<div class="relative mb-8">
					<div class="h-2 rounded-full overflow-hidden bg-[var(--color-base-2)]">
						<div
							class="h-full transition-all duration-500 ease-out bg-[var(--color-accent-primary)]"
							style="width: {progressPercent}%"
						></div>
					</div>

					<div class="absolute top-0 left-0 right-0 flex justify-between items-center -mt-3">
						{#each normalizedSteps as step, i}
							{@const state = derivedStates[i]}
							{@const styles = stateStyles[state]}
							<div class="flex flex-col items-center">
								<button
									type="button"
									class="{sizes.circle} rounded-full flex items-center justify-center transition-all duration-300 {styles.circle}"
									class:cursor-pointer={clickable && state === 'completed'}
									disabled={state === 'disabled'}
									onclick={() => handleStepClick(i)}
									onkeydown={(e) => handleKeyDown(e, i)}
									aria-current={state === 'active' ? 'step' : undefined}
								>
									{#if state === 'completed' && variant !== 'minimal'}
										✓
									{:else if step.icon}
										{@render step.icon()}
									{:else if showNumbers && variant !== 'minimal'}
										<span class="{sizes.text} font-bold">{i + 1}</span>
									{/if}
								</button>

								{#if variant !== 'minimal'}
									<span class="hidden md:block mt-2 {sizes.text} font-medium {styles.label}">
										{step.label}
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- ========================================================= -->
	<!-- Vertical -->
	<!-- ========================================================= -->
	{:else}
		<div class="flex flex-col {sizes.gap}">
			{#each normalizedSteps as step, i}
				{@const state = derivedStates[i]}
				{@const styles = stateStyles[state]}
				{@const isLast = i === normalizedSteps.length - 1}

				<div class="flex">
					<div class="flex flex-col items-center mr-4">
						<button
							type="button"
							class="{sizes.circle} rounded-full flex items-center justify-center transition-all duration-300 {styles.circle}"
							class:cursor-pointer={clickable && state === 'completed'}
							disabled={state === 'disabled'}
							onclick={() => handleStepClick(i)}
							onkeydown={(e) => handleKeyDown(e, i)}
							aria-current={state === 'active' ? 'step' : undefined}
						>
							{#if state === 'completed' && variant !== 'minimal'}✓{/if}
						</button>

						{#if !isLast}
							<div
								class="w-0.5 flex-1 min-h-8 my-2 rounded-full transition-colors duration-300"
								class:bg-[var(--color-accent-primary)]={state === 'completed'}
								class:bg-[var(--color-base-2)]={state !== 'completed'}
							></div>
						{/if}
					</div>

					<div class="flex-1 pb-8">
						<span class="{sizes.text} font-medium {styles.label}">
							{step.label}
						</span>
						{#if step.description && variant === 'default'}
							<p class="mt-1 text-xs text-[var(--color-text-tertiary)]">
								{step.description}
							</p>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	@media (prefers-reduced-motion: reduce) {
		.stepper * {
			transition-duration: 0.01ms !important;
		}
	}
</style>
