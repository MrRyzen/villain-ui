<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ListItem {
		id: string;
		content: string | Snippet;
		icon?: Snippet;
	}

	interface Props {
		variant?: 'plain' | 'bordered' | 'divided';
		hoverable?: boolean;
		items?: ListItem[];
		children?: import('svelte').Snippet;
	}

	let { variant = 'plain', hoverable = false, items, children }: Props = $props();

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
			{#if items}
				{#each items as item (item.id)}
					<li class="flex items-center gap-2">
						{#if item.icon}
							<span class="inline-flex items-center justify-center">
								{@render item.icon()}
							</span>
						{/if}
						{#if typeof item.content === 'string'}
							{item.content}
						{:else}
							{@render item.content()}
						{/if}
					</li>
				{/each}
			{:else}
				{@render children?.()}
			{/if}
		</ul>
	</div>
{:else}
	<ul class={listClasses}>
		{#if items}
			{#each items as item (item.id)}
				<li class="flex items-center gap-2">
					{#if item.icon}
						<span class="inline-flex items-center justify-center">
							{@render item.icon()}
						</span>
					{/if}
					{#if typeof item.content === 'string'}
						{item.content}
					{:else}
						{@render item.content()}
					{/if}
				</li>
			{/each}
		{:else}
			{@render children?.()}
		{/if}
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
		background: var(--color-accent-overlay-5);
	}
</style>
