<script lang="ts">
	import type { StepRuntime, StepOrientation } from './step.types';

	type TId = string;

	interface Props {
		/** Array of steps with runtime state */
		steps: readonly StepRuntime<TId>[];
		/** Current step index or step object */
		current: number | StepRuntime<TId>;
		/** Layout orientation */
		orientation?: StepOrientation;
		/** Callback when a step is selected */
		onSelect?: (id: TId) => void;
		/** Show step numbers in nodes */
		showNumbers?: boolean;
		/** Show step labels below/beside nodes */
		showLabels?: boolean;
		/** Node size variant */
		size?: 'sm' | 'md' | 'lg';
		/** Additional CSS classes */
		class?: string;
	}

	let {
		steps,
		current,
		orientation = 'horizontal',
		onSelect,
		showNumbers = true,
		showLabels = true,
		size = 'md',
		class: className = '',
		...restProps
	}: Props = $props();

	// Handle step click
	function handleStepClick(step: StepRuntime<TId>) {
		if (step.disabled) return;
		onSelect?.(step.id);
	}

	// Handle keyboard navigation
	function handleKeyDown(event: KeyboardEvent, step: StepRuntime<TId>) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleStepClick(step);
		}
	}

	// Get state-based classes for step node
	function getNodeClasses(step: StepRuntime<TId>, isClickable: boolean): string {
		const baseClasses = 'relative flex items-center justify-center rounded-[var(--radius-pill)] border-2 font-semibold transition-all duration-[var(--step-med)] ease-[var(--step-ease)] shrink-0';
		
		if (step.disabled) {
			return `${baseClasses} border-[var(--step-disabled-border)] bg-[var(--step-disabled-bg)] text-[var(--step-disabled-text)] opacity-50 cursor-not-allowed`;
		}

		let stateClasses = '';
		switch (step.state) {
			case 'error':
				stateClasses = 'border-[var(--step-error-border)] bg-[var(--step-error-bg)] text-[var(--step-error-text)] shadow-[0_0_12px_var(--step-error-glow)] animate-[step-error-shake_0.4s_var(--step-ease)]';
				break;
			case 'loading':
				stateClasses = 'border-[var(--step-loading-border)] bg-[var(--step-loading-bg)] text-[var(--step-loading-text)]';
				break;
			case 'active':
				stateClasses = 'border-[var(--step-active-border)] bg-[var(--step-active-bg)] text-[var(--step-active-text)] shadow-[0_0_20px_var(--step-active-glow)] animate-[step-pulse_2s_var(--step-ease)_infinite]';
				break;
			case 'completed':
				stateClasses = 'border-[var(--step-completed-border)] bg-[var(--step-completed-bg)] text-[var(--step-completed-text)]';
				break;
			default:
				stateClasses = step.visited 
					? 'border-[var(--step-visited-border)] bg-[var(--step-visited-bg)] text-[var(--step-visited-text)]'
					: 'border-[var(--step-idle-border)] bg-[var(--step-idle-bg)] text-[var(--step-idle-text)]';
		}

		const interactionClasses = isClickable 
			? 'cursor-pointer hover:border-[var(--step-hover-border)] hover:bg-[var(--step-hover-bg)]'
			: 'cursor-default';

		return `${baseClasses} ${stateClasses} ${interactionClasses}`;
	}

	// Get label container classes
	function getLabelClasses(isVertical: boolean): string {
		const base = 'flex flex-col transition-colors duration-[var(--step-fast)] ease-[var(--step-ease)]';
		if (isVertical) {
			return `${base} items-start text-left ml-3 pt-0.5`;
		}
		return `${base} items-center text-center mt-2 max-w-[100px]`;
	}

	// Get label text classes
	function getLabelTextClasses(step: StepRuntime<TId>): string {
		const base = 'text-[length:var(--text-sm)] font-medium leading-tight';
		
		if (step.disabled) return `${base} text-[var(--color-text-muted)] opacity-50`;
		if (step.active) return `${base} text-[var(--color-text)] font-semibold`;
		if (step.completed) return `${base} text-[var(--color-text)]`;
		return `${base} text-[var(--color-text-soft)]`;
	}

	// Size classes
	const sizeClasses = {
		sm: 'w-6 h-6 text-xs',
		md: 'w-8 h-8 text-sm',
		lg: 'w-10 h-10 text-base',
	};

	// Layout classes
	const layoutClasses = $derived(() => {
		if (orientation === 'horizontal') {
			return 'flex flex-row items-start';
		}
		return 'flex flex-col items-start';
	});

	// Connector orientation
	const isVertical = $derived(orientation !== 'horizontal');
</script>

<nav
	class="w-full gap-0 {layoutClasses()} {className}"
	data-size={size}
	role="tablist"
	aria-label="Step navigation"
	{...restProps}
>
	{#each steps as step, index (step.id)}
		{@const isActive = step.active}
		{@const isClickable = !step.disabled && onSelect !== undefined}

		<div class="flex relative {isVertical ? 'flex-row items-start' : 'flex-col items-center'}">
			<!-- Step Node -->
			<button
				type="button"
				role="tab"
				aria-selected={isActive}
				aria-disabled={step.disabled}
				tabindex={isActive ? 0 : -1}
				onclick={() => handleStepClick(step)}
				onkeydown={(e) => handleKeyDown(e, step)}
				disabled={step.disabled}
				class="{sizeClasses[size]} {getNodeClasses(step, isClickable)}"
			>
				{#if step.state === 'loading'}
					<span class="w-[60%] h-[60%] border-2 border-transparent border-t-[var(--step-loading-spinner)] rounded-[var(--radius-pill)] animate-[step-loading-ring_0.8s_linear_infinite]"></span>
				{:else if step.state === 'completed' && !isActive}
					<svg class="w-[60%] h-[60%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				{:else if step.state === 'error'}
					<svg class="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				{:else if showNumbers}
					<span class="tabular-nums">{index + 1}</span>
				{:else if step.icon}
					<span>{step.icon}</span>
				{/if}
			</button>

			<!-- Label -->
			{#if showLabels && step.label}
				<div class="{getLabelClasses(isVertical)}">
					<span class="{getLabelTextClasses(step)}">{step.label}</span>
					{#if step.description}
						<span class="text-[length:var(--text-xs)] text-[var(--color-text-muted)] mt-0.5 leading-snug">{step.description}</span>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Connector (between steps) -->
		{#if index < steps.length - 1}
			{@const connectorSizeClass = size === 'sm' ? 'mt-[11px]' : size === 'lg' ? 'mt-[19px]' : 'mt-[15px]'}
			<div class="relative {isVertical ? 'w-0.5 h-8 ml-[calc(var(--step-node-md)/2)] -translate-x-1/2 shrink-0' : `flex-1 min-w-4 h-0.5 ${connectorSizeClass}`}">
				<div class="absolute inset-0 bg-[var(--step-connector-track)] rounded-[var(--radius-pill)]"></div>
				<div 
					class="absolute inset-0 bg-[var(--step-connector-progress)] rounded-[var(--radius-pill)] transition-transform duration-[var(--step-slow)] ease-[var(--step-ease)] {isVertical ? 'origin-top scale-y-0' : 'origin-left scale-x-0'} {step.completed ? (isVertical ? 'scale-y-100' : 'scale-x-100') : ''}"
				></div>
			</div>
		{/if}
	{/each}
</nav>

<style>
	/* Animations are defined in theme.css and referenced via animate-[] utilities */
</style>
