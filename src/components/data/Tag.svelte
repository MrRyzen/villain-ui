<script lang="ts">
	interface Props {
		variant?: 'default' | 'accent';
		dismissible?: boolean;
		ondismiss?: () => void;
		children?: import('svelte').Snippet;
	}

	let { variant = 'default', dismissible = false, ondismiss, children }: Props = $props();

	const variantClasses = {
		default:
			'bg-[var(--color-base-2)] text-[var(--color-text-soft)] border-[var(--color-border)]',
		accent:
			'bg-[rgba(127,61,255,0.1)] text-[var(--color-accent-soft)] border-[var(--color-accent)] shadow-[0_0_12px_rgba(127,61,255,0.2)]'
	};

	const classes = $derived(
		`inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] border font-[var(--font-body)] font-medium text-sm transition-all duration-300 hover:scale-[1.02] ${variantClasses[variant]}`
	);

	function handleDismiss() {
		ondismiss?.();
	}
</script>

<span class={classes}>
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
