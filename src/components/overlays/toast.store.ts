import { atom } from 'nanostores';
import { createId } from '../../lib/internal/id';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
	variant?: ToastVariant;
	/** Auto-dismiss delay in ms. 0 disables auto-dismiss. Default 3000. */
	duration?: number;
	dismissible?: boolean;
}

export interface ToastItem extends Required<Pick<ToastOptions, 'variant' | 'duration' | 'dismissible'>> {
	id: string;
	message: string;
}

/** Active toasts, oldest first. Rendered by `<ToastHost />`. */
export const toasts = atom<ToastItem[]>([]);

export function dismissToast(id: string): void {
	toasts.set(toasts.get().filter((t) => t.id !== id));
}

function push(message: string, options: ToastOptions = {}): string {
	const item: ToastItem = {
		id: createId('toast'),
		message,
		variant: options.variant ?? 'info',
		duration: options.duration ?? 3000,
		dismissible: options.dismissible ?? true
	};
	toasts.set([...toasts.get(), item]);
	return item.id;
}

/**
 * Show a toast. Requires a single `<ToastHost />` mounted in the app's root
 * layout. Returns the toast id (usable with `dismissToast`).
 *
 * ```ts
 * toast('Saved');
 * toast.success('Added to cart');
 * toast.error('Could not save', { duration: 0 });
 * ```
 */
export const toast = Object.assign(push, {
	info: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
		push(message, { ...options, variant: 'info' }),
	success: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
		push(message, { ...options, variant: 'success' }),
	warning: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
		push(message, { ...options, variant: 'warning' }),
	error: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
		push(message, { ...options, variant: 'error' })
});
