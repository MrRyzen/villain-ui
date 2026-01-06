export interface DragStartEvent {
	id: string;
	startX: number;
	startY: number;
	element: HTMLElement;
}

export interface DragEvent {
	id: string;
	x: number;
	y: number;
	deltaX: number;
	deltaY: number;
	velocityX: number;
	velocityY: number;
}

export interface DragEndEvent {
	id: string;
	finalX: number;
	finalY: number;
	velocityX: number;
	velocityY: number;
}
