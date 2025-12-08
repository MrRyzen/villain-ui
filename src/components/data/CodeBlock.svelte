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
		 * Whether to show the copy button. Default: true.
		 */
		showCopy?: boolean;
		/**
		 * Raw code text for copying. If not provided, copy functionality attempts to extract text from the rendered content.
		 */
		code?: string;
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
		showCopy = true,
		code,
		children
	}: Props = $props();

	let codeContainer: HTMLDivElement;
	let copied = $state(false);

	async function copyCode() {
		try {
			const textToCopy = code || codeContainer?.textContent || '';
			await navigator.clipboard.writeText(textToCopy);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy code:', err);
		}
	}
</script>

<div class="glass-panel rounded-[var(--radius-lg)] overflow-hidden relative">
	{#if filename || showCopy}
		<div
			class="px-4 py-2 border-b border-border flex items-center justify-between"
			style="background: var(--color-base-2); color: var(--color-text-soft); font-family: var(--font-mono); font-size: 0.875rem;"
		>
		<span>{filename || ''}</span>
		{#if showCopy}
			<button
				onclick={copyCode}
				class="copy-button px-3 py-1 rounded-sm transition-all text-xs"
				aria-label="Copy code"
			>
				{copied ? 'Copied!' : 'Copy'}
			</button>
		{/if}
	</div>
{/if}	<div
		bind:this={codeContainer}
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
							? 'background: var(--color-accent-overlay-10);'
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

	/* Copy button styling */
	.copy-button {
		background: var(--color-base-3);
		color: var(--color-text-soft);
		border: 1px solid var(--color-border);
		font-size: 0.75rem;
	}

	.copy-button:hover {
		background: var(--color-accent);
		color: var(--color-text);
		border-color: var(--color-accent);
	}

	/* Highlight gutter numbers */
	.highlighted {
		background: var(--color-accent-overlay-10);
	}

	/*
	 * Consumer-provided line highlighting:
	 * Consumers should apply the `.line` class to each code line element
	 * and the `.highlighted` class to lines that should be highlighted.
	 * This ensures consistent styling with the component's luxury aesthetic.
	 */
	:global(.line.highlighted) {
		background: var(--color-accent-overlay-10);
		display: inline-block;
		width: 100%;
	}
</style>
