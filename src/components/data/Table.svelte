<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Column, SortDirection, RowKey } from './Data.types';
	import Checkbox from '../forms/Checkbox.svelte';

	interface Props {
		// Dynamic data mode
		columns?: Column[];
		data?: Record<string, any>[];
		// Visual options
		striped?: boolean;
		hoverable?: boolean;
		compact?: boolean;
		stickyHeader?: boolean;
		// State management
		loading?: boolean;
		loadingMessage?: string;
		emptyMessage?: string;
		emptyState?: Snippet;
		// User-defined filter/search function
		filterFn?: (row: Record<string, any>) => boolean;
		// Callbacks for user-implemented features
		onSort?: (columnKey: string, direction: SortDirection) => void;
		onRowClick?: (row: Record<string, any>) => void;
		// Multi-select
		selectable?: boolean;
		selectedKeys?: Set<RowKey>;
		rowKey?: string;
		onSelectionChange?: (selectedKeys: Set<RowKey>, rows: Record<string, any>[]) => void;
		// Manual markup mode
		children?: Snippet;
		// Column-specific snippets for hybrid mode
		[key: `cell_${string}`]: Snippet<[{ value: any; row: any }]> | undefined;
		// Rest props
		class?: string;
	}

	let {
		columns,
		data,
		striped = false,
		hoverable = true,
		compact = false,
		stickyHeader = false,
		loading = false,
		loadingMessage = 'Loading...',
		emptyMessage = 'No data available',
		emptyState,
		filterFn,
		onSort,
		onRowClick,
		selectable = false,
		selectedKeys = $bindable(new Set<RowKey>()),
		rowKey = 'id',
		onSelectionChange,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Determine if we're in dynamic mode or manual markup mode
	const isDynamicMode = $derived(columns && data);

	// Apply user-defined filter if provided
	const filteredData = $derived.by(() => {
		if (!isDynamicMode || !data) return [];
		if (!filterFn) return data;
		return data.filter(filterFn);
	});

	// Track current sort state
	let sortColumn = $state<string | null>(null);
	let sortDirection = $state<SortDirection>(null);

	function handleSort(columnKey: string) {
		if (!onSort) return;

		// Cycle through: null -> asc -> desc -> null
		if (sortColumn !== columnKey) {
			sortColumn = columnKey;
			sortDirection = 'asc';
		} else if (sortDirection === 'asc') {
			sortDirection = 'desc';
		} else if (sortDirection === 'desc') {
			sortColumn = null;
			sortDirection = null;
		} else {
			sortDirection = 'asc';
		}

		onSort(columnKey, sortDirection);
	}

	function handleRowClick(row: Record<string, any>) {
		if (onRowClick) {
			onRowClick(row);
		}
	}

	// Selection logic
	function getRowKey(row: Record<string, any>, index: number): RowKey {
		return row[rowKey] ?? index;
	}

	const allSelected = $derived.by(() => {
		if (!selectable || filteredData.length === 0) return false;
		return filteredData.every((row, i) => selectedKeys.has(getRowKey(row, i)));
	});

	const someSelected = $derived.by(() => {
		if (!selectable || filteredData.length === 0) return false;
		const selectedCount = filteredData.filter((row, i) => selectedKeys.has(getRowKey(row, i))).length;
		return selectedCount > 0 && selectedCount < filteredData.length;
	});

	function toggleSelectAll() {
		if (allSelected) {
			// Deselect all
			selectedKeys = new Set();
		} else {
			// Select all filtered rows
			selectedKeys = new Set(filteredData.map((row, i) => getRowKey(row, i)));
		}
		notifySelectionChange();
	}

	function toggleRowSelection(row: Record<string, any>, index: number) {
		const key = getRowKey(row, index);
		const newSet = new Set(selectedKeys);
		if (newSet.has(key)) {
			newSet.delete(key);
		} else {
			newSet.add(key);
		}
		selectedKeys = newSet;
		notifySelectionChange();
	}

	function isRowSelected(row: Record<string, any>, index: number): boolean {
		return selectedKeys.has(getRowKey(row, index));
	}

	function notifySelectionChange() {
		if (onSelectionChange) {
			const selectedRows = filteredData.filter((row, i) => selectedKeys.has(getRowKey(row, i)));
			onSelectionChange(selectedKeys, selectedRows);
		}
	}
</script>

<div class="panel-raised rounded-[var(--radius-xl)] overflow-hidden {className}" {...restProps}>
	<table class="mrdv-table w-full" class:striped class:hoverable class:compact class:sticky-header={stickyHeader}>
		{#if isDynamicMode}
			<!-- Dynamic mode: render from columns and data -->
			<thead>
				<tr>
					{#if selectable}
						<th class="select-cell">
							<Checkbox
								checked={allSelected}
								onchange={toggleSelectAll}
								class={someSelected ? 'indeterminate' : ''}
							/>
						</th>
					{/if}
					{#each columns as column}
						<th
							style:text-align={column.align || 'left'}
							class:sortable={column.sortable && onSort}
							class:sorted={sortColumn === column.key}
							onclick={() => column.sortable && handleSort(column.key)}
						>
							<div class="th-content">
								{column.label}
								{#if column.sortable && onSort}
									<span class="sort-indicator">
										{#if sortColumn === column.key}
											{#if sortDirection === 'asc'}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path d="m18 15-6-6-6 6" />
												</svg>
											{:else if sortDirection === 'desc'}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path d="m6 9 6 6 6-6" />
												</svg>
											{/if}
										{:else}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
												opacity="0.3"
											>
												<path d="m7 15 5 5 5-5" />
												<path d="m7 9 5-5 5 5" />
											</svg>
										{/if}
									</span>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<!-- Loading state -->
					<tr class="state-row">
						<td colspan={(columns?.length || 0) + (selectable ? 1 : 0)} class="text-center">
							<div class="loading-container">
								<svg
									class="loading-spinner"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M21 12a9 9 0 1 1-6.219-8.56" />
								</svg>
								<span>{loadingMessage}</span>
							</div>
						</td>
					</tr>
				{:else if filteredData.length === 0}
					<!-- Empty state -->
					<tr class="state-row">
						<td colspan={(columns?.length || 0) + (selectable ? 1 : 0)} class="text-center">
							{#if emptyState}
								{@render emptyState()}
							{:else}
								<div class="empty-container">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
										opacity="0.3"
									>
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
									<p>{emptyMessage}</p>
								</div>
							{/if}
						</td>
					</tr>
				{:else}
					<!-- Data rows -->
					{#each filteredData as row, index}
						<tr
							class:clickable={onRowClick}
							class:selected={selectable && isRowSelected(row, index)}
							onclick={() => handleRowClick(row)}
						>
							{#if selectable}
								<td class="select-cell" onclick={(e) => e.stopPropagation()}>
									<Checkbox
										checked={isRowSelected(row, index)}
										onchange={() => toggleRowSelection(row, index)}
									/>
								</td>
							{/if}
							{#each columns as column}
								<td style:text-align={column.align || 'left'}>
									{#if restProps[`cell_${column.key}`]}
										{@render restProps[`cell_${column.key}`]({ value: row[column.key], row })}
									{:else if column.render}
										{@html column.render(row[column.key], row)}
									{:else}
										{row[column.key]}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		{:else}
			<!-- Manual markup mode: use children snippet -->
			{@render children?.()}
		{/if}
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
		transition: all var(--duration-200) var(--ease-luxe);
	}

	.mrdv-table.hoverable :global(tbody tr:hover) {
		background: var(--color-accent-overlay-5);
		transform: translateY(-1px);
		box-shadow:
			0 2px 8px var(--color-shadow-overlay-20),
			var(--shadow-accent-glow);
	}

	.mrdv-table.striped :global(tbody tr:nth-child(even)) {
		background: var(--color-neutral-overlay-2);
	}

	.mrdv-table.striped.hoverable :global(tbody tr:nth-child(even):hover) {
		background: var(--color-accent-overlay-5);
		transform: translateY(-1px);
		box-shadow:
			0 2px 8px var(--color-shadow-overlay-20),
			var(--shadow-accent-glow);
	}

	.mrdv-table :global(th),
	.mrdv-table :global(td) {
		text-align: left;
	}

	/* Sortable column styles */
	.mrdv-table th.sortable {
		cursor: pointer;
		user-select: none;
		transition: all var(--duration-200) var(--ease-luxe);
	}

	.mrdv-table th.sortable:hover {
		background: var(--color-accent-overlay-5);
		color: var(--color-accent);
	}

	.mrdv-table th.sorted {
		color: var(--color-accent);
	}

	.th-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: space-between;
	}

	.sort-indicator {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* Clickable row styles */
	.mrdv-table tbody tr.clickable {
		cursor: pointer;
	}

	/* Selection styles */
	.select-cell {
		width: 3rem;
		padding-left: 1rem !important;
		padding-right: 0.5rem !important;
	}

	.mrdv-table tbody tr.selected {
		background: var(--color-accent-overlay-10);
	}

	.mrdv-table tbody tr.selected:hover {
		background: var(--color-accent-overlay-15);
	}

	.mrdv-table.striped tbody tr.selected:nth-child(even) {
		background: var(--color-accent-overlay-10);
	}

	/* Indeterminate checkbox styling */
	.select-cell :global(.indeterminate input[type="checkbox"]) {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.select-cell :global(.indeterminate input[type="checkbox"])::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 10px;
		height: 2px;
		background: white;
		border-radius: 1px;
	}

	/* Sticky header */
	.mrdv-table.sticky-header thead {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	/* Loading state */
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 3rem 1rem;
		color: var(--color-text-secondary);
	}

	.loading-spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Empty state */
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 3rem 1rem;
		color: var(--color-text-muted);
	}

	.empty-container p {
		margin: 0;
		font-size: 0.875rem;
	}

	/* State row */
	.state-row td {
		border-bottom: none !important;
	}

	.text-center {
		text-align: center;
	}
</style>
