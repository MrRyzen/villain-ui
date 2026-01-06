/**
 * Interactables Components
 * 
 * Drag-and-drop primitives and utilities.
 */

// ===== Components =====
export { default as Draggable } from './Draggable.svelte';
export type { DragStartEvent, DragEvent, DragEndEvent } from './Draggable.types';
export { default as DragHandle } from './DragHandle.svelte';

// ===== Grid Components =====
export { default as DragGrid } from './DragGrid.svelte';
export { default as GridItem } from './GridItem.svelte';

// ===== Reorder List Components =====
export { default as DragReorderList } from './DragReorderList.svelte';
// ===== Drop Zone =====
export { default as DropZone } from './DropZone.svelte';
export type { DropEvent, DragEnterEvent } from './DropZone.types';

// ===== Context =====
export { DRAG_CONTEXT_KEY, createDragContext, getDragContext } from '$lib/interactions/DragContext.js';
export type { DragContextValue } from '$lib/interactions/DragContext.js';

// ===== Grid Context =====
export { GRID_CONTEXT_KEY, createGridContext, getGridContext } from '$lib/interactions/GridContext.js';
export type { GridContextValue, GridItemData } from '$lib/interactions/GridContext.js';

// ===== Reorder List Context =====
export { REORDER_LIST_CONTEXT_KEY, createListContext, getListContext } from '$lib/interactions/ListContext.js';
export type { ListContextValue, ListItemData } from '$lib/interactions/ListContext.js';
// ===== Component Props Types =====
import type { ComponentProps } from 'svelte';
import type Draggable from './Draggable.svelte';
import type DragHandle from './DragHandle.svelte';
import type DropZone from './DropZone.svelte';
import type DragGrid from './DragGrid.svelte';
import type GridItem from './GridItem.svelte';
import type DragReorderList from './DragReorderList.svelte';

export type DraggableProps = ComponentProps<Draggable>;
export type DragHandleProps = ComponentProps<DragHandle>;
export type DropZoneProps = ComponentProps<DropZone>;
export type DragGridProps = ComponentProps<DragGrid>;
export type GridItemProps = ComponentProps<GridItem>;
export type DragReorderListProps = ComponentProps<DragReorderList>;
// Note: dragEngine.ts, gridMath.ts, listMath.ts, and ListItem.svelte are internal-only and not exported

