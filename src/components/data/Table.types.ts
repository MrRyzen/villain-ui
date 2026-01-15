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
