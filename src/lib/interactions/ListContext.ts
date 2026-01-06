import { getContext, setContext } from 'svelte';
import { get, writable, type Readable, type Writable } from 'svelte/store';

type Accessor<T> = T | (() => T);

function toGetter<T>(value: Accessor<T>): () => T {
	return typeof value === 'function' ? (value as () => T) : () => value;
}

export interface ListItemData {
	id: string;
	index: number;
	element: HTMLElement | null;
	data: unknown;
}

export interface ListDragState {
	draggedId: string | null;
	fromIndex: number;
	targetIndex: number;
}

export interface ListContextValue {
	registerItem(id: string, item: ListItemData): void;
	unregisterItem(id: string): void;
	getItems(): ListItemData[];
	getItemIndex(id: string): number;
	updateItemIndex(id: string, newIndex: number): void;

	bubbleDragStart?: (id: string, index: number) => void;
	bubbleDrag?: (id: string, currentIndex: number, targetIndex: number) => void;
	bubbleDragEnd?: (id: string, finalIndex: number) => void;

	axis: 'x' | 'y';
	gap: number;
	orientation: 'horizontal' | 'vertical';

	items: Readable<Map<string, ListItemData>>;
	drag: Writable<ListDragState>;
}

export const REORDER_LIST_CONTEXT_KEY = Symbol('REORDER_LIST_CONTEXT');

export function createListContext(
	axis: Accessor<'x' | 'y'> = 'y',
	gap: Accessor<number> = 8,
	orientation: Accessor<'horizontal' | 'vertical'> = 'vertical'
): ListContextValue {
	const axisGetter = toGetter(axis);
	const gapGetter = toGetter(gap);
	const orientationGetter = toGetter(orientation);

	const items = writable<Map<string, ListItemData>>(new Map());

	const drag = writable<ListDragState>({
		draggedId: null,
		fromIndex: -1,
		targetIndex: -1
	});

	return {
		registerItem(id, item) {
			items.update((map) => {
				map.set(id, item);
				return map;
			});
		},
		unregisterItem(id) {
			items.update((map) => {
				map.delete(id);
				return map;
			});
		},
		getItems() {
			return Array.from(get(items).values()).sort((a, b) => a.index - b.index);
		},
		getItemIndex(id) {
			return get(items).get(id)?.index ?? -1;
		},
		updateItemIndex(id, newIndex) {
			items.update((map) => {
				const item = map.get(id);
				if (item) {
					item.index = newIndex;
					map.set(id, item);
				}
				return map;
			});
		},

		get axis() {
			return axisGetter();
		},
		get gap() {
			return gapGetter();
		},
		get orientation() {
			return orientationGetter();
		},

		items,
		drag
	};
}

export function getListContext(): ListContextValue | undefined {
	return getContext(REORDER_LIST_CONTEXT_KEY);
}

export function setListContext(context: ListContextValue): void {
	setContext(REORDER_LIST_CONTEXT_KEY, context);
}
