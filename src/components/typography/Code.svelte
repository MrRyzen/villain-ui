<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<code
	class="inline-flex items-center"
	style="background: var(--color-accent-overlay-10); border: 1px solid var(--color-border); padding: 0.125rem 0.375rem; border-radius: var(--radius-sm); font-family: var(--font-mono); color: var(--color-accent-soft); font-size: 0.9em;"
>
	{@render children?.()}
</code>
