import type { ListItemData } from './ListContext.js';

export function calculateItemBounds(
	items: ListItemData[],
	gap: number,
	orientation: 'horizontal' | 'vertical'
): Map<string, DOMRect> {
	const bounds = new Map<string, DOMRect>();
	let cumulativeOffset = 0;

	for (const item of items) {
		if (!item.element) continue;

		const rect = item.element.getBoundingClientRect();
		const adjustedRect = new DOMRect(
			orientation === 'horizontal' ? rect.x + cumulativeOffset : rect.x,
			orientation === 'vertical' ? rect.y + cumulativeOffset : rect.y,
			rect.width,
			rect.height
		);

		bounds.set(item.id, adjustedRect);

		if (orientation === 'vertical') {
			cumulativeOffset += rect.height + gap;
		} else {
			cumulativeOffset += rect.width + gap;
		}
	}

	return bounds;
}

export function findTargetIndex(
	draggedId: string,
	currentPos: number,
	itemBounds: Map<string, DOMRect>,
	items: ListItemData[],
	orientation: 'horizontal' | 'vertical'
): number {
	let targetIndex = 0;

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item.id === draggedId) continue;

		const bounds = itemBounds.get(item.id);
		if (!bounds) continue;

		const itemCenter =
			orientation === 'vertical'
				? bounds.top + bounds.height / 2
				: bounds.left + bounds.width / 2;

		if (currentPos > itemCenter) {
			targetIndex = i + 1;
		}
	}

	return Math.max(0, Math.min(targetIndex, items.length - 1));
}

export function calculateGapOffset(
	draggedIndex: number,
	targetIndex: number,
	itemSize: number,
	gap: number
): number {
	if (draggedIndex === targetIndex) return 0;

	if (targetIndex > draggedIndex) {
		return -(itemSize + gap);
	} else {
		return itemSize + gap;
	}
}

export function reorderArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
	const result = [...array];
	const [removed] = result.splice(fromIndex, 1);
	result.splice(toIndex, 0, removed);
	return result;
}
