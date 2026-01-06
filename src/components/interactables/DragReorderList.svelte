<script lang="ts">
	import { createListContext, setListContext } from '$lib/interactions/ListContext.js';
	import { reorderArray } from '$lib/interactions/listMath.js';
	import ListItem from './ListItem.svelte';
	import type { Snippet } from 'svelte';
	import { get } from 'svelte/store';

	export interface Props {
		items: unknown[];
		axis?: 'x' | 'y';
		orientation?: 'horizontal' | 'vertical';
		gap?: number;
		disabled?: boolean;
		getKey?: (item: unknown, index: number) => string | number;
		onReorder?: (event: {
			items: unknown[];
			fromIndex: number;
			toIndex: number;
		}) => void;
		children?: Snippet<[item: unknown, index: number]>;
		class?: string;
	}

	let {
		items = $bindable(),
		axis = 'y',
		orientation = 'vertical',
		gap = 8,
		disabled = false,
		getKey = (_item: unknown, index: number) => index,
		onReorder,
		children,
		class: className = ''
	}: Props = $props();

	/* ─────────────────────────────
		Context
	───────────────────────────── */

	const context = createListContext(
		() => axis,
		() => gap,
		() => orientation
	);

	// expose disabled if you want items to read it later
	Object.defineProperty(context as any, 'disabled', {
		get: () => disabled,
		configurable: true
	});

	/* ─────────────────────────────
		Drag lifecycle (single source of truth)
	───────────────────────────── */

	context.bubbleDragStart = (id: string, index: number) => {
		context.drag.set({ draggedId: id, fromIndex: index, targetIndex: index });
	};

	context.bubbleDrag = (_id: string, _currentIndex: number, targetIndex: number) => {
		context.drag.update((current) => ({ ...current, targetIndex }));
	};

	context.bubbleDragEnd = (_id: string, finalIndex: number) => {
		const fromIndex = get(context.drag).fromIndex;

		if (
			fromIndex !== -1 &&
			finalIndex !== -1 &&
			fromIndex !== finalIndex
		) {
			const reorderedItems = reorderArray(items, fromIndex, finalIndex);
			items = reorderedItems;

			onReorder?.({
				items: reorderedItems,
				fromIndex,
				toIndex: finalIndex
			});
		}

		// reset shared drag state
		context.drag.set({ draggedId: null, fromIndex: -1, targetIndex: -1 });
	};

	setListContext(context);

	/* ─────────────────────────────
		Styles
	───────────────────────────── */

	const containerClasses = $derived(
		[
			'glass-panel',
			'rounded-[var(--radius-lg)]',
			'flex',
			orientation === 'vertical' ? 'flex-col' : 'flex-row',
			'transition-all',
			'duration-[var(--duration-300)]',
			'ease-[var(--ease-luxe)]',
			className
		].filter(Boolean).join(' ')
	);
</script>

<div class={containerClasses} style:gap={`${gap}px`}>
	{#each items as item, index (getKey(item, index))}
		<ListItem {item} {index} render={children} />
	{/each}
</div>
