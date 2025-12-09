<script lang="ts">
	interface Props {
		variant?: 'body' | 'caption';
		color?: 'default' | 'soft' | 'muted' | 'success' | 'warning' | 'error';
		weight?: 'normal' | 'bold' | 'semibold';
		as?: 'p' | 'span' | 'div';
		children?: import('svelte').Snippet;
	}

	let { variant = 'body', color = 'default', weight = 'normal', as = 'p', children }: Props = $props();

	const colorMap = {
		default: 'var(--color-text)',
		soft: 'var(--color-text-soft)',
		muted: 'var(--color-text-muted)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		error: 'var(--color-error)',
	};

	const weightMap = {
		normal: '400',
		semibold: '600',
		bold: '700',
	};

	const styles = $derived(
		`font-size: var(--text-${variant}-size); line-height: var(--text-${variant}-line-height); font-weight: ${weightMap[weight] || '400'}; letter-spacing: var(--text-${variant}-letter-spacing); font-family: var(--font-body); color: ${colorMap[color]};`
	);
</script>

<svelte:element this={as} class="transition-colors duration-300" style={styles}>
	{@render children?.()}
</svelte:element>
