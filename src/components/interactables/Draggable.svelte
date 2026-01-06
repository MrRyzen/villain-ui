<script lang="ts">
	import { createId } from '$lib/internal/id.js';
	import Portal from '../utilities/Portal.svelte';
	import DragHandle from './DragHandle.svelte';
	import { getDragContext } from '$lib/interactions/DragContext';
	import {
		normalizePointerEvent,
		calculateDelta,
		calculateVelocity,
		clearVelocityHistory,
		applyAxisLock,
		resolveBounds,
		constrainToBounds,
		applySnap,
		type Point,
		type Axis, 
		type SnapConfig,
		type Bounds,
	} from '$lib/interactions/dragEngine';
	import type {
		DragStartEvent,
		DragEvent,
		DragEndEvent,
	} from './Draggable.types';

	interface GridConfig {
		size: number | { x: number; y: number };
		show?: boolean;
		infinite?: boolean;
	}

	export interface Props {
		// Core behavior
		mode?: 'free' | 'grid' | 'constrained';
		axis?: Axis;
		disabled?: boolean;

		// Handle configuration
		handle?: 'self' | 'center' | 'corners' | string;

		// Constraints
		snap?: SnapConfig;
		bounds?:
			| 'parent'
			| 'viewport'
			| HTMLElement
			| Bounds
			| null;
		grid?: GridConfig;

		// Visual
		ghost?: boolean;
		ghostClass?: string;

		// Data
		type?: string;
		payload?: unknown;

		// Callbacks
		onDragStart?: (event: DragStartEvent) => void;
		onDrag?: (event: DragEvent) => void;
		onDragEnd?: (event: DragEndEvent) => void;

		// Render
		children?: import('svelte').Snippet;
		class?: string;
	}

	let {
		mode = 'free',
		axis = 'both',
		disabled = false,
		handle = 'self',
		snap,
		bounds,
		grid,
		ghost = false,
		ghostClass = 'opacity-50 pointer-events-none',
		type,
		payload,
		onDragStart,
		onDrag,
		onDragEnd,
		children,
		class: className = '',
	}: Props = $props();

	// ===== State Management =====

	const dragId = createId('draggable');
	let isDragging = $state(false);
	let baseOffset = $state<Point>({ x: 0, y: 0 }); // Persistent offset across drags
	let position = $state<Point>({ x: 0, y: 0 }); // Current position during drag
	let ghostPosition = $state<Point>({ x: 0, y: 0 });
	let startPoint = $state<Point>({ x: 0, y: 0 });
	let currentVelocity = $state<Point>({ x: 0, y: 0 });

	let rootElement = $state<HTMLElement | null>(null);
	let handleElement = $state<HTMLElement | undefined>(undefined);
	let cornerHandles = $state<HTMLElement[]>([]); // For 'corners' mode
	let activePointerId = $state<number | null>(null);

	// Drag context (optional)
	const dragContext = getDragContext();

	// ===== Derived State =====

	const computedClasses = $derived.by(() => {
		const classes = ['draggable-root'];

		if (className) classes.push(className);
		if (!disabled) classes.push('cursor-grab');
		if (isDragging) {
			classes.push('cursor-grabbing', 'dragging');
		}
		if (mode === 'free') {
			classes.push(
				'transition-transform',
				'duration-[var(--duration-150)]',
				'ease-[var(--ease-luxe)]'
			);
		}

		return classes.join(' ');
	});

	const transformStyle = $derived.by(() => {
		if (mode === 'free' || mode === 'constrained') {
			// Always apply transform (baseOffset + current drag delta)
			const totalX = baseOffset.x + position.x;
			const totalY = baseOffset.y + position.y;
			return `translate(${totalX}px, ${totalY}px)`;
		}
		return '';
	});

	// ===== Pointer Event Handlers =====

	function handlePointerDown(event: PointerEvent): void {
		if (disabled) return;

		// Check if this is the handle or self
		const target = event.target as HTMLElement;
		if (handle === 'corners') {
			// For corners mode, only allow drag from corner handles
			const isCornerHandle = cornerHandles.some(
				(h) => h && h.contains(target)
			);
			if (!isCornerHandle) {
				return;
			}
		} else if (
			handle !== 'self' &&
			handleElement &&
			!handleElement.contains(target)
		) {
			return;
		}

		event.preventDefault();

		const pointerData = normalizePointerEvent(event);

		// Capture pointer for reliable tracking
		if (rootElement && pointerData.pointerId !== undefined) {
			rootElement.setPointerCapture(pointerData.pointerId);
			activePointerId = pointerData.pointerId;
		}

		// Initialize drag state - don't reset position, start from current offset
		startPoint = { x: pointerData.clientX, y: pointerData.clientY };
		position = { x: 0, y: 0 }; // Reset delta for this drag
		ghostPosition = { x: pointerData.clientX, y: pointerData.clientY };
		clearVelocityHistory();
		isDragging = true;

		// Update drag context
		if (dragContext && rootElement) {
			const rect = rootElement.getBoundingClientRect();
			dragContext.setActive(dragId, type ?? mode, payload ?? {}, rect);
		}

		// Attach document listeners
		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);
		document.addEventListener('pointercancel', handlePointerCancel);

		// Fire callback
		if (onDragStart && rootElement) {
			onDragStart({
				id: dragId,
				startX: pointerData.clientX,
				startY: pointerData.clientY,
				element: rootElement,
			});
		}
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!isDragging || disabled) return;

		// Only handle events from the captured pointer
		if (activePointerId !== null && event.pointerId !== activePointerId) {
			return;
		}

		const pointerData = normalizePointerEvent(event);
		const currentPoint = { x: pointerData.clientX, y: pointerData.clientY };
		const timestamp = performance.now();

		// Calculate raw delta
		let delta = calculateDelta(startPoint, currentPoint);

		// Apply axis lock
		if (axis && axis !== 'both') {
			delta = applyAxisLock(delta, axis);
		}

		// Calculate velocity
		currentVelocity = calculateVelocity(currentPoint, timestamp);
		if (axis && axis !== 'both') {
			currentVelocity = applyAxisLock(currentVelocity, axis);
		}

		// Mode-specific behavior
		if (mode === 'grid' && grid) {
			// Grid mode: snap to grid cells
			const gridSize =
				typeof grid.size === 'number'
					? { x: grid.size, y: grid.size }
					: grid.size;
			const snapped = {
				x: Math.round(delta.x / gridSize.x) * gridSize.x,
				y: Math.round(delta.y / gridSize.y) * gridSize.y,
			};
			delta = snapped;
		} else if (mode === 'constrained') {
			// Constrained mode: enforce bounds (bounds are required for this mode)
			if (bounds && rootElement) {
				const resolvedBounds = resolveBounds(bounds, rootElement);
				if (resolvedBounds) {
					const rect = rootElement.getBoundingClientRect();
					const absolutePosition = {
						x: rect.left + delta.x,
						y: rect.top + delta.y,
					};
					const constrained = constrainToBounds(
						absolutePosition,
						resolvedBounds,
						rect
					);
					delta = {
						x: constrained.x - rect.left,
						y: constrained.y - rect.top,
					};
				}
			}
		}

		// Apply snap if configured (works across all modes)
		if (snap) {
			const snappedDelta = applySnap(delta, snap);
			delta = snappedDelta;
		}

		// Apply bounds if configured (for free mode or as additional constraint)
		if (mode === 'free' && bounds && rootElement) {
			const resolvedBounds = resolveBounds(bounds, rootElement);
			if (resolvedBounds) {
				const rect = rootElement.getBoundingClientRect();
				const absolutePosition = {
					x: rect.left + delta.x,
					y: rect.top + delta.y,
				};
				const constrained = constrainToBounds(
					absolutePosition,
					resolvedBounds,
					rect
				);
				delta = {
					x: constrained.x - rect.left,
					y: constrained.y - rect.top,
				};
			}
		}

		// Update positions
		position = delta;
		ghostPosition = {
			x: startPoint.x + delta.x,
			y: startPoint.y + delta.y,
		};

		// Update drag context velocity
		if (dragContext) {
			dragContext.updateVelocity(currentVelocity.x, currentVelocity.y);
		}

		// Fire callback (throttled via requestAnimationFrame)
		if (onDrag) {
			requestAnimationFrame(() => {
				onDrag!({
					id: dragId,
					x: position.x,
					y: position.y,
					deltaX: delta.x,
					deltaY: delta.y,
					velocityX: currentVelocity.x,
					velocityY: currentVelocity.y,
				});
			});
		}
	}

	function handlePointerUp(event: PointerEvent): void {
		if (!isDragging) return;

		// Only handle events from the captured pointer
		if (activePointerId !== null && event.pointerId !== activePointerId) {
			return;
		}

		endDrag();
	}

	function handlePointerCancel(event: PointerEvent): void {
		if (!isDragging) return;

		// Only handle events from the captured pointer
		if (activePointerId !== null && event.pointerId !== activePointerId) {
			return;
		}

		endDrag();
	}

	function endDrag(): void {
		// Release pointer capture
		if (rootElement && activePointerId !== null) {
			rootElement.releasePointerCapture(activePointerId);
		}

		// Clean up listeners
		document.removeEventListener('pointermove', handlePointerMove);
		document.removeEventListener('pointerup', handlePointerUp);
		document.removeEventListener('pointercancel', handlePointerCancel);

		// Update baseOffset to include the final position from this drag
		baseOffset = {
			x: baseOffset.x + position.x,
			y: baseOffset.y + position.y,
		};

		// Fire callback with absolute final position
		if (onDragEnd) {
			onDragEnd({
				id: dragId,
				finalX: baseOffset.x,
				finalY: baseOffset.y,
				velocityX: currentVelocity.x,
				velocityY: currentVelocity.y,
			});
		}

		// Clear drag context
		if (dragContext) {
			dragContext.clearActive();
		}

		// Reset drag state (but keep baseOffset)
		position = { x: 0, y: 0 }; // Reset delta for next drag
		isDragging = false;
		activePointerId = null;
		clearVelocityHistory();
	}

	// ===== Lifecycle Cleanup =====

	$effect(() => {
		return () => {
			// Clean up on unmount
			if (isDragging) {
				document.removeEventListener('pointermove', handlePointerMove);
				document.removeEventListener('pointerup', handlePointerUp);
				document.removeEventListener(
					'pointercancel',
					handlePointerCancel
				);

				if (dragContext) {
					dragContext.clearActive();
				}
			}
		};
	});

	// ===== Handle Resolution =====

	$effect(() => {
		if (!rootElement) return;

		if (handle === 'self') {
			handleElement = rootElement;
		} else if (
			typeof handle === 'string' &&
			handle !== 'center' &&
			handle !== 'corners'
		) {
			// CSS selector
			const selected = rootElement.querySelector(handle) as HTMLElement;
			if (selected) {
				handleElement = selected;
			}
		}
		// For 'center' and 'corners', handleElement is set via DragHandle component binding
	});
