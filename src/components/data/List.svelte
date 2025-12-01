<script lang="ts">
	interface Props {
		variant?: 'plain' | 'bordered' | 'divided';
		hoverable?: boolean;
		children?: import('svelte').Snippet;
	}

	let { variant = 'plain', hoverable = false, children }: Props = $props();

	const containerClasses = $derived(
		variant === 'bordered'
			? 'glass-panel rounded-[var(--radius-lg)] border border-[var(--color-border)]'
			: ''
	);

	const listClasses = $derived(`list-none ${variant} ${hoverable ? 'hoverable' : ''}`);
</script>

{#if variant === 'bordered'}
	<div class={containerClasses}>
		<ul class={listClasses}>
			{@render children?.()}
		</ul>
	</div>
{:else}
	<ul class={listClasses}>
		{@render children?.()}
	</ul>
{/if}

<style>
	ul {
		margin: 0;
		padding: 0;
		color: var(--color-text);
		font-family: var(--font-body);
	}

	:global(ul.plain > li) {
		padding: 0.5rem 0;
	}

	:global(ul.bordered > li) {
		padding: 0.75rem 1rem;
	}

	:global(ul.divided > li) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	:global(ul.divided > li:last-child) {
		border-bottom: none;
	}

	:global(ul.hoverable > li) {
		transition: all var(--ease-luxe);
		cursor: pointer;
	}

	:global(ul.hoverable > li:hover) {
		background: rgba(127, 61, 255, 0.05);
	}
</style>
