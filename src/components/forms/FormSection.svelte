<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Mono uppercase section label (e.g. "01 / IDENTITY"). */
		legend?: string;
		/** Supporting copy under the legend. */
		description?: string;
		/** Field layout: single column (default) or two columns on md+. */
		columns?: 1 | 2;
		class?: string;
		children?: Snippet;
	}

	let {
		legend,
		description,
		columns = 1,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<fieldset class="border-0 p-0 m-0 min-w-0 {className}" {...restProps}>
	{#if legend}
		<legend
			class="font-[var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--color-text-soft)] p-0 mb-2 w-full border-b border-[var(--color-border-subtle)] pb-3"
		>
			{legend}
		</legend>
	{/if}
	{#if description}
		<p class="text-sm text-[var(--color-text-soft)] mt-3 mb-6">{description}</p>
	{:else if legend}
		<div class="mt-6"></div>
	{/if}
	<div class="grid gap-5 {columns === 2 ? 'md:grid-cols-2' : ''}">
		{@render children?.()}
	</div>
</fieldset>
