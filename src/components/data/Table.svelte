<script lang="ts">
	interface Props {
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		children?: import('svelte').Snippet;
	}

	let { striped = false, hoverable = true, compact = false, children }: Props = $props();
</script>

<div class="glass-panel rounded-[var(--radius-xl)] overflow-hidden">
	<table class="mrdv-table w-full" class:striped class:hoverable class:compact>
		{@render children?.()}
	</table>
</div>

<style>
	.mrdv-table :global(thead) {
		background: var(--color-base-2);
		border-bottom: 2px solid var(--color-border-strong);
	}

	.mrdv-table :global(thead th) {
		color: var(--color-text);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		text-align: left;
	}

	.mrdv-table.compact :global(th),
	.mrdv-table.compact :global(td) {
		padding: 0.5rem 1rem;
	}

	.mrdv-table:not(.compact) :global(th),
	.mrdv-table:not(.compact) :global(td) {
		padding: 1rem 1.5rem;
	}

	.mrdv-table :global(tbody) {
		position: relative;
		z-index: 1;
	}

	.mrdv-table :global(tbody tr) {
		border-bottom: 1px solid var(--color-border);
		transition: all var(--ease-luxe);
	}

	.mrdv-table.hoverable :global(tbody tr:hover) {
		background: rgba(107, 33, 168, 0.05);
		transform: translateY(-1px);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.2),
			var(--shadow-accent-glow);
	}

	.mrdv-table.striped :global(tbody tr:nth-child(even)) {
		background: rgba(255, 255, 255, 0.02);
	}

	.mrdv-table.striped.hoverable :global(tbody tr:nth-child(even):hover) {
		background: rgba(107, 33, 168, 0.05);
		transform: translateY(-1px);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.2),
			var(--shadow-accent-glow);
	}

	.mrdv-table :global(th),
	.mrdv-table :global(td) {
		text-align: left;
	}
</style>
