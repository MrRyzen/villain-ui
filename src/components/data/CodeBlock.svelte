<script lang="ts">
	/**
	 * Props for the CodeBlock component.
	 * 
	 * This is a presentational component that provides layout and styling for syntax-highlighted code.
	 * Consumers are responsible for providing pre-highlighted HTML via the default slot and ensuring
	 * the content is properly sanitized to prevent XSS attacks.
	 */
	interface Props {
		/**
		 * Optional filename to display in the header.
		 */
		filename?: string;
		/**
		 * Whether to show line numbers in the gutter.
		 */
		showLineNumbers?: boolean;
		/**
		 * Total number of lines in the code. Required when showLineNumbers is true.
		 */
		lineCount?: number;
		/**
		 * Array of line numbers (1-indexed) to highlight in the gutter.
		 */
		highlightLines?: number[];
		/**
		 * Slot for pre-highlighted code HTML.
		 */
		children?: import('svelte').Snippet;
	}

	let {
		filename,
		showLineNumbers = false,
		lineCount = 0,
		highlightLines = [],
		children
	}: Props = $props();

	// Development-only validation
</script>

<div class="glass-panel rounded-[var(--radius-lg)] overflow-hidden">
	{#if filename}
		<div
			class="px-4 py-2 border-b border-border"
			style="background: var(--color-base-2); color: var(--color-text-soft); font-family: var(--font-mono); font-size: 0.875rem;"
		>
			{filename}
		</div>
	{/if}

	<div
		class="p-4 overflow-x-auto"
		style="background: var(--color-base-1); font-family: var(--font-mono); font-size: 0.875rem; line-height: 1.6;"
	>
		{#if showLineNumbers}
			<div class="flex">
				<div
					class="pr-4 border-r border-border select-none"
					style="color: var(--color-text-muted);"
				>
					{#each Array.from({ length: lineCount }, (_, i) => i + 1) as lineNum}
						<div
							class:highlighted={highlightLines.includes(lineNum)}
							style={highlightLines.includes(lineNum)
								? 'background: rgba(127, 61, 255, 0.1);'
								: ''}
						>
							{lineNum}
						</div>
					{/each}
				</div>
				<div class="pl-4 flex-1">
					{@render children?.()}
				</div>
			</div>
		{:else}
			<div>
				{@render children?.()}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Custom scrollbar styling */
	div::-webkit-scrollbar {
		height: 8px;
	}

	div::-webkit-scrollbar-track {
		background: var(--color-base-1);
	}

	div::-webkit-scrollbar-thumb {
		background: var(--color-accent);
		border-radius: var(--radius-sm);
	}

	div::-webkit-scrollbar-thumb:hover {
		background: var(--color-accent-soft);
	}

	/* Highlight gutter numbers */
	.highlighted {
		background: rgba(127, 61, 255, 0.1);
	}

	/* 
	 * Consumer-provided line highlighting:
	 * Consumers should apply the `.line` class to each code line element
	 * and the `.highlighted` class to lines that should be highlighted.
	 * This ensures consistent styling with the component's luxury aesthetic.
	 */
	:global(.line.highlighted) {
		background: rgba(127, 61, 255, 0.1);
		display: inline-block;
		width: 100%;
	}
</style>
