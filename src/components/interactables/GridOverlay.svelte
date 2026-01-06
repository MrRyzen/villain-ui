<script lang="ts">
	/**
	 * Grid Overlay Component
	 * 
	 * Purpose: Internal component for rendering grid lines.
	 * Supports both fixed and infinite (virtualized) modes.
	 */

	import { getVisibleCells } from '$lib/interactions/gridMath.js';

	// ===== Props =====

	interface Props {
		cellSize: { x: number; y: number };
		gridBounds: { width: number; height: number };
		lineColor: string;
		lineWidth: number;
		infinite: boolean;
		viewportRect?: DOMRect;
		containerElement?: HTMLElement | null;
	}

	let {
		cellSize,
		gridBounds,
		lineColor,
		lineWidth,
		infinite,
		viewportRect,
		containerElement
	}: Props = $props();

	// ===== Derived State =====

	// Calculate actual overlay dimensions
	const overlayDimensions = $derived.by(() => {
		if (infinite && containerElement) {
			// Infinite mode: cover entire scrollable area
			return {
				width: containerElement.scrollWidth,
				height: containerElement.scrollHeight
			};
		} else {
			// Fixed mode: use provided grid bounds
			return gridBounds;
		}
	});

	const visibleLines = $derived.by(() => {
		if (infinite && viewportRect) {
			// Virtualized rendering for infinite mode
			const visible = getVisibleCells(viewportRect, cellSize, 2);
			return {
				startX: visible.startX,
				startY: visible.startY,
				endX: visible.endX,
				endY: visible.endY
			};
		} else {
			// Render all lines for fixed mode
			const cellsX = Math.ceil(gridBounds.width / cellSize.x);
			const cellsY = Math.ceil(gridBounds.height / cellSize.y);
			return {
				startX: 0,
				startY: 0,
				endX: cellsX,
				endY: cellsY
			};
		}
	});

	const verticalLines = $derived.by(() => {
		const lines: number[] = [];
		for (let i = visibleLines.startX; i <= visibleLines.endX; i++) {
			lines.push(i * cellSize.x);
		}
		return lines;
	});

	const horizontalLines = $derived.by(() => {
		const lines: number[] = [];
		for (let i = visibleLines.startY; i <= visibleLines.endY; i++) {
			lines.push(i * cellSize.y);
		}
		return lines;
	});
</script>

<svg
	class="grid-overlay absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30"
	style:width="{overlayDimensions.width}px"
	style:height="{overlayDimensions.height}px"
>
	<!-- Vertical lines -->
	{#each verticalLines as x}
		<line
			x1={x}
			y1={0}
			x2={x}
			y2={overlayDimensions.height}
			stroke={lineColor}
			stroke-width={lineWidth}
		/>
	{/each}

	<!-- Horizontal lines -->
	{#each horizontalLines as y}
		<line
			x1={0}
			y1={y}
			x2={overlayDimensions.width}
			y2={y}
			stroke={lineColor}
			stroke-width={lineWidth}
		/>
	{/each}
</svg>

<style>
	.grid-overlay {
		user-select: none;
		-webkit-user-select: none;
	}
</style>
