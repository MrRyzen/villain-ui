<script lang="ts">
	interface Props {
		variant?: 'body' | 'caption';
		color?: 'default' | 'soft' | 'muted';
		as?: 'p' | 'span' | 'div';
		children?: import('svelte').Snippet;
	}

	let { variant = 'body', color = 'default', as = 'p', children }: Props = $props();

	const colorMap = {
		default: 'var(--color-text)',
		soft: 'var(--color-text-soft)',
		muted: 'var(--color-text-muted)'
	};

	const styles = $derived(
		`font-size: var(--text-${variant}-size); line-height: var(--text-${variant}-line-height); font-weight: var(--text-${variant}-weight); font-family: var(--font-body); color: ${colorMap[color]};`
	);
</script>

<svelte:element this={as} class="transition-colors duration-300" style={styles}>
	{@render children?.()}
</svelte:element>
