<script lang="ts">
	import type { WeekHeatmapCell } from './Data.types';
	import Portal from '../utilities/Portal.svelte';

	interface Props {
		/** 7 rows × 24 cols. Row index 0 = Sunday. */
		matrix: number[][];
		/**
		 * Display order of matrix row indices. Default Sunday-first [0..6].
		 * Monday-first = [1, 2, 3, 4, 5, 6, 0].
		 */
		rowOrder?: number[];
		/** Labels aligned to rowOrder. Default ['Sun','Mon',...] reordered by rowOrder. */
		dayLabels?: string[];
		/** Hour column label formatter. Default String(hour). E.g. h => '12a'/'6a'/'12p'/'6p'. */
		hourLabel?: (hour: number) => string;
		/**
		 * Show a label only every N hour columns (others render empty) to reduce axis noise.
		 * Default 1 (label every hour).
		 */
		hourLabelEvery?: number;
		/**
		 * true (default): scale intensity to max(matrix) — raw-count matrices.
		 * false: values are already 0–100 — percentage matrices.
		 */
		normalize?: boolean;
		/** Outline overlay predicate (e.g. member's frequent cells). */
		highlight?: (day: number, hour: number) => boolean;
		/** Ring the current weekday+hour cell. Default false. */
		markNow?: boolean;
		/** Tooltip/aria text per cell. Default: `${dayLabel} ${hourLabel} — ${value}`. */
		cellLabel?: (cell: WeekHeatmapCell) => string;
		/**
		 * When provided, cells render as <button> and clicking/tapping calls this —
		 * the consumer renders its own readout. When absent, cells are inert divs
		 * and the grid gets role="img".
		 */
		onCellSelect?: (cell: WeekHeatmapCell) => void;
		/** Currently selected cell, ring-highlighted. Consumer-managed (pairs with onCellSelect). */
		selected?: { day: number; hour: number } | null;
		/** Accessible name for the grid. Default "Weekly traffic heatmap". */
		ariaLabel?: string;
		class?: string;
	}

	let {
		matrix,
		rowOrder,
		dayLabels,
		hourLabel = (h) => String(h),
		hourLabelEvery = 1,
		normalize = true,
		highlight,
		markNow = false,
		cellLabel,
		onCellSelect,
		selected = null,
		ariaLabel = 'Weekly traffic heatmap',
		class: className = ''
	}: Props = $props();

	const BASE_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const hours = Array.from({ length: 24 }, (_, h) => h);

	// Minute tick (markNow only) so the ring follows the clock on long-lived pages.
	// Same-value assignments are no-ops, so re-renders only happen on the hour flip.
	let nowDay = $state(new Date().getDay());
	let nowHour = $state(new Date().getHours());

	$effect(() => {
		if (!markNow) return;
		const tick = setInterval(() => {
			const d = new Date();
			nowDay = d.getDay();
			nowHour = d.getHours();
		}, 60_000);
		return () => clearInterval(tick);
	});

	const order = $derived(rowOrder ?? [0, 1, 2, 3, 4, 5, 6]);
	const labels = $derived(dayLabels ?? order.map((d) => BASE_DAY_NAMES[d] ?? String(d)));
	const rows = $derived(order.map((day, i) => ({ day, label: labels[i] ?? String(day) })));

	const maxValue = $derived(normalize ? Math.max(1, ...matrix.flat()) : 100);

	function getCell(day: number, hour: number): WeekHeatmapCell {
		const value = matrix[day]?.[hour] ?? 0;
		const intensity = Math.min(100, Math.max(0, Math.round((value / maxValue) * 100)));
		return { day, hour, value, intensity };
	}

	function labelFor(cell: WeekHeatmapCell, dayLabel: string, isNow: boolean): string {
		const text = cellLabel ? cellLabel(cell) : `${dayLabel} ${hourLabel(cell.hour)}: ${cell.value}`;
		return isNow ? `${text} (now)` : text;
	}

	const fill = (intensity: number) =>
		`color-mix(in srgb, var(--color-accent) ${intensity}%, var(--color-base-2))`;

	// Single branded tooltip, portaled to <body> so it escapes the overflow-x
	// scroll wrapper (a per-cell absolute tooltip would expand/scroll the grid).
	let tip = $state<{ label: string; x: number; y: number } | null>(null);

	function showTip(el: HTMLElement, label: string): void {
		const r = el.getBoundingClientRect();
		tip = { label, x: r.left + r.width / 2, y: r.top };
	}

	const hideTip = () => (tip = null);
