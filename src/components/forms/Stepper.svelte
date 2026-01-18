<script lang="ts">
	import type { StepConfig, StepState } from './Stepper.types';
	import Spinner from '../overlays/Spinner.svelte';

	interface Props {
		steps: (string | StepConfig)[];
		current?: number;
		defaultCurrent?: number;
		onCurrentChange?: (index: number) => void;
		states?: StepState[];
		variant?: 'default' | 'compact' | 'minimal';
		orientation?: 'horizontal' | 'vertical';
		showNumbers?: boolean;
		showProgress?: boolean;
		progressMode?: 'completed' | 'current';
		clickable?: boolean | ((state: StepState, index: number) => boolean);
		class?: string;
	}

	let {
		steps,
		current,
		defaultCurrent = 0,
		onCurrentChange,
		states,
		variant = 'default',
		orientation = 'horizontal',
		showNumbers = true,
		showProgress = true,
		progressMode = 'completed',
		clickable = false,
		class: className = '',
	}: Props = $props();

	let internalCurrent = defaultCurrent;

	const isControlled = current !== undefined;
	const activeIndex = $derived(isControlled ? current! : internalCurrent);

	const normalizedSteps = $derived<StepConfig[]>(
		steps.map((step, i) =>
			typeof step === 'string' ? { id: `step-${i}`, label: step } : step,
		),
	);

	const derivedStates = $derived<StepState[]>(
		states && states.length === normalizedSteps.length
			? states
			: normalizedSteps.map((step, i) => {
					if (step.state) return step.state;
					if (i < activeIndex) return 'completed';
					if (i === activeIndex) return 'active';
					return 'idle';
				}),
	);

	const isDisabled = (step: StepConfig, state: StepState) =>
		step.disabled || state === 'loading';

	const completedCount = $derived(
		derivedStates.filter((s) => s === 'completed').length,
	);

	const progressPercent = $derived(() => {
		if (normalizedSteps.length <= 1) return 100;
		if (progressMode === 'current') {
			return (activeIndex / (normalizedSteps.length - 1)) * 100;
		}
		return (completedCount / (normalizedSteps.length - 1)) * 100;
	});

	function canClick(index: number) {
		if (!clickable) return false;

		const step = normalizedSteps[index];
		const state = derivedStates[index];

		if (step.disabled || state === 'loading') return false;

		if (typeof clickable === 'function') {
			return clickable(state, index);
		}

		return state === 'completed';
	}

	function setCurrent(index: number) {
		if (!canClick(index)) return;
		if (!isControlled) internalCurrent = index;
		onCurrentChange?.(index);
	}

	function handleKeyDown(e: KeyboardEvent, index: number) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setCurrent(index);
		}
	}

	const sizeConfig = {
		default: {
			circle: 'w-10 h-10',
			text: 'text-sm',
			connector: 'h-1',
			gap: 'gap-3',
		},
		compact: {
			circle: 'w-8 h-8',
			text: 'text-xs',
			connector: 'h-0.5',
			gap: 'gap-2',
		},
		minimal: {
			circle: 'w-3 h-3',
			text: 'text-xs',
			connector: 'h-0.5',
			gap: 'gap-1',
		},
	};

	const sizes = $derived(sizeConfig[variant]);
</script>

<div
	class="stepper {className}"
	class:stepper-horizontal={orientation === 'horizontal'}
	class:stepper-vertical={orientation === 'vertical'}
	role="list"
	aria-label="Progress"
