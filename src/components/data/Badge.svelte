<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'feature';
		size?: 'sm' | 'md';
		icon?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', size = 'md', icon, children }: Props = $props();

	const variantClasses = {
		default: 'bg-[var(--color-base-3)] text-[var(--color-text-soft)] border-[var(--color-base-3)]',
		success:
			'bg-[var(--color-success-overlay-15)] text-[var(--color-success)] border-[var(--color-success)]',
		warning:
			'bg-[var(--color-warning-overlay-15)] text-[var(--color-warning)] border-[var(--color-warning)]',
		error: 'bg-[var(--color-error-overlay-15)] text-[var(--color-error)] border-[var(--color-error)]',
		accent: 'bg-[var(--color-secondary-overlay-10)] text-[var(--color-accent-soft)] border-[var(--color-accent)] accent-glow',
		feature: 'bg-[var(--color-accent-overlay-20)] text-[var(--color-accent-soft)] border-[var(--color-border-glow)] shadow-[0_0_12px_var(--color-accent-overlay-20)]'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm'
	};

	const classes = $derived(
		`inline-flex items-center justify-center rounded-[var(--radius-pill)] border font-[var(--font-body)] font-medium transition-all duration-300 ${variantClasses[variant]} ${sizeClasses[size]}`
	);
</script>

<span class={classes}>
	{#if icon}
		<span class="inline-flex items-center justify-center">
			{@render icon()}
		</span>
	{/if}
	{@render children?.()}
</span>
