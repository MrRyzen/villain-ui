/**
 * Type definitions for utility components
 */

// SystemConsole types
export interface ConsoleMessage {
	id: string;
	role: 'user' | 'system';
	variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
	content: string;
	timestamp?: Date;
}

// SystemInterface types
export type MessageContentType =
	| { type: 'text'; value: string }
	| { type: 'stats'; value: Record<string, number | string>; layout?: 'grid' | 'list' }
	| { type: 'status'; value: Record<string, { value: string; status: 'ok' | 'warning' | 'error' | 'info' }> }
	| { type: 'table'; value: { headers: string[]; rows: (string | number)[][] } }
	| { type: 'keyvalue'; value: Record<string, string | number>; columns?: number }
	| { type: 'custom'; value: any; class?: string };

export interface SystemMessage {
	id: string;
	role: 'user' | 'system';
	tier?: 'informational' | 'analysis' | 'directive' | 'warning' | 'critical';
	content: string | MessageContentType; // Can be string or structured content
	timestamp?: number;
	updateable?: boolean; // If true, this message can be updated in place
}
