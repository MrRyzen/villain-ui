<script lang="ts">
	import { getDragContext } from '$lib/interactions/DragContext';
	import type { Snippet } from 'svelte';
	import type { DropEvent, DragEnterEvent } from './DropZone.types';

	interface Props {
		// Drag acceptance
		accept?: string | string[];
		disabled?: boolean;

		// Styling
		variant?: 'default' | 'glass' | 'raised';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		rounded?: boolean;
		minHeight?: string;

		// Event handlers
		onDragEnter?: (event: DragEnterEvent) => void;
		onDragLeave?: () => void;
		onDrop?: (event: DropEvent) => void;

		// Slots
		children?: Snippet<[isOver: boolean, canDrop: boolean]>;
		header?: Snippet;
		footer?: Snippet;
		empty?: Snippet; // Shown when not dragging and no custom children

		// Class override
		class?: string;
	}

	let {
		accept,
		disabled = false,
		variant = 'default',
		padding = 'md',
		rounded = true,
		minHeight = '200px',
		onDragEnter,
		onDragLeave,
		onDrop,
		children,
		header,
		footer,
		empty,
		class: className = '',
		...restProps
	}: Props = $props();

	// ===== Drag Context =====

	const dragContext = getDragContext();
	if (!dragContext) {
		throw new Error(
			'DropZone must be used within a component tree that has DragContext'
		);
	}

	const { activeId, type, payload, velocity } = dragContext;

	// ===== State Management =====

	let dropZoneElement = $state<HTMLElement | null>(null);
	let isOver = $state(false);
	let wasOver = $state(false);
	let didDrop = $state(false);
	let canDropAtDrop = $state(false);
	let lastActiveId = $state<string | null>(null);

	// Cache the drag data to use on drop (before context clears)
	let lastType = $state<string | null>(null);
	let lastPayload = $state<unknown>(null);
	let lastVelocity = $state<{ x: number; y: number }>({ x: 0, y: 0 });

	// ===== Derived State =====

	const canDrop = $derived.by(() => {
		if (disabled) return false;
		if (!$activeId) return false;
		if (!accept) return true;
		if (!$type) return false;

		const acceptList = Array.isArray(accept) ? accept : [accept];
		return acceptList.includes($type);
	});

	const isDragging = $derived(!!$activeId);

	// ===== Padding Classes =====

	const paddingClasses = {
		none: 'p-0',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8',
	};

	// ===== Variant Classes =====

	const variantClasses = $derived.by(() => {
		if (variant === 'glass') {
			return 'glass-panel bg-[var(--color-accent-overlay-5)] border-[var(--color-border-glow)]';
		} else if (variant === 'raised') {
			return 'panel-raised';
		} else {
			return 'panel-base';
		}
	});

	// ===== Drop Zone Classes =====

	const dropZoneClasses = $derived.by(() => {
		const classes = [
			variantClasses,
			paddingClasses[padding],
			rounded ? 'rounded-[var(--radius-lg)]' : '',
			'border-2',
			'transition-all',
			'duration-[var(--duration-300)]',
			'ease-[var(--ease-luxe)]',
			'relative',
			'overflow-hidden',
		];

		// State-based styling
		if (isOver && canDrop) {
			classes.push(
				'border-accent',
				'border-solid',
				'bg-[var(--color-accent-overlay-10)]',
				'accent-glow'
			);
		} else if (isOver && !canDrop) {
			classes.push(
				'border-error',
				'border-solid',
				'bg-[var(--color-error-overlay-10)]',
				'shadow-[var(--shadow-error-glow)]'
			);
		} else if (isDragging && canDrop) {
			classes.push(
				'border-dashed',
				'border-[var(--color-accent-overlay-30)]',
				'bg-[var(--color-accent-overlay-5)]'
			);
		} else {
			classes.push('border-dashed', 'border-border');
		}

		if (className) classes.push(className);

		return classes.filter(Boolean).join(' ');
	});

	// ===== Content Area Classes =====

	const contentClasses = $derived.by(() => {
		const classes = [
			'flex',
			'flex-col',
			'items-center',
			'justify-center',
			'text-center',
			'transition-all',
			'duration-[var(--duration-200)]',
			'ease-[var(--ease-luxe)]',
		];

		if (isOver && canDrop) {
			classes.push('scale-105');
		} else if (isOver && !canDrop) {
			classes.push('scale-95', 'opacity-70');
		}

		return classes.join(' ');
	});

	// ===== Pointer Tracking =====

	$effect(() => {
		if (!$activeId || !dropZoneElement) return;

		let disposed = false;

		function handlePointerMove(e: PointerEvent) {
			if (disposed) return;

			const rect = dropZoneElement!.getBoundingClientRect();
			const inside =
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom;

			if (inside) {
				wasOver = true;

				canDropAtDrop = canDrop;
				lastType = $type;
				lastPayload = $payload;
				lastVelocity = $velocity;

				if (!isOver) {
					isOver = true;
					if (canDrop && $type) {
						onDragEnter?.({ payload: $payload, type: $type });
					}
				}
			} else if (isOver) {
				isOver = false;
				wasOver = false;
				lastType = null;
				lastPayload = null;
				lastVelocity = { x: 0, y: 0 };
				onDragLeave?.();
			}
		}

		document.addEventListener('pointermove', handlePointerMove);

		return () => {
			disposed = true;
			document.removeEventListener('pointermove', handlePointerMove);
		};
	});

	$effect(() => {
		// drag started
		if (!lastActiveId && $activeId) {
			wasOver = false;
			didDrop = false;
		}

		// drag ended
		if (lastActiveId && !$activeId) {
			if (wasOver && canDropAtDrop) {
				console.log('DropZone registering drop', {
					lastType,
					lastPayload,
					lastVelocity,
				});
				onDrop?.({
					payload: lastPayload,
					type: lastType!,
					velocity: lastVelocity,
				});
				didDrop = true;
			}

			// hard reset after resolution
			wasOver = false;
			isOver = false;
			canDropAtDrop = false;
		}

		lastActiveId = $activeId;
	});
