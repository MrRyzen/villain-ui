<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { CalendarEvent } from './CalendarGrid.types';

	interface CellData {
		date: Date;
		events: CalendarEvent[];
		isToday: boolean;
		isSelected: boolean;
		isCurrentMonth: boolean;
		isEmpty: boolean;
	}

	interface Props {
		month?: Date;
		events?: CalendarEvent[];
		selectedDate?: Date;
		onDateSelect?: (date: Date) => void;
		onMonthChange?: (date: Date) => void;
		renderCell?: Snippet<[CellData]>;
		weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
		showWeekNumbers?: boolean;
		highlightToday?: boolean;
		class?: string;
	}

	let {
		month = $bindable(new Date()),
		events = [],
		selectedDate = $bindable<Date | undefined>(undefined),
		onDateSelect,
		onMonthChange,
		renderCell,
		weekStartsOn = 0,
		showWeekNumbers = false,
		highlightToday = true,
		class: className = ''
	}: Props = $props();

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Get calendar days for the current month
	const calendarDays = $derived.by(() => {
		const year = month.getFullYear();
		const monthIndex = month.getMonth();

		const firstDay = new Date(year, monthIndex, 1);
		const lastDay = new Date(year, monthIndex + 1, 0);

		const startingDayOfWeek = firstDay.getDay();
		const daysInMonth = lastDay.getDate();

		// Adjust for week start day
		const offset = weekStartsOn === 1 ? (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1) : startingDayOfWeek;

		const days: Date[] = [];

		// Previous month days
		const prevMonthLastDay = new Date(year, monthIndex, 0);
		for (let i = offset - 1; i >= 0; i--) {
			days.push(new Date(year, monthIndex - 1, prevMonthLastDay.getDate() - i));
		}

		// Current month days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(year, monthIndex, i));
		}

		// Next month days to fill grid
		const remainingCells = 42 - days.length; // 6 weeks * 7 days
		for (let i = 1; i <= remainingCells; i++) {
			days.push(new Date(year, monthIndex + 1, i));
		}

		return days;
	});

	// Group events by date string
	const eventsByDate = $derived.by(() => {
		const map = new Map<string, CalendarEvent[]>();
		events.forEach((event) => {
			const eventDate = typeof event.date === 'string' ? new Date(event.date) : event.date;
			const key = eventDate.toISOString().split('T')[0];
			if (!map.has(key)) {
				map.set(key, []);
			}
			map.get(key)!.push(event);
		});
		return map;
	});

	function isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	function isSameMonth(date: Date): boolean {
		return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();
	}

	function getCellData(date: Date): CellData {
		const dateKey = date.toISOString().split('T')[0];
		const cellEvents = eventsByDate.get(dateKey) || [];
		
		return {
			date,
			events: cellEvents,
			isToday: highlightToday && isSameDay(date, today),
			isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
			isCurrentMonth: isSameMonth(date),
			isEmpty: cellEvents.length === 0 && !isSameMonth(date)
		};
	}

	function handleDateClick(date: Date, isCurrentMonth: boolean) {
		if (!isCurrentMonth) {
			// Navigate to that month
			const newMonth = new Date(date);
			month = newMonth;
			onMonthChange?.(newMonth);
		}
		selectedDate = date;
		onDateSelect?.(date);
	}

	function handleKeyDown(event: KeyboardEvent, date: Date, index: number) {
		const days = calendarDays;
		let newIndex = index;

		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				newIndex = index > 0 ? index - 1 : index;
				break;
			case 'ArrowRight':
				event.preventDefault();
				newIndex = index < days.length - 1 ? index + 1 : index;
				break;
			case 'ArrowUp':
				event.preventDefault();
				newIndex = index >= 7 ? index - 7 : index;
				break;
			case 'ArrowDown':
				event.preventDefault();
				newIndex = index + 7 < days.length ? index + 7 : index;
				break;
			case 'Home':
				event.preventDefault();
				newIndex = Math.floor(index / 7) * 7;
				break;
			case 'End':
				event.preventDefault();
				newIndex = Math.floor(index / 7) * 7 + 6;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				handleDateClick(date, isSameMonth(date));
				return;
			default:
				return;
		}

		if (newIndex !== index) {
			const newDate = days[newIndex];
			requestAnimationFrame(() => {
				const cell = document.querySelector(`[data-date="${newDate.toISOString()}"]`) as HTMLElement;
				cell?.focus();
			});
		}
	}

	function previousMonth() {
		const newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
		month = newMonth;
		onMonthChange?.(newMonth);
	}

	function nextMonth() {
		const newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
		month = newMonth;
		onMonthChange?.(newMonth);
	}

	const weekDayNames = $derived(
		weekStartsOn === 1
			? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	);

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const currentMonthYear = $derived(`${monthNames[month.getMonth()]} ${month.getFullYear()}`);

	const variantColors = {
		default: 'var(--color-base-3)',
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		error: 'var(--color-error)',
		accent: 'var(--color-accent)'
	};
