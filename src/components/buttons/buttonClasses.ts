export const variantClasses = {
  primary: 'bg-[var(--color-accent)] text-[var(--color-text)] border border-transparent machined hover:bg-[var(--color-accent-soft)] hover-lift active:translate-y-px',
  secondary: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-accent)] hover-lift active:translate-y-px',
  ghost: 'bg-transparent text-[var(--color-text)] border border-transparent hover:bg-[var(--color-base-2)] hover-lift active:translate-y-px',
  danger: 'bg-[var(--color-error)] text-[var(--color-text)] border border-transparent machined hover-lift active:translate-y-px'
};

export type ButtonVariant = keyof typeof variantClasses;

export const sizeClasses = {
	sm: 'px-3.5 py-2 text-xs font-mono font-medium uppercase tracking-[0.08em]',
	md: 'px-5 py-2.5 text-sm font-mono font-medium uppercase tracking-[0.08em]',
	lg: 'px-6 py-3 text-base font-mono font-semibold uppercase tracking-[0.08em]'
};

export const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

export const fabSizeClasses = {
  md: 'w-16 h-16 text-base',
  lg: 'w-18 h-18 text-lg'
};
