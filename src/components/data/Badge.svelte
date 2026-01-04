<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'feature';
		size?: 'sm' | 'md';
		icon?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
		hover?: boolean;
		glow?: boolean;
		statusDot?: boolean; // Shows a glowing status indicator dot
		uppercase?: boolean; // Makes text uppercase with letter spacing
		class?: string;
	}

	let {
		variant = 'default',
		size = 'md',
		icon,
		children,
		hover = false,
		glow = false,
		statusDot = false,
		uppercase = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const variantClasses = {
		default:
			'bg-[var(--color-base-3)] text-[var(--color-text-soft)] border-[var(--color-border)]',
		success:
			'bg-[var(--color-success-overlay-15)] text-[var(--color-success)] border-[var(--color-success)]',
		warning:
			'bg-[var(--color-warning-overlay-15)] text-[var(--color-warning)] border-[var(--color-warning)]',
		error:
			'bg-[var(--color-error-overlay-15)] text-[var(--color-error)] border-[var(--color-error)]',
		accent:
			'bg-[var(--color-secondary-overlay-10)] text-[var(--color-accent-soft)] border-[var(--color-accent)]',
		feature:
			'bg-[var(--color-accent-overlay-20)] text-[var(--color-accent-soft)] border-[var(--color-border-glow)]'
	};

	const hoverClasses = {
		default: 'hover:bg-[var(--color-base-2)]',
		success: 'hover:bg-[var(--color-success-overlay-30)]',
		warning: 'hover:bg-[var(--color-warning-overlay-30)]',
		error: 'hover:bg-[var(--color-error-overlay-30)]',
		accent:
			'hover:bg-[var(--color-secondary-overlay-20)] hover:shadow-[var(--shadow-accent-glow)]',
		feature: 'hover:bg-[var(--color-accent-overlay-30)] hover:shadow-[var(--shadow-accent-glow)]'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-[var(--text-xs)] gap-1',
		md: 'px-3 py-1 text-[0.75rem] gap-1.5'
	};

	const classes = $derived(
		`inline-flex items-center justify-center rounded-[var(--radius-pill)] border font-[var(--font-body)] font-semibold transition-all duration-[var(--duration-300)] ease-[var(--ease-sharp)] ${variantClasses[variant]} ${sizeClasses[size]} ${hover ? hoverClasses[variant] : ''} ${glow ? 'accent-glow' : ''} ${uppercase ? 'uppercase tracking-wider' : ''} ${className}`.trim()
	);
</script>

<span class={classes} {...restProps}>
	{#if statusDot}
		<span class="status-dot"></span>
	{/if}
	{#if icon}
		<span class="inline-flex items-center justify-center">
			{@render icon()}
		</span>
	{/if}
	{@render children?.()}
</span>

<style>
	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: currentColor;
		box-shadow: 0 0 8px currentColor;
	}
</style>