>
	{#if orientation === 'horizontal'}
		<div class="w-full">
			{#if showProgress && variant !== 'minimal'}
				<div class="stepper-track">
					<div class="stepper-progress-bg">
						<div
							class="stepper-progress-fill"
							style="width: {progressPercent}%"
						></div>
					</div>

					<div class="stepper-indicators">
						{#each normalizedSteps as step, i}
							{@const state = derivedStates[i]}
							{@const disabled = isDisabled(step, state)}
							<div class="stepper-step" role="listitem">
								<button
									type="button"
									class="stepper-circle {sizes.circle}"
									class:stepper-idle={state === 'idle'}
									class:stepper-active={state === 'active'}
									class:stepper-completed={state ===
										'completed'}
									class:stepper-error={state === 'error'}
									class:stepper-loading={state === 'loading'}
									class:stepper-clickable={canClick(i)}
									aria-current={state === 'active'
										? 'step'
										: undefined}
									class:stepper-disabled={disabled}
									{disabled}
									aria-disabled={disabled}
									aria-invalid={state === 'error'}
									onclick={() => setCurrent(i)}
									onkeydown={(e) => handleKeyDown(e, i)}
								>
									{#if state === 'completed'}
										<svg
											class="stepper-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
										>
											<polyline points="20 6 9 17 4 12" />
										</svg>
									{:else if state === 'error'}
										<svg
											class="stepper-icon"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
										>
											<line
												x1="18"
												y1="6"
												x2="6"
												y2="18"
											/>
											<line
												x1="6"
												y1="6"
												x2="18"
												y2="18"
											/>
										</svg>
									{:else if state === 'loading'}
										<Spinner
											size="sm"
											label="Loading step"
										/>
									{:else if step.icon}
										{@render step.icon()}
									{:else if showNumbers}
										<span
											class="stepper-number {sizes.text}"
											>{i + 1}</span
										>
									{/if}
								</button>

								<span
									class="stepper-label {sizes.text}"
									class:stepper-label-idle={state === 'idle'}
									class:stepper-label-active={state ===
										'active'}
									class:stepper-label-completed={state ===
										'completed'}
									class:stepper-label-error={state ===
										'error'}
								>
									{step.label}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="stepper-vertical-container {sizes.gap}">
			{#each normalizedSteps as step, i}
				{@const state = derivedStates[i]}
				{@const isLast = i === normalizedSteps.length - 1}
				{@const disabled = isDisabled(step, state)}
				<div class="stepper-vertical-step" role="listitem">
					<div class="stepper-vertical-indicator">
						<button
							type="button"
							class="stepper-circle {sizes.circle}"
							class:stepper-idle={state === 'idle'}
							class:stepper-active={state === 'active'}
							class:stepper-completed={state === 'completed'}
							class:stepper-error={state === 'error'}
							class:stepper-loading={state === 'loading'}
							class:stepper-disabled={disabled}
							{disabled}
							aria-disabled={disabled}
							class:stepper-clickable={canClick(i)}
							aria-current={state === 'active'
								? 'step'
								: undefined}
							onclick={() => setCurrent(i)}
							onkeydown={(e) => handleKeyDown(e, i)}
						>
							{#if state === 'completed' && variant !== 'minimal'}
								<svg
									class="stepper-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							{:else if state === 'error' && variant !== 'minimal'}
								<svg
									class="stepper-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
								>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							{:else if state === 'loading'}
								<Spinner size="sm" label="Loading step" />
							{:else if showNumbers && variant !== 'minimal'}
								<span class="stepper-number {sizes.text}"
									>{i + 1}</span
								>
							{/if}
						</button>

						{#if !isLast}
							<div
								class="stepper-vertical-connector"
								class:stepper-connector-completed={state ===
									'completed'}
								class:stepper-connector-error={state ===
									'error'}
							></div>
						{/if}
					</div>

					<div class="stepper-vertical-content">
						<span class="stepper-label {sizes.text}"
							>{step.label}</span
						>
						{#if step.description && variant === 'default'}
							<p class="stepper-description">
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
	.stepper {
		--stepper-accent: var(--color-accent);
		--stepper-accent-soft: var(--color-accent-soft);
		--stepper-error: var(--color-error);
		--stepper-bg: var(--color-base-2);
		--stepper-bg-dark: var(--color-base-1);
		--stepper-text: var(--color-text);
		--stepper-text-soft: var(--color-text-soft);
		--stepper-text-muted: var(--color-text-muted);
	}
	.stepper-track {
		position: relative;
		padding-top: 1.25rem;
		padding-bottom: 2.5rem;
	}

	.stepper-progress-bg {
		position: absolute;
		top: calc(1.25rem + 1.25rem - 2px);
		left: 1.25rem;
		right: 1.25rem;
		height: 4px;
		background: var(--stepper-bg);
		border-radius: 9999px;
		overflow: hidden;
	}

	.stepper-progress-fill {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--stepper-accent),
			var(--stepper-accent-soft)
		);
		border-radius: 9999px;
		transition: width 0.5s var(--ease-luxe);
		box-shadow: 0 0 12px var(--color-accent-overlay-50);
	}

	.stepper-indicators {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.stepper-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		max-width: 120px;
	}

	.stepper-step:first-child {
		align-items: flex-start;
	}

	.stepper-step:last-child {
		align-items: flex-end;
	}
	.stepper-circle {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		border: none;
		font-weight: 600;
		cursor: default;
		transition: all 0.3s var(--ease-luxe);
		z-index: 1;
	}

	.stepper-idle {
		background: var(--stepper-bg);
		color: var(--stepper-text-muted);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.stepper-active {
		background: linear-gradient(
			135deg,
			var(--stepper-accent),
			var(--stepper-accent-soft)
		);
		color: white;
		box-shadow:
			0 0 0 4px var(--color-accent-overlay-20),
			0 0 20px var(--color-accent-overlay-50),
			0 0 40px var(--color-accent-overlay-30);
		animation: stepper-pulse 2s ease-in-out infinite;
	}

	.stepper-completed {
		background: linear-gradient(
			135deg,
			var(--stepper-accent),
			var(--stepper-accent-soft)
		);
		color: white;
		box-shadow: 0 2px 8px var(--color-accent-overlay-30);
	}

	.stepper-error {
		background: linear-gradient(135deg, var(--stepper-error), #dc2626);
		color: white;
		box-shadow:
			0 0 0 4px var(--color-error-overlay-15),
			0 0 16px var(--color-error-overlay-30);
		animation: stepper-shake 0.5s ease-in-out;
	}

	.stepper-disabled {
		background: var(--stepper-bg-dark);
		color: var(--stepper-text-muted);
		opacity: 0.5;
	}

	.stepper-clickable {
		cursor: pointer;
	}

	.stepper-clickable:hover {
		transform: scale(1.1);
		box-shadow:
			0 0 0 4px var(--color-accent-overlay-20),
			0 0 20px var(--color-accent-overlay-40);
	}

	.stepper-clickable:active {
		transform: scale(0.95);
	}
	.stepper-icon {
		width: 50%;
		height: 50%;
	}

	.stepper-number {
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.stepper-label {
		margin-top: 0.75rem;
		font-weight: 500;
		transition: color 0.3s var(--ease-luxe);
		white-space: nowrap;
	}

	.stepper-label-idle {
		color: var(--stepper-text-muted);
	}

	.stepper-label-active {
		color: var(--stepper-accent-soft);
		text-shadow: 0 0 20px var(--color-accent-overlay-50);
	}

	.stepper-label-completed {
		color: var(--stepper-text-soft);
	}

	.stepper-label-error {
		color: var(--stepper-error);
	}
	.stepper-vertical-container {
		display: flex;
		flex-direction: column;
	}

	.stepper-vertical-step {
		display: flex;
		gap: 1rem;
	}

	.stepper-vertical-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stepper-vertical-connector {
		width: 3px;
		flex: 1;
		min-height: 2rem;
		margin: 0.5rem 0;
		background: var(--stepper-bg);
		border-radius: 9999px;
		transition: background 0.3s var(--ease-luxe);
	}

	.stepper-connector-completed {
		background: linear-gradient(
			180deg,
			var(--stepper-accent),
			var(--stepper-accent-soft)
		);
		box-shadow: 0 0 8px var(--color-accent-overlay-30);
	}

	.stepper-connector-error {
		background: var(--stepper-error);
	}

	.stepper-vertical-content {
		flex: 1;
		padding-bottom: 1.5rem;
	}

	.stepper-description {
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--stepper-text-muted);
		line-height: 1.4;
	}
	@keyframes stepper-pulse {
		0%,
		100% {
			box-shadow:
				0 0 0 4px var(--color-accent-overlay-20),
				0 0 20px var(--color-accent-overlay-50),
				0 0 40px var(--color-accent-overlay-30);
		}
		50% {
			box-shadow:
				0 0 0 6px var(--color-accent-overlay-30),
				0 0 30px var(--color-accent-overlay-60),
				0 0 60px var(--color-accent-overlay-40);
		}
	}

	@keyframes stepper-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20%,
		60% {
			transform: translateX(-4px);
		}
		40%,
		80% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.stepper-active,
		.stepper-error {
			animation: none;
		}

		.stepper-circle,
		.stepper-label,
		.stepper-progress-fill,
		.stepper-vertical-connector {
			transition: none;
		}
	}
	@media (max-width: 640px) {
		.stepper-label {
			display: none;
		}

		.stepper-step {
			max-width: none;
		}
	}
</style>
