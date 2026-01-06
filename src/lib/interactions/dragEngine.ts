/**
 * Internal Drag Engine
 * 
 * Purpose: Internal-only module for pointer normalization, lifecycle management,
 * and constraint math. Not exposed to users.
 */

// ===== Type Definitions =====

export interface PointerData {
	clientX: number;
	clientY: number;
	pageX: number;
	pageY: number;
	pointerId?: number;
}

export interface Point {
	x: number;
	y: number;
}

export interface DragEngineState {
	state: 'idle' | 'pending' | 'dragging' | 'released';
	startPoint: Point;
	currentPoint: Point;
	previousPoint: Point;
	delta: Point;
	velocity: Point;
	timestamp: number;
}

export interface Bounds {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface SnapConfig {
	x?: number;
	y?: number;
	threshold?: number;
}

// ===== Pointer Normalization =====

/**
 * Normalizes pointer events from mouse, touch, or pointer events
 * into a unified coordinate interface.
 */
export function normalizePointerEvent(
	event: MouseEvent | TouchEvent | PointerEvent
): PointerData {
	// Handle touch events
	if ('touches' in event) {
		const touch = event.touches[0] || event.changedTouches[0];
		return {
			clientX: touch.clientX,
			clientY: touch.clientY,
			pageX: touch.pageX,
			pageY: touch.pageY
		};
	}

	// Handle mouse and pointer events
	return {
		clientX: event.clientX,
		clientY: event.clientY,
		pageX: event.pageX,
		pageY: event.pageY,
		pointerId: 'pointerId' in event ? event.pointerId : undefined
	};
}

// ===== Delta & Velocity Calculation =====

interface VelocitySample {
	point: Point;
	timestamp: number;
}

const velocityHistory: VelocitySample[] = [];
const VELOCITY_SAMPLE_WINDOW = 100; // ms

/**
 * Calculates delta from start point to current point.
 */
export function calculateDelta(startPoint: Point, currentPoint: Point): Point {
	return {
		x: currentPoint.x - startPoint.x,
		y: currentPoint.y - startPoint.y
	};
}

/**
 * Calculates velocity based on recent position history.
 * Uses time-based sampling for smooth velocity calculation.
 */
export function calculateVelocity(
	currentPoint: Point,
	timestamp: number,
	sampleWindow: number = VELOCITY_SAMPLE_WINDOW
): Point {
	// Add current sample
	velocityHistory.push({ point: currentPoint, timestamp });

	// Remove samples outside window
	const cutoffTime = timestamp - sampleWindow;
	while (velocityHistory.length > 0 && velocityHistory[0].timestamp < cutoffTime) {
		velocityHistory.shift();
	}

	// Need at least 2 samples to calculate velocity
	if (velocityHistory.length < 2) {
		return { x: 0, y: 0 };
	}

	const oldest = velocityHistory[0];
	const newest = velocityHistory[velocityHistory.length - 1];
	const timeDelta = newest.timestamp - oldest.timestamp;

	if (timeDelta === 0) {
		return { x: 0, y: 0 };
	}

	const distance = {
		x: newest.point.x - oldest.point.x,
		y: newest.point.y - oldest.point.y
	};

	return {
		x: distance.x / timeDelta,
		y: distance.y / timeDelta
	};
}

/**
 * Clears velocity history. Call this when starting a new drag.
 */
export function clearVelocityHistory(): void {
	velocityHistory.length = 0;
}

// ===== Axis Locking =====

export type Axis = 'x' | 'y' | 'both' | null;

/**
 * Applies axis locking to constrain movement along specified axis.
 */
export function applyAxisLock(delta: Point, axis: Axis): Point {
	if (axis === null || axis === 'both') {
		return delta;
	}

	if (axis === 'x') {
		return { x: delta.x, y: 0 };
	}

	if (axis === 'y') {
		return { x: 0, y: delta.y };
	}

	return delta;
}

/**
 * Applies axis locking to velocity.
 */
export function applyAxisLockToVelocity(velocity: Point, axis: Axis): Point {
	return applyAxisLock(velocity, axis);
}

// ===== Bounds Resolution =====

export type BoundsConfig = 'parent' | 'viewport' | HTMLElement | Bounds | null;

/**
 * Resolves bounds configuration into concrete bounds object.
 */
export function resolveBounds(
	bounds: BoundsConfig,
	element: HTMLElement
): Bounds | null {
	if (bounds === null) {
		return null;
	}

	if (bounds === 'viewport') {
		return {
			top: 0,
			left: 0,
			right: window.innerWidth,
			bottom: window.innerHeight
		};
	}

	if (bounds === 'parent') {
		const parent = element.parentElement;
		if (!parent) {
			return null;
		}
		const rect = parent.getBoundingClientRect();
		return {
			top: rect.top,
			left: rect.left,
			right: rect.right,
			bottom: rect.bottom
		};
	}

	if (bounds instanceof HTMLElement) {
		const rect = bounds.getBoundingClientRect();
		return {
			top: rect.top,
			left: rect.left,
			right: rect.right,
			bottom: rect.bottom
		};
	}

	// Already a Bounds object
	return bounds;
}

/**
 * Constrains a position to stay within bounds.
 * Accounts for element dimensions to ensure the entire element stays in bounds.
 */
export function constrainToBounds(
	position: Point,
	bounds: Bounds,
	elementRect: DOMRect
): Point {
	const x = Math.max(
		bounds.left,
		Math.min(position.x, bounds.right - elementRect.width)
	);
	const y = Math.max(
		bounds.top,
		Math.min(position.y, bounds.bottom - elementRect.height)
	);

	return { x, y };
}

// ===== Snap Math =====

/**
 * Applies snap-to-grid behavior to a position.
 * Uses threshold to determine when to snap (default: half cell size).
 */
export function applySnap(position: Point, snapConfig: SnapConfig): Point {
	const { x: snapX, y: snapY, threshold } = snapConfig;

	let x = position.x;
	let y = position.y;

	if (snapX !== undefined && snapX > 0) {
		const snapThresholdX = threshold ?? snapX / 2;
		const nearestX = Math.round(x / snapX) * snapX;
		const distanceX = Math.abs(x - nearestX);
		if (distanceX <= snapThresholdX) {
			x = nearestX;
		}
	}

	if (snapY !== undefined && snapY > 0) {
		const snapThresholdY = threshold ?? snapY / 2;
		const nearestY = Math.round(y / snapY) * snapY;
		const distanceY = Math.abs(y - nearestY);
		if (distanceY <= snapThresholdY) {
			y = nearestY;
		}
	}

	return { x, y };
}

/**
 * Snaps a position to the nearest grid cell without threshold checking.
 */
export function snapToGrid(position: Point, gridSize: { x: number; y: number }): Point {
	return {
		x: Math.round(position.x / gridSize.x) * gridSize.x,
		y: Math.round(position.y / gridSize.y) * gridSize.y
	};
}

// ===== State Management Utilities =====

/**
 * Creates an initial drag engine state.
 */
export function createDragEngineState(): DragEngineState {
	const zeroPoint = { x: 0, y: 0 };
	return {
		state: 'idle',
		startPoint: zeroPoint,
		currentPoint: zeroPoint,
		previousPoint: zeroPoint,
		delta: zeroPoint,
		velocity: zeroPoint,
		timestamp: 0
	};
}

/**
 * Validates state transition.
 */
export function canTransition(
	from: DragEngineState['state'],
	to: DragEngineState['state']
): boolean {
	const validTransitions: Record<string, DragEngineState['state'][]> = {
		idle: ['pending'],
		pending: ['dragging', 'idle'],
		dragging: ['released'],
		released: ['idle']
	};

	return validTransitions[from]?.includes(to) ?? false;
}
