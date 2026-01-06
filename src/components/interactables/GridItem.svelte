<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import Draggable from './Draggable.svelte';
	import { getGridContext, type GridItemData } from '$lib/interactions/GridContext.js';
	import {
		logicalToPixel,
		pixelToLogical,
		snapWithResolution,
		normalizeCellSize,
	} from '$lib/interactions/gridMath.js';

	export interface Props {
		x: number;
		y: number;
		w?: number;
		h?: number;
		disabled?: boolean;
		payload?: unknown;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		x: initialX,
		y: initialY,
		w = 1,
		h = 1,
		disabled = false,
		payload,
		class: className = '',
		children,
	}: Props = $props();

	// ===== State Management =====

	const itemId = createId('grid-item');
	let itemElement = $state<HTMLElement | null>(null);
	let isDragging = $state(false);
	let position = $state({ x: initialX, y: initialY });
	let previousValidPosition = $state({ x: initialX, y: initialY });

	// Get grid context
	const gridContext = getGridContext();
	if (!gridContext) {
		throw new Error('GridItem must be used inside a DragGrid component');
	}

	// Normalize cell size
	const cellSize = $derived(normalizeCellSize(gridContext.cellSize));

	// Calculate pixel position from logical coordinates
	const pixelPosition = $derived(logicalToPixel(position, cellSize));

	// ===== Computed Classes =====

	const computedClasses = $derived.by(() => {
		const classes = [
			'grid-item',
			'panel-raised',
			'rounded-[var(--radius-md)]',
			'transition-all',
			'duration-[var(--duration-300)]',
		];

		if (isDragging) {
			classes.push('accent-glow');
		}

		if (className) classes.push(className);

		return classes.join(' ');
	});

	// ===== Registration with Grid Context =====

	$effect(() => {
		// Register item with grid
		const itemData: GridItemData = {
			id: itemId,
			x: position.x,
			y: position.y,
			w,
			h,
			element: itemElement,
		};

		gridContext.registerItem(itemId, itemData);

		return () => {
			// Unregister on unmount
			gridContext.unregisterItem(itemId);
		};
	});

	// ===== Drag Event Handlers =====

	function handleDragStart(): void {
		isDragging = true;
		previousValidPosition = { ...position };

		// Bubble event to parent grid
		gridContext?.bubbleDragStart?.(itemId, position.x, position.y);
	}

	function handleDrag(event: {
		id: string;
		x: number;
		y: number;
		deltaX: number;
		deltaY: number;
	}): void {
		// Convert pixel delta to logical delta
		const logicalDelta = pixelToLogical(
			{ x: event.deltaX, y: event.deltaY },
			cellSize
		);

		// Calculate new logical position
		let newX = previousValidPosition.x + logicalDelta.x;
		let newY = previousValidPosition.y + logicalDelta.y;

		// Apply snap if enabled
		if (gridContext?.snap) {
			const snapped = snapWithResolution(
				{ x: newX, y: newY },
				gridContext.snapResolution
			);
			newX = snapped.x;
			newY = snapped.y;
		}

		// Check for collision
		const hasCollision = gridContext?.checkCollision(
			Math.round(newX),
			Math.round(newY),
			w,
			h,
			itemId
		);

		// Only update if no collision
		if (!hasCollision) {
			position = { x: newX, y: newY };

			// Bubble event to parent grid
			gridContext?.bubbleDrag?.(itemId, newX, newY);
		}
	}

	function handleDragEnd(): void {
		isDragging = false;

		// Snap to final position with resolution
		if (!gridContext) return;
		const snappedPosition = snapWithResolution(
			position,
			gridContext.snapResolution
		);
		position = snappedPosition;

		// Update grid context with final position
		gridContext.updateItemPosition(
			itemId,
			snappedPosition.x,
			snappedPosition.y
		);

		// Update previous valid position
		previousValidPosition = snappedPosition;

		// Bubble event to parent grid
		gridContext.bubbleDragEnd?.(
			itemId,
			snappedPosition.x,
			snappedPosition.y
		);
	}

	// ===== Update Position on Prop Changes =====

	$effect(() => {
		// Update position when props change (external control)
		if (!isDragging) {
			position = { x: initialX, y: initialY };
			previousValidPosition = { x: initialX, y: initialY };
		}
	});
</script>

<div
	bind:this={itemElement}
	class={computedClasses}
	style:position="absolute"
	style:left="{pixelPosition.x}px"
	style:top="{pixelPosition.y}px"
	style:width="{w * cellSize.x}px"
	style:height="{h * cellSize.y}px"
	style:will-change={isDragging ? 'transform' : undefined}
	style:z-index={isDragging ? 'var(--z-50)' : 'var(--z-10)'}
>
	<Draggable
		mode="free"
		handle="self"
		{disabled}
		{payload}
		ghost={false}
		class="w-full h-full"
		onDragStart={handleDragStart}
		onDrag={handleDrag}
		onDragEnd={handleDragEnd}
	>
		{#if children}
			{@render children()}
		{/if}
	</Draggable>
</div>

<style>
	.grid-item {
		position: absolute;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.grid-item:focus-within {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
