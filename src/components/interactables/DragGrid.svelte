<script lang="ts">
	import { createGridContext, setGridContext } from '$lib/interactions/GridContext.js';
	import GridOverlay from './GridOverlay.svelte';
	import {
		normalizeCellSize,
		calculateGridBounds,
		calculateGridDimensions,
	} from '$lib/interactions/gridMath.js';

	export interface Props {
		cellSize?: number | { x: number; y: number };
		infinite?: boolean;
		showGrid?: boolean;
		snap?: boolean;
		snapResolution?: number | { x: number; y: number };
		gridLineColor?: string;
		gridLineWidth?: number;
		minWidth?: number;
		minHeight?: number;
		class?: string;
		children?: import('svelte').Snippet;
		onItemDragStart?: (event: { id: string; x: number; y: number }) => void;
		onItemDrag?: (event: { id: string; x: number; y: number }) => void;
		onItemDragEnd?: (event: { id: string; x: number; y: number }) => void;
	}

	let {
		cellSize = 24,
		infinite = false,
		showGrid = false,
		snap = true,
		snapResolution = 1,
		gridLineColor = 'var(--color-border)',
		gridLineWidth = 1,
		minWidth = 20,
		minHeight = 20,
		class: className = '',
		children,
		onItemDragStart,
		onItemDrag,
		onItemDragEnd,
	}: Props = $props();

	// ===== State Management =====

	let containerElement = $state<HTMLElement | null>(null);
	let viewportRect = $state<DOMRect | undefined>(undefined);
	let scrollDebounceTimer = $state<number | null>(null);

	// Normalize cell size
	const normalizedCellSize = $derived(normalizeCellSize(cellSize));

	// Bubble callback functions
	const bubbleDragStart = (id: string, x: number, y: number) =>
		onItemDragStart?.({ id, x, y });
	const bubbleDrag = (id: string, x: number, y: number) =>
		onItemDrag?.({ id, x, y });
	const bubbleDragEnd = (id: string, x: number, y: number) =>
		onItemDragEnd?.({ id, x, y });

	// Create and set grid context with bubble callbacks
	const gridContext = createGridContext(
		() => cellSize,
		() => infinite,
		() => snap,
		() => snapResolution,
		() => showGrid,
		bubbleDragStart,
		bubbleDrag,
		bubbleDragEnd
	);
	setGridContext(gridContext);

	// Get all registered items (reactive)
	const itemsStore = gridContext.items;
	const items = $derived(Array.from($itemsStore.values()));

	// Calculate grid bounds from items from items
	const gridBounds = $derived.by(() => {
		if (items.length === 0) {
			// No items: use minimum dimensions
			return calculateGridDimensions(
				normalizedCellSize,
				minWidth,
				minHeight
			);
		}

		// Calculate bounds from items
		const itemBounds = calculateGridBounds(items);

		if (infinite) {
			// Infinite mode: size based on items with padding
			const padding = 5; // Extra cells of padding
			const cellsX = Math.max(itemBounds.maxX + padding, minWidth);
			const cellsY = Math.max(itemBounds.maxY + padding, minHeight);
			return calculateGridDimensions(normalizedCellSize, cellsX, cellsY);
		} else {
			// Fixed mode: use max of items bounds or min dimensions
			const cellsX = Math.max(itemBounds.maxX, minWidth);
			const cellsY = Math.max(itemBounds.maxY, minHeight);
			return calculateGridDimensions(normalizedCellSize, cellsX, cellsY);
		}
	});

	// ===== Computed Classes =====

	const computedClasses = $derived.by(() => {
		const classes = [
			'drag-grid',
			'glass-panel',
			'rounded-[var(--radius-lg)]',
			'relative',
		];

		if (infinite) {
			classes.push('w-full', 'h-full', 'overflow-auto');
		} else {
			classes.push('w-full', 'h-full');
		}

		if (className) classes.push(className);

		return classes.join(' ');
	});

	// ===== Scroll Handling (for infinite mode) =====

	function handleScroll(): void {
		if (!infinite || !containerElement) return;

		// Debounce scroll updates
		if (scrollDebounceTimer !== null) {
			clearTimeout(scrollDebounceTimer);
		}

		scrollDebounceTimer = window.setTimeout(() => {
			if (containerElement) {
				viewportRect = containerElement.getBoundingClientRect();
			}
		}, 16); // ~60fps
	}

	// ===== Lifecycle =====

	$effect(() => {
		if (infinite && containerElement) {
			viewportRect = containerElement.getBoundingClientRect();
		}
	});

	$effect(() => {
		return () => {
			if (scrollDebounceTimer !== null) {
				clearTimeout(scrollDebounceTimer);
			}
		};
	});
</script>

<div
	bind:this={containerElement}
	class={computedClasses}
	style:min-width="{gridBounds.width}px"
	style:min-height="{gridBounds.height}px"
	style:will-change={infinite ? 'transform' : undefined}
	onscroll={handleScroll}
>
	{#if showGrid}
		<GridOverlay
			cellSize={normalizedCellSize}
			{gridBounds}
			lineColor={gridLineColor}
			lineWidth={gridLineWidth}
			{infinite}
			{viewportRect}
			{containerElement}
		/>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.drag-grid {
		position: relative;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	.drag-grid::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.drag-grid::-webkit-scrollbar-track {
		background: var(--color-bg-secondary);
		border-radius: var(--radius-sm);
	}

	.drag-grid::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-sm);
	}

	.drag-grid::-webkit-scrollbar-thumb:hover {
		background: var(--color-text-soft);
	}
</style>
