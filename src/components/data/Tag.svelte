<script lang="ts">
	interface Props {
		variant?: 'default' | 'accent' | 'info';
		size?: 'sm' | 'md' | 'lg';
		dismissible?: boolean;
		onDismiss?: () => void;
		/** @deprecated Use onDismiss */
		ondismiss?: () => void;
		children?: import('svelte').Snippet;
		icon?: import('svelte').Snippet;
	}

	let { variant = 'default', size = 'md', dismissible = false, onDismiss, ondismiss, children, icon }: Props = $props();

	const onDismissCallback = $derived(onDismiss ?? ondismiss);

	const variantClasses = {
		default:
			'bg-[var(--color-base-2)] text-[var(--color-text-soft)] border-[var(--color-border)]',
		accent:
			'bg-[var(--color-secondary-overlay-10)] text-[var(--color-accent-soft)] border-[var(--color-accent)] shadow-[0_0_12px_var(--color-secondary-overlay-20)]',
		info:
			'bg-[var(--color-info-overlay-10)] text-[var(--color-info)] border-[var(--color-info)] shadow-[0_0_12px_var(--color-info-overlay-20)]'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs gap-1',
		md: 'px-3 py-1.5 text-sm gap-2',
		lg: 'px-4 py-2 text-base gap-2'
	};

	const classes = $derived(
		`inline-flex items-center rounded-[var(--radius-pill)] border font-[var(--font-body)] font-medium transition-all duration-300 hover:scale-[1.02] ${sizeClasses[size]} ${variantClasses[variant]}`
	);

	function handleDismiss() {
		onDismissCallback?.();
	}
</script>

<span class={classes}>
	{#if icon}
		<span class="inline-flex items-center justify-center">
			{@render icon()}
		</span>
	{/if}
	{@render children?.()}

	{#if dismissible}
		<button
			class="ml-1 opacity-60 hover:opacity-100 hover:text-[var(--color-text)] transition-all duration-300"
			onclick={handleDismiss}
			aria-label="Remove tag"
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	{/if}
</span>
