/**
 * Drag Context
 * 
 * Purpose: Global drag state coordination using Svelte's setContext / getContext.
 * Enables drop zones and other components to subscribe to active drag operations.
 */

import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

// ===== Type Definitions =====

export interface DragContextValue {
	activeId: Writable<string | null>;
	type: Writable<string | null>;
	payload: Writable<unknown>;
	rect: Writable<DOMRect | null>;
	velocity: Writable<{ x: number; y: number }>;
	setActive: (id: string, type: string, payload: unknown, rect: DOMRect) => void;
	updateVelocity: (vx: number, vy: number) => void;
	clearActive: () => void;
}

// ===== Context Key =====

export const DRAG_CONTEXT_KEY = Symbol('drag-context');

// ===== Context Creation =====

/**
 * Creates a drag context with reactive state.
 * Should be called by a parent component and set via setContext.
 */
export function createDragContext(): DragContextValue {
	const activeId = writable<string | null>(null);
	const type = writable<string | null>(null);
	const payload = writable<unknown>(null);
	const rect = writable<DOMRect | null>(null);
	const velocity = writable<{ x: number; y: number }>({ x: 0, y: 0 });

	function setActive(
		newId: string,
		newType: string,
		newPayload: unknown,
		newRect: DOMRect
	): void {
		activeId.set(newId);
		type.set(newType);
		payload.set(newPayload);
		rect.set(newRect);
	}

	function updateVelocity(vx: number, vy: number): void {
		velocity.set({ x: vx, y: vy });
	}

	function clearActive(): void {
		activeId.set(null);
		type.set(null);
		payload.set(null);
		rect.set(null);
		velocity.set({ x: 0, y: 0 });
	}

	return {
		activeId,
		type,
		payload,
		rect,
		velocity,
		setActive,
		updateVelocity,
		clearActive
	};
}

// ===== Context Access =====

/**
 * Gets the drag context from the nearest parent that provides it.
 * Returns undefined if no context is found.
 */
export function getDragContext(): DragContextValue | undefined {
	return getContext<DragContextValue>(DRAG_CONTEXT_KEY);
}

/**
 * Sets the drag context for child components.
 * Should be called in a parent component's setup.
 */
export function setDragContext(context: DragContextValue): void {
	setContext(DRAG_CONTEXT_KEY, context);
}
