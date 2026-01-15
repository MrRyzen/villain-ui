export interface CalendarEvent {
	id: string;
	date: Date | string;
	title?: string;
	variant?: 'default' | 'success' | 'warning' | 'error' | 'accent';
	metadata?: any;
}
