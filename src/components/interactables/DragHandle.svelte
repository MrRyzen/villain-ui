<script lang="ts">
	export interface Props {
		position?:
			| 'center'
			| 'top-left'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-right';
		variant?: 'dots' | 'lines' | 'icon';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: import('svelte').Snippet;
		element?: HTMLElement; // Bindable reference
	}
	let {
		position = 'center',
		variant = 'dots',
		size = 'md',
		class: className = '',
		children,
		element = $bindable(),
	}: Props = $props();

	// ===== Derived Classes =====

	const sizeClasses: Record<NonNullable<Props['size']>, string> = {
		sm: 'w-6 h-6 text-xs',
		md: 'w-8 h-8 text-sm',
		lg: 'w-10 h-10 text-base',
	};

	const positionClasses: Record<NonNullable<Props['position']>, string> = {
		center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
		'top-left': '-top-1 -left-1',
		'top-right': '-top-1 -right-1',
		'bottom-left': '-bottom-1 -left-1',
		'bottom-right': '-bottom-1 -right-1',
	};

	const computedClasses = $derived.by(() => {
		const classes = [
			'drag-handle',
			'absolute',
			'z-[var(--z-10)]',
			'backdrop-blur-md',
			'bg-linear-to-br from-base-1/40 to-base-2/60',
			'border border-base-3/30',
			'rounded-[var(--radius-lg)]',
			'p-2',
			'cursor-grab',
			'text-text-soft',
			'shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
			'hover:border-accent/40',
			'hover:shadow-[0_0_16px_rgba(139,92,246,0.2)]',
			'hover:scale-105',
			'active:cursor-grabbing',
			'active:scale-95',
			'active:border-accent/60',
			'transition-all',
			'duration-[var(--duration-200)]',
			'ease-[var(--ease-luxe)]',
			positionClasses[position],
			sizeClasses[size],
		];

		if (className) classes.push(className);

		return classes.join(' ');
	});
</script>

<div
	bind:this={element}
	class={computedClasses}
	role="button"
	tabindex="0"
	aria-label="Drag handle"
>
	{#if children}
		{@render children()}
	{:else if position === 'center'}
		<!-- Center: 4 carets on edges pointing outward to corners -->
		<div class="relative w-full h-full">
			<!-- Top-left caret - positioned on edge -->
			<svg class="absolute w-2.5 h-2.5" style="top: 20%; left: 20%; transform: translate(-50%, -50%);" viewBox="0 0 10 10" fill="currentColor">
				<path d="M0,0 L6,0 L0,6 Z" opacity="0.9"/>
			</svg>
			<!-- Top-right caret - positioned on edge -->
			<svg class="absolute w-2.5 h-2.5" style="top: 20%; right: 20%; transform: translate(50%, -50%);" viewBox="0 0 10 10" fill="currentColor">
				<path d="M4,0 L10,0 L10,6 Z" opacity="0.9"/>
			</svg>
			<!-- Bottom-left caret - positioned on edge -->
			<svg class="absolute w-2.5 h-2.5" style="bottom: 20%; left: 20%; transform: translate(-50%, 50%);" viewBox="0 0 10 10" fill="currentColor">
				<path d="M0,4 L0,10 L6,10 Z" opacity="0.9"/>
			</svg>
			<!-- Bottom-right caret - positioned on edge -->
			<svg class="absolute w-2.5 h-2.5" style="bottom: 20%; right: 20%; transform: translate(50%, 50%);" viewBox="0 0 10 10" fill="currentColor">
				<path d="M4,10 L10,10 L10,4 Z" opacity="0.9"/>
			</svg>
		</div>
	{:else if position === 'top-left'}
		<!-- Top-left corner: caret pointing top-left -->
		<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
			<path d="M0,0 L8,0 L0,8 Z" opacity="0.9"/>
		</svg>
	{:else if position === 'top-right'}
		<!-- Top-right corner: caret pointing top-right -->
		<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
			<path d="M4,0 L12,0 L12,8 Z" opacity="0.9"/>
		</svg>
	{:else if position === 'bottom-left'}
		<!-- Bottom-left corner: caret pointing bottom-left -->
		<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
			<path d="M0,4 L0,12 L8,12 Z" opacity="0.9"/>
		</svg>
	{:else if position === 'bottom-right'}
		<!-- Bottom-right corner: caret pointing bottom-right -->
		<svg class="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
			<path d="M4,12 L12,12 L12,4 Z" opacity="0.9"/>
		</svg>
	{:else if variant === 'lines'}
		<!-- Fallback to lines variant -->
		<div class="flex flex-col gap-1.5 justify-center h-full">
			{#each Array(3) as _, i (i)}
				<div class="h-0.5 w-full rounded-full bg-linear-to-r from-text-soft/60 via-text-soft/80 to-text-soft/60 shadow-[0_0_4px_rgba(139,92,246,0.15)]"></div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.drag-handle:focus-visible {
		outline: none;
		border-color: var(--color-accent);
		box-shadow:
			0 0 0 2px var(--color-accent-glow),
			0 0 20px rgba(139, 92, 246, 0.4),
			0 4px 12px rgba(0, 0, 0, 0.3);
	}
</style>
