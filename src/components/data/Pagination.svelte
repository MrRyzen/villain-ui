<script lang="ts">
	interface Props {
		currentPage: number;
		totalPages: number;
		maxVisible?: number;
		onPageChange?: (page: number) => void;
		/** @deprecated Use onPageChange */
		onpagechange?: (page: number) => void;
		prevIcon?: import('svelte').Snippet;
		nextIcon?: import('svelte').Snippet;
		showLabels?: boolean;
	}

	let {
		currentPage = $bindable(1),
		totalPages,
		maxVisible = 7,
		onPageChange,
		onpagechange,
		prevIcon,
		nextIcon,
		showLabels
	}: Props = $props();

	const onPageChangeCallback = $derived(onPageChange ?? onpagechange);

	const displayPrevLabel = $derived(showLabels !== false);
	const displayNextLabel = $derived(showLabels !== false);

	const visiblePages = $derived((() => {
		const pages: (number | 'ellipsis')[] = [];

		if (totalPages <= maxVisible) {
			// Show all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			const halfVisible = Math.floor((maxVisible - 2) / 2);
			let startPage = Math.max(2, currentPage - halfVisible);
			let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

			// Adjust range if at boundaries
			if (currentPage <= halfVisible + 1) {
				endPage = maxVisible - 1;
			} else if (currentPage >= totalPages - halfVisible) {
				startPage = totalPages - maxVisible + 2;
			}

			// Add ellipsis before start if needed
			if (startPage > 2) {
				pages.push('ellipsis');
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Add ellipsis after end if needed
			if (endPage < totalPages - 1) {
				pages.push('ellipsis');
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	})());

	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		currentPage = page;
		onPageChangeCallback?.(page);
	}
</script>

<nav role="navigation" aria-label="Pagination" class="flex items-center gap-2">
	<!-- Previous Button -->
	<button
		class="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent transition-all duration-300 font-[var(--font-body)] hover:bg-[var(--color-secondary-overlay-10)] hover:border-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[var(--color-border)]"
		onclick={() => goToPage(currentPage - 1)}
		disabled={currentPage === 1}
		aria-disabled={currentPage === 1}
	>
		{#if prevIcon}
			<span class="inline-flex items-center justify-center">
				{@render prevIcon()}
			</span>
		{/if}
		{#if displayPrevLabel}Previous{/if}
	</button>

	<!-- Page Numbers -->
	{#each visiblePages as page}
		{#if page === 'ellipsis'}
			<span class="px-3 py-2 text-[var(--color-text-muted)]">...</span>
		{:else}
			<button
				class="px-3 py-2 rounded-[var(--radius-md)] transition-all duration-300 font-[var(--font-body)]"
				class:active={page === currentPage}
				class:inactive={page !== currentPage}
				onclick={() => goToPage(page)}
				aria-current={page === currentPage ? 'page' : undefined}
			>
				{page}
			</button>
		{/if}
	{/each}

	<!-- Next Button -->
	<button
		class="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent transition-all duration-300 font-[var(--font-body)] hover:bg-[var(--color-secondary-overlay-10)] hover:border-[var(--color-accent)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[var(--color-border)]"
		onclick={() => goToPage(currentPage + 1)}
		disabled={currentPage === totalPages}
		aria-disabled={currentPage === totalPages}
	>
		{#if displayNextLabel}Next{/if}
		{#if nextIcon}
			<span class="inline-flex items-center justify-center">
				{@render nextIcon()}
			</span>
		{/if}
	</button>
</nav>

<style>
	button.active {
		background: var(--color-accent);
		color: var(--color-text);
		cursor: default;
	}

	button.active {
		box-shadow: 0 0 20px var(--color-accent-overlay-50);
	}

	button.inactive {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text);
	}

	button.inactive:hover {
		background: var(--color-accent-overlay-10);
		border-color: var(--color-accent);
	}
</style>