</script>

<div
	bind:this={dropZoneElement}
	class={dropZoneClasses}
	style:min-height={minHeight}
	role="region"
	aria-label="Drop zone"
	aria-dropeffect={isOver && canDrop ? 'move' : 'none'}
	{...restProps}
>
	{#if header}
		<div class="pb-3 mb-4 border-b border-border-strong w-full">
			{@render header()}
		</div>
	{/if}

	<div class={contentClasses} style:flex="1" style:width="100%">
		{#if children}
			{@render children(isOver, canDrop)}
		{:else if !isDragging && empty}
			{@render empty()}
		{:else}
			<!-- Default drop zone content -->
			<div class="space-y-3">
				{#if isOver && canDrop}
					<div
						class="text-lg text-accent font-medium animate-[glow-pulse_2s_ease-in-out_infinite]"
					>
						Drop here
					</div>
					<div class="text-sm text-text-soft">
						Release to drop item
					</div>
				{:else if isOver && !canDrop}
					<div class="text-lg text-error font-medium">
						Cannot drop here
					</div>
					<div class="text-sm text-text-muted">
						This item type is not accepted
					</div>
				{:else if isDragging && canDrop}
					<div class="text-2xl text-accent opacity-50 mb-2">⬇</div>
					<div class="text-lg text-text font-medium">Drag here</div>
					<div class="text-sm text-text-soft">
						{accept
							? `Accepts: ${Array.isArray(accept) ? accept.join(', ') : accept}`
							: 'Accepts all items'}
					</div>
				{:else}
					<div class="text-lg text-text-muted">Drop zone ready</div>
					<div class="text-sm text-text-muted">
						{accept
							? `Accepts: ${Array.isArray(accept) ? accept.join(', ') : accept}`
							: 'Accepts all draggable items'}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if footer}
		<div class="pt-3 mt-4 border-t border-border-strong w-full">
			{@render footer()}
		</div>
	{/if}

	<!-- Visual indicator overlay when drag is active -->
	{#if isDragging && canDrop && !isOver}
		<div
			class="absolute inset-0 pointer-events-none border-2 border-dashed border-accent opacity-30 rounded-[inherit] animate-[glow-pulse_2s_ease-in-out_infinite]"
		></div>
	{/if}
</div>
