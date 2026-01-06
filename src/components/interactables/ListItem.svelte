<script lang="ts">
	import type { Snippet } from 'svelte';
	import Draggable from './Draggable.svelte';
	import { getListContext } from '$lib/interactions/ListContext.js';
	import { findTargetIndex, calculateItemBounds } from '$lib/interactions/listMath.js';
	import { createId } from '$lib/internal/id.js';
	import type { DragEvent } from './Draggable.svelte';
	interface Props {
		item: unknown;
		index: number;
		render?: Snippet<[item: unknown, index: number]>;
	}

	let { item, index, render }: Props = $props();

	const context = getListContext();
	if (!context) {
		throw new Error('ListItem must be used within DragReorderList');
	}

	const drag = context.drag;

	const itemId = createId('list-item');

	let itemElement = $state<HTMLElement | null>(null);
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let localTargetIndex = $state(0);
	let gapOffset = $state(0);

	$effect(() => {
		if (!isDragging) {
			localTargetIndex = index;
		}
	});

	/* ─────────────────────────────
		Registration
	───────────────────────────── */

	$effect(() => {
		if (!itemElement) return;

		context.registerItem(itemId, {
			id: itemId,
			index,
			element: itemElement,
			data: item,
		});

		return () => {
			context.unregisterItem(itemId);
		};
	});

	$effect(() => {
		context.updateItemIndex(itemId, index);
	});

	/* ─────────────────────────────
		Shared drag state (read-only)
	───────────────────────────── */

	const draggedId = $derived($drag.draggedId);
	const draggedFrom = $derived($drag.fromIndex);
	const draggedTarget = $derived($drag.targetIndex);

	/* ─────────────────────────────
		Gap offset calculation
	───────────────────────────── */

	$effect(() => {
		if (
			isDragging ||
			!itemElement ||
			!draggedId ||
			draggedFrom === -1 ||
			draggedTarget === -1 ||
			draggedId === itemId
		) {
			gapOffset = 0;
			return;
		}

		const itemSize =
			context.orientation === 'vertical'
				? itemElement.offsetHeight
				: itemElement.offsetWidth;

		if (
			draggedFrom < draggedTarget &&
			index > draggedFrom &&
			index <= draggedTarget
		) {
			// dragging forward → items shift backward
			gapOffset = -(itemSize + context.gap);
		} else if (
			draggedFrom > draggedTarget &&
			index < draggedFrom &&
			index >= draggedTarget
		) {
			// dragging backward → items shift forward
			gapOffset = +(itemSize + context.gap);
		} else {
			gapOffset = 0;
		}
	});

	/* ─────────────────────────────
		Drag handlers
	───────────────────────────── */

	function handleDragStart() {
		if (!context) return;
		isDragging = true;
		gapOffset = 0;
		context.bubbleDragStart?.(itemId, index);
	}

	function handleDrag(event: DragEvent) {
		if (!itemElement || !context) return;

		dragOffset = { x: event.deltaX, y: event.deltaY };

		const items = context.getItems();
		const itemBounds = calculateItemBounds(
			items,
			context.gap,
			context.orientation
		);

		const rect = itemElement.getBoundingClientRect();
		const currentPos =
			context.orientation === 'vertical'
				? rect.top + dragOffset.y + rect.height / 2
				: rect.left + dragOffset.x + rect.width / 2;

		const nextTargetIndex = findTargetIndex(
			itemId,
			currentPos,
			itemBounds,
			items,
			context.orientation
		);

		localTargetIndex = nextTargetIndex;
		context.bubbleDrag?.(itemId, index, nextTargetIndex);
	}

	function handleDragEnd() {
		if (!context) return;
		isDragging = false;
		dragOffset = { x: 0, y: 0 };
		context.bubbleDragEnd?.(itemId, localTargetIndex);
		gapOffset = 0;
	}

	/* ─────────────────────────────
		Styles
	───────────────────────────── */

	const itemClasses = $derived(
		[
			isDragging ? 'accent-glow' : 'panel-base',
			'rounded-[var(--radius-md)]',
			'p-4',
			'transition-all',
			'duration-[var(--duration-300)]',
			'ease-[var(--ease-luxe)]',
			!isDragging && 'hover:panel-raised',
			isDragging && 'will-change-transform',
		]
			.filter(Boolean)
			.join(' ')
	);

	const transformStyle = $derived(
		gapOffset !== 0
			? context.orientation === 'vertical'
				? `translateY(${gapOffset}px)`
				: `translateX(${gapOffset}px)`
			: ''
	);

	const zIndexStyle = $derived(isDragging ? 'var(--z-50)' : '');
</script>

<Draggable
	mode="free"
	axis={context.axis}
	handle="self"
	ghost={true}
	onDragStart={handleDragStart}
	onDrag={handleDrag}
	onDragEnd={handleDragEnd}
>
	<div
		bind:this={itemElement}
		class={itemClasses}
		style:transform={transformStyle}
		style:z-index={zIndexStyle}
	>
		{#if render}
			{@render render(item, index)}
		{/if}
	</div>
</Draggable>
