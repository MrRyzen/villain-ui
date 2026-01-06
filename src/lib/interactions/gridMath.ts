/**
 * Grid Math Utilities
 * 
 * Purpose: Internal-only module for coordinate conversion, collision detection,
 * and grid calculations. Not exposed to users.
 */

import type { GridItemData } from './GridContext.js';

// ===== Type Definitions =====

export interface Point {
	x: number;
	y: number;
}

export interface CellSize {
	x: number;
	y: number;
}

export interface Bounds {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface GridBounds {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

export interface VisibleCells {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
}

// ===== Coordinate Conversion =====

/**
 * Normalizes cellSize to CellSize object.
 */
export function normalizeCellSize(cellSize: number | CellSize): CellSize {
	return typeof cellSize === 'number' ? { x: cellSize, y: cellSize } : cellSize;
}

/**
 * Converts logical grid coordinates to pixel positions.
 */
export function logicalToPixel(logical: Point, cellSize: number | CellSize): Point {
	const size = normalizeCellSize(cellSize);
	return {
		x: logical.x * size.x,
		y: logical.y * size.y
	};
}

/**
 * Converts pixel positions to logical grid coordinates.
 */
export function pixelToLogical(pixel: Point, cellSize: number | CellSize): Point {
	const size = normalizeCellSize(cellSize);
	return {
		x: pixel.x / size.x,
		y: pixel.y / size.y
	};
}

/**
 * Snaps logical coordinates to nearest cell boundaries.
 */
export function snapToCell(logical: Point): Point {
	return {
		x: Math.round(logical.x),
		y: Math.round(logical.y)
	};
}

/**
 * Snaps logical coordinates with configurable resolution.
 * Resolution of 1 = whole cells, 0.5 = half cells, 0.1 = tenths, etc.
 */
export function snapWithResolution(
	logical: Point,
	resolution: number | { x: number; y: number }
): Point {
	const res = typeof resolution === 'number' ? { x: resolution, y: resolution } : resolution;
	return {
		x: Math.round(logical.x / res.x) * res.x,
		y: Math.round(logical.y / res.y) * res.y
	};
}

// ===== Collision Detection =====

/**
 * Checks if two rectangular bounds overlap.
 */
export function checkBoundsOverlap(a: Bounds, b: Bounds): boolean {
	const xOverlap = a.x < b.x + b.w && a.x + a.w > b.x;
	const yOverlap = a.y < b.y + b.h && a.y + a.h > b.y;
	return xOverlap && yOverlap;
}

/**
 * Finds all items that collide with the target item.
 */
export function findCollisions(items: GridItemData[], target: GridItemData): GridItemData[] {
	const targetBounds: Bounds = {
		x: target.x,
		y: target.y,
		w: target.w,
		h: target.h
	};

	return items.filter((item) => {
		if (item.id === target.id) return false;

		const itemBounds: Bounds = {
			x: item.x,
			y: item.y,
			w: item.w,
			h: item.h
		};

		return checkBoundsOverlap(targetBounds, itemBounds);
	});
}

/**
 * Checks if a position is occupied by any item.
 */
export function isPositionOccupied(
	items: GridItemData[],
	x: number,
	y: number,
	w: number,
	h: number,
	excludeId?: string
): boolean {
	const targetBounds: Bounds = { x, y, w, h };

	for (const item of items) {
		if (excludeId && item.id === excludeId) {
			continue;
		}

		const itemBounds: Bounds = {
			x: item.x,
			y: item.y,
			w: item.w,
			h: item.h
		};

		if (checkBoundsOverlap(targetBounds, itemBounds)) {
			return true;
		}
	}

	return false;
}

// ===== Grid Calculations =====

/**
 * Calculates the bounding box of all items in the grid.
 */
export function calculateGridBounds(items: GridItemData[]): GridBounds {
	if (items.length === 0) {
		return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
	}

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const item of items) {
		minX = Math.min(minX, item.x);
		minY = Math.min(minY, item.y);
		maxX = Math.max(maxX, item.x + item.w);
		maxY = Math.max(maxY, item.y + item.h);
	}

	return { minX, minY, maxX, maxY };
}

/**
 * Calculates the visible cell range for virtualization.
 * Used in infinite mode to only render visible grid lines.
 */
export function getVisibleCells(
	viewport: DOMRect,
	cellSize: number | CellSize,
	padding: number = 2
): VisibleCells {
	const size = normalizeCellSize(cellSize);

	const startX = Math.floor(viewport.left / size.x) - padding;
	const startY = Math.floor(viewport.top / size.y) - padding;
	const endX = Math.ceil(viewport.right / size.x) + padding;
	const endY = Math.ceil(viewport.bottom / size.y) + padding;

	return { startX, startY, endX, endY };
}

/**
 * Calculates grid dimensions in pixels based on cell size and cell count.
 */
export function calculateGridDimensions(
	cellSize: number | CellSize,
	cellsX: number,
	cellsY: number
): { width: number; height: number } {
	const size = normalizeCellSize(cellSize);
	return {
		width: cellsX * size.x,
		height: cellsY * size.y
	};
}
