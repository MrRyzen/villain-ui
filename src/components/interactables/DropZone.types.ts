export interface DropEvent {
	payload: unknown;
	type: string;
	velocity: { x: number; y: number };
}

export interface DragEnterEvent {
	payload: unknown;
	type: string;
}
