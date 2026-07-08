import type { Snippet } from "svelte";

export interface CalendarEvent {
	id: string;
	date: Date | string;
	title?: string;
	variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
	metadata?: any;
}

export interface ListItem {
	id: string;
	content: string | Snippet;
	icon?: Snippet;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface Column {
	key: string;
	label: string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	render?: (value: any, row: any) => any;
}

export type RowKey = string | number;

export interface SelectionState {
	selectedKeys: Set<RowKey>;
	allSelected: boolean;
	someSelected: boolean;
}

export interface WeekHeatmapCell {
	/** Matrix row index (0 = Sunday, matching the SDK PeakTimesHeatmap contract) */
	day: number;
	/** Hour of day, 0–23 */
	hour: number;
	/** Raw matrix value */
	value: number;
	/** 0–100, after normalization */
	intensity: number;
}