</script>

<div
	bind:this={rootElement}
	class={computedClasses}
	style:transform={transformStyle}
	style:will-change={isDragging ? 'transform' : undefined}
	onpointerdown={handlePointerDown}
	role="button"
	tabindex={disabled ? undefined : 0}
	aria-grabbed={isDragging}
	aria-disabled={disabled}
>
	{#if children}
		{@render children()}
	{/if}

	{#if handle === 'center' && !disabled}
		<DragHandle
			bind:element={handleElement}
			position="center"
			variant="dots"
		/>
	{/if}

	{#if handle === 'corners' && !disabled}
		<!-- Render 4 corner handles for drag (future: resize) -->
		<DragHandle
			bind:element={cornerHandles[0]}
			position="top-left"
			variant="dots"
			size="sm"
		/>
		<DragHandle
			bind:element={cornerHandles[1]}
			position="top-right"
			variant="dots"
			size="sm"
		/>
		<DragHandle
			bind:element={cornerHandles[2]}
			position="bottom-left"
			variant="dots"
			size="sm"
		/>
		<DragHandle
			bind:element={cornerHandles[3]}
			position="bottom-right"
			variant="dots"
			size="sm"
		/>
	{/if}
</div>

{#if ghost && isDragging && rootElement}
	<Portal>
		<div
			class={`fixed top-0 left-0 z-[var(--z-50)] ${ghostClass}`}
			style:transform={`translate(${ghostPosition.x}px, ${ghostPosition.y}px)`}
			style:width={`${rootElement.offsetWidth}px`}
			style:height={`${rootElement.offsetHeight}px`}
			style:pointer-events="none"
		>
			<div
				class="w-full h-full bg-accent/20 border-2 border-accent rounded-[var(--radius-md)]"
			>
				<!-- Ghost representation -->
			</div>
		</div>
	</Portal>
{/if}

<style>
	/* Root styles draws on top of everything */
	.draggable-root {
		position: relative;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
		width: fit-content;
	}
</style>
