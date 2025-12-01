<script lang="ts">
	import { onMount } from 'svelte';
	import { codeToHtml } from 'shiki';

	/**
	 * Props for the CodeBlock component.
	 * 
	 * **SECURITY WARNING**: The `code` prop must contain only TRUSTED content.
	 * This component uses {@html} to render syntax-highlighted code. Never pass
	 * arbitrary user input directly to `code` unless it has been properly sanitized
	 * upstream. Unescaped user content creates an XSS vulnerability.
	 */
	interface Props {
		/**
		 * The code content to display. **MUST BE TRUSTED** - never pass unsanitized user input.
		 */
		code: string;
		language?: string;
		theme?: 'dark' | 'light';
		showLineNumbers?: boolean;
		highlightLines?: number[];
		filename?: string;
	}

	let {
		code,
		language = 'typescript',
		theme = 'dark',
		showLineNumbers = false,
		highlightLines = [],
		filename
	}: Props = $props();

	let highlightedHtml = $state('');
	let isLoading = $state(true);

	/**
	 * HTML-escape function to prevent XSS attacks when building HTML strings.
	 * Escapes: & < > " ' characters.
	 */
	function escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	onMount(async () => {
		if (typeof DOMParser === 'undefined') {
			// SSR fallback: escape HTML to prevent XSS
			const escapedCode = escapeHtml(code);
			highlightedHtml = `<pre><code>${escapedCode}</code></pre>`;
			isLoading = false;
			return;
		}

		try {
			const html = await codeToHtml(code, {
				lang: language,
				theme: theme === 'dark' ? 'github-dark' : 'github-light'
			});

			// Process highlightLines if provided
			if (highlightLines && highlightLines.length > 0) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				const lines = doc.querySelectorAll('.shiki .line');

				highlightLines.forEach((lineNum) => {
					const lineEl = lines[lineNum - 1];
					if (lineEl) {
						lineEl.classList.add('highlighted');
					}
				});

				highlightedHtml = doc.body.innerHTML;
			} else {
				highlightedHtml = html;
			}
		} catch (error) {
			console.error('Shiki highlighting error:', error);
			// Fallback with HTML escaping to prevent XSS
			const escapedCode = escapeHtml(code);
			const fallbackHtml = `<pre><code>${escapedCode}</code></pre>`;

			if (highlightLines && highlightLines.length > 0) {
				const parser = new DOMParser();
				const doc = parser.parseFromString(fallbackHtml, 'text/html');
				const codeLines = code.split('\n');
				const codeEl = doc.querySelector('code');

				if (codeEl) {
					// Escape each line individually to prevent XSS
					codeEl.innerHTML = codeLines
						.map(
							(line, i) =>
								`<div class="line ${highlightLines.includes(i + 1) ? 'highlighted' : ''}">${escapeHtml(line) || ' '}</div>`
						)
						.join('');
				}

				highlightedHtml = doc.body.innerHTML;
			} else {
				highlightedHtml = fallbackHtml;
			}
		} finally {
			isLoading = false;
		}
	});

	const lines = $derived(code.split('\n'));
</script>

<div class="glass-panel rounded-lg overflow-hidden">
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
		{#if isLoading}
			<pre><code>{code}</code></pre>
		{:else if showLineNumbers}
			<div class="flex">
				<div
					class="pr-4 border-r border-border select-none"
					style="color: var(--color-text-muted);"
				>
					{#each lines as _, i}
						<div
							class:highlighted={highlightLines.includes(i + 1)}
							style={highlightLines.includes(i + 1)
								? 'background: rgba(127, 61, 255, 0.1);'
								: ''}
						>
							{i + 1}
						</div>
					{/each}
				</div>
				<div class="pl-4 flex-1">
					{@html highlightedHtml}
				</div>
			</div>
		{:else}
			<div>
				{@html highlightedHtml}
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

	/* Remove default shiki styles that might conflict */
	:global(.shiki) {
		background: transparent !important;
		padding: 0 !important;
	}

	:global(.shiki code) {
		font-family: var(--font-mono);
	}

	/* Highlight gutter numbers */
	.highlighted {
		background: rgba(127, 61, 255, 0.1);
	}

	/* Highlight actual code lines */
	:global(.line.highlighted) {
		background: rgba(127, 61, 255, 0.1);
		display: inline-block;
		width: 100%;
	}
</style>
