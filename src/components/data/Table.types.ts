export type SortDirection = 'asc' | 'desc' | null;

export interface Column {
	key: string;
	label: string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	render?: (value: any, row: any) => any;
}