</script>

<div class="calendar-grid {className}">
	<!-- Header with month navigation -->
	<div class="calendar-header">
		<button
			type="button"
			onclick={previousMonth}
			class="nav-button"
			aria-label="Previous month"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<h2 class="month-title">{currentMonthYear}</h2>

		<button
			type="button"
			onclick={nextMonth}
			class="nav-button"
			aria-label="Next month"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	<!-- Calendar grid -->
	<div role="grid" aria-label="Calendar" class="calendar-body">
		<!-- Week day headers -->
		<div role="row" class="week-header">
			{#if showWeekNumbers}
				<div class="week-number-header"></div>
			{/if}
			{#each weekDayNames as day}
				<div role="columnheader" class="day-header">
					{day}
				</div>
			{/each}
		</div>

		<!-- Date cells -->
		{#each { length: 6 } as _, weekIndex}
			<div role="row" class="calendar-week">
				{#if showWeekNumbers}
					<div class="week-number">W{weekIndex + 1}</div>
				{/if}
				{#each calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7) as date, dayIndex}
					{@const cellData = getCellData(date)}
					{@const globalIndex = weekIndex * 7 + dayIndex}
					<button
						role="gridcell"
						type="button"
						data-date={date.toISOString()}
						class="calendar-cell"
						class:current-month={cellData.isCurrentMonth}
						class:other-month={!cellData.isCurrentMonth}
						class:is-today={cellData.isToday}
						class:is-selected={cellData.isSelected}
						class:has-events={cellData.events.length > 0}
						tabindex={globalIndex === 0 ? 0 : -1}
						onclick={() => handleDateClick(date, cellData.isCurrentMonth)}
						onkeydown={(e) => handleKeyDown(e, date, globalIndex)}
						aria-label="{date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}"
						aria-selected={cellData.isSelected}
					>
						{#if renderCell}
							{@render renderCell(cellData)}
						{:else}
							<div class="cell-content">
								<span class="day-number">{date.getDate()}</span>
								{#if cellData.events.length > 0}
									<div class="event-indicators">
										{#each cellData.events.slice(0, 3) as event}
											<span
												class="event-dot"
												style="background-color: {variantColors[event.variant || 'default']}"
												title={event.title}
											></span>
										{/each}
										{#if cellData.events.length > 3}
											<span class="event-more">+{cellData.events.length - 3}</span>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.calendar-grid {
		width: 100%;
		font-family: var(--font-body);
		color: var(--color-text);
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.month-title {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		margin: 0;
	}

	.nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text-soft);
		cursor: pointer;
		transition: all var(--duration-200) var(--ease-sharp);
	}

	.nav-button:hover {
		background: var(--color-base-3);
		color: var(--color-accent);
		border-color: var(--color-accent);
	}

	.nav-button:active {
		transform: scale(0.95);
	}

	.calendar-body {
		padding: 1rem;
	}

	.week-header {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.week-header.with-numbers {
		grid-template-columns: 2.5rem repeat(7, 1fr);
	}

	.day-header {
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-soft);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.5rem;
	}

	.calendar-week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.week-number-header,
	.week-number {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.calendar-cell {
		position: relative;
		aspect-ratio: 1;
		background: var(--color-base-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0.5rem;
		cursor: pointer;
		transition: all var(--duration-200) var(--ease-sharp);
		font-family: inherit;
		color: inherit;
	}

	.calendar-cell:hover {
		background: var(--color-base-2);
		border-color: var(--color-accent-soft);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.calendar-cell:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		z-index: 1;
	}

	.calendar-cell.other-month {
		opacity: 0.4;
	}

	.calendar-cell.is-today {
		background: var(--color-accent-overlay-10);
		border-color: var(--color-accent);
	}

	.calendar-cell.is-selected {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-text);
		box-shadow: 0 0 20px var(--color-accent-glow);
	}

	.calendar-cell.is-selected .day-number {
		color: var(--color-base-0);
		font-weight: 700;
	}

	.cell-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 100%;
		gap: 0.25rem;
	}

	.day-number {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.event-indicators {
		display: flex;
		gap: 0.25rem;
		align-items: center;
		flex-wrap: wrap;
		justify-content: center;
	}

	.event-dot {
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 0 6px currentColor;
	}

	.event-more {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		font-weight: 600;
	}

	/* Accessibility: Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.calendar-cell {
			transition: none;
		}

		.calendar-cell:hover {
			transform: none;
		}
	}
</style>