</script>

{#if matrix.length > 0}
	<div class="heatmap-scroll {className}">
		<div
			class="heatmap-grid"
			role={onCellSelect ? undefined : 'img'}
			aria-label={onCellSelect ? undefined : ariaLabel}
		>
			<!-- Corner + hour axis -->
			<div class="heatmap-corner" aria-hidden="true"></div>
			{#each hours as hour (hour)}
				<div class="heatmap-axis heatmap-hour" aria-hidden="true">
					{hour % hourLabelEvery === 0 ? hourLabel(hour) : ''}
				</div>
			{/each}

			<!-- Day rows -->
			{#each rows as row (row.day)}
				<div class="heatmap-axis heatmap-day" aria-hidden="true">{row.label}</div>
				{#each hours as hour (hour)}
					{@const cell = getCell(row.day, hour)}
					{@const hl = highlight?.(row.day, hour) ?? false}
					{@const isNow = markNow && row.day === nowDay && hour === nowHour}
					{@const isSel = !!selected && selected.day === row.day && selected.hour === hour}
					{@const label = labelFor(cell, row.label, isNow)}
					{#if onCellSelect}
						<button
							type="button"
							class="heatmap-cell"
							class:is-highlight={hl}
							class:is-ring={isNow || isSel}
							style="background-color: {fill(cell.intensity)}"
							aria-label={label}
							aria-pressed={isSel}
							onclick={() => onCellSelect(cell)}
							onmouseenter={(e) => showTip(e.currentTarget, label)}
							onmouseleave={hideTip}
							onfocus={(e) => showTip(e.currentTarget, label)}
							onblur={hideTip}
						></button>
					{:else}
						<div
							class="heatmap-cell"
							class:is-highlight={hl}
							class:is-ring={isNow || isSel}
							style="background-color: {fill(cell.intensity)}"
							aria-hidden="true"
							onmouseenter={(e) => showTip(e.currentTarget, label)}
							onmouseleave={hideTip}
						></div>
					{/if}
				{/each}
			{/each}
		</div>
	</div>

	{#if tip}
		<Portal>
			<div class="heatmap-tip panel-floating" style="left: {tip.x}px; top: {tip.y}px;">
				{tip.label}
			</div>
		</Portal>
	{/if}
{/if}

<style>
	.heatmap-scroll {
		overflow-x: auto;
	}

	.heatmap-grid {
		display: grid;
		grid-template-columns: 3rem repeat(24, 1fr);
		gap: 2px;
		min-width: 640px;
	}

	.heatmap-axis {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.6rem;
		color: var(--color-text-muted);
		text-align: center;
	}

	.heatmap-corner {
		min-width: 3rem;
	}

	.heatmap-cell {
		height: var(--heatmap-cell-size, 1.5rem);
		min-width: var(--heatmap-cell-size, 1.5rem);
		border-radius: 0;
		border: 0;
		padding: 0;
	}

	.heatmap-tip {
		position: fixed;
		transform: translate(-50%, calc(-100% - 8px));
		z-index: var(--z-50, 50);
		pointer-events: none;
		white-space: nowrap;
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-sm);
		font-size: 0.8rem;
		color: var(--color-text);
	}

	button.heatmap-cell {
		cursor: pointer;
	}

	button.heatmap-cell:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.heatmap-cell.is-highlight {
		outline: 1.5px solid color-mix(in srgb, var(--color-text) 85%, transparent);
		outline-offset: -1.5px;
	}

	/* Ring (now / selected) wins over the highlight outline. */
	.heatmap-cell.is-ring {
		box-shadow: 0 0 0 2px var(--color-accent);
		position: relative;
		z-index: 1;
	}

	@media (hover: hover) {
		.heatmap-cell {
			transition: transform 150ms var(--ease-sharp);
		}

		.heatmap-cell:hover {
			transform: scale(1.2);
			position: relative;
			z-index: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.heatmap-cell {
			transition: none;
		}

		.heatmap-cell:hover {
			transform: none;
		}
	}
</style>
