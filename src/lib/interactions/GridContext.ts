/**
 * Grid Context
 * 
 * Purpose: Svelte context for grid-item communication.
 * Enables grid items to register, check collisions, and update positions.
 */

import { getContext, setContext } from 'svelte';
import { get, writable, type Readable } from 'svelte/store';

type Accessor<T> = T | (() => T);

function toGetter<T>(value: Accessor<T>): () => T {
	return typeof value === 'function' ? (value as () => T) : () => value;
}

// ===== Type Definitions =====

export interface GridItemData {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	element: HTMLElement | null;
}

export interface GridContextValue {
	cellSize: number | { x: number; y: number };
	infinite: boolean;
	snap: boolean;
	snapResolution: number | { x: number; y: number };
	showGrid: boolean;
	items: Readable<Map<string, GridItemData>>;
	registerItem: (id: string, item: GridItemData) => void;
	unregisterItem: (id: string) => void;
	updateItemPosition: (id: string, x: number, y: number) => void;
	getItemAt: (x: number, y: number) => GridItemData | null;
	getItems: () => GridItemData[];
	checkCollision: (x: number, y: number, w: number, h: number, excludeId?: string) => boolean;
	bubbleDragStart?: (id: string, x: number, y: number) => void;
	bubbleDrag?: (id: string, x: number, y: number) => void;
	bubbleDragEnd?: (id: string, x: number, y: number) => void;
}

// ===== Context Key =====

export const GRID_CONTEXT_KEY = Symbol('grid-context');

// ===== Context Creation =====

/**
 * Creates a grid context with reactive state.
 * Should be called by DragGrid and set via setContext.
 */
export function createGridContext(
	cellSize: Accessor<number | { x: number; y: number }>,
	infinite: Accessor<boolean>,
	snap: Accessor<boolean>,
	snapResolution: Accessor<number | { x: number; y: number }>,
	showGrid: Accessor<boolean>,
	bubbleDragStart?: (id: string, x: number, y: number) => void,
	bubbleDrag?: (id: string, x: number, y: number) => void,
	bubbleDragEnd?: (id: string, x: number, y: number) => void
): GridContextValue {
	const cellSizeGetter = toGetter(cellSize);
	const infiniteGetter = toGetter(infinite);
	const snapGetter = toGetter(snap);
	const snapResolutionGetter = toGetter(snapResolution);
	const showGridGetter = toGetter(showGrid);

	const items = writable<Map<string, GridItemData>>(new Map());

	function registerItem(id: string, item: GridItemData): void {
		items.update((map) => {
			map.set(id, item);
			return map;
		});
	}

	function unregisterItem(id: string): void {
		items.update((map) => {
			map.delete(id);
			return map;
		});
	}

	function updateItemPosition(id: string, x: number, y: number): void {
		items.update((map) => {
			const item = map.get(id);
			if (item) {
				item.x = x;
				item.y = y;
			}
			return map;
		});
	}

	function getItemAt(x: number, y: number): GridItemData | null {
		for (const item of get(items).values()) {
			if (x >= item.x && x < item.x + item.w && y >= item.y && y < item.y + item.h) {
				return item;
			}
		}
		return null;
	}

	function getItems(): GridItemData[] {
		return Array.from(get(items).values());
	}

	function checkCollision(
		x: number,
		y: number,
		w: number,
		h: number,
		excludeId?: string
	): boolean {
		for (const item of get(items).values()) {
			// Skip the item being dragged
			if (excludeId && item.id === excludeId) {
				continue;
			}

			// Check bounding box overlap
			const xOverlap = x < item.x + item.w && x + w > item.x;
			const yOverlap = y < item.y + item.h && y + h > item.y;

			if (xOverlap && yOverlap) {
				return true;
			}
		}
		return false;
	}

	return {
		get cellSize() {
			return cellSizeGetter();
		},
		get infinite() {
			return infiniteGetter();
		},
		get snap() {
			return snapGetter();
		},
		get snapResolution() {
			return snapResolutionGetter();
		},
		get showGrid() {
			return showGridGetter();
		},
		items,
		registerItem,
		unregisterItem,
		updateItemPosition,
		getItemAt,
		getItems,
		checkCollision,
		bubbleDragStart,
		bubbleDrag,
		bubbleDragEnd
	};
}

// ===== Context Access =====

/**
 * Gets the grid context from the nearest parent DragGrid.
 * Returns undefined if no context is found.
 */
export function getGridContext(): GridContextValue | undefined {
	return getContext<GridContextValue>(GRID_CONTEXT_KEY);
}

/**
 * Sets the grid context for child components.
 * Should be called by DragGrid component.
 */
export function setGridContext(context: GridContextValue): void {
	setContext(GRID_CONTEXT_KEY, context);
}
