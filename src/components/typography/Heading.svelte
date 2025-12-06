<script lang="ts">
	interface Props {
		level?: 1 | 2 | 3 | 4 | 5 | 6;
		glow?: boolean;
		variant?: 'default' | 'gradient';
		as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		children?: import('svelte').Snippet;
	}

	let { level = 1, glow = false, variant = 'default', as, children }: Props = $props();

	const element = $derived(as ?? `h${level}`);
	
	const variantClasses = {
		default: '',
		gradient: 'text-gradient'
	};
	
	const baseClasses = $derived(
		`transition-all duration-300 ${glow ? 'text-glow' : ''} ${variantClasses[variant]}`
	);
	const styles = $derived(
		`font-size: var(--text-h${level}-size); line-height: var(--text-h${level}-line-height); font-weight: var(--text-h${level}-weight); letter-spacing: var(--text-h${level}-letter-spacing); font-family: var(--font-heading); color: var(--color-text);`
	);
</script>

<svelte:element this={element} class={baseClasses} style={styles}>
	{@render children?.()}
</svelte:element>
