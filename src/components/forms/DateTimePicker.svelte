<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';
	import CalendarGrid from '../data/CalendarGrid.svelte';
	import TimePickerGrid from './TimePickerGrid.svelte';
	import Dropdown from '../overlays/Dropdown.svelte';

	export interface Props {
		variant?: 'glass' | 'floating';
		value?: string; // ISO datetime-local format: YYYY-MM-DDTHH:mm
		min?: string;
		max?: string;
		step?: number;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		label?: string;
		id?: string;
		name?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		is24Hour?: boolean;
		onchange?: (event: Event) => void;
		class?: string;
	}

	let {
		variant = 'glass',
		value = $bindable(),
		min,
		max,
		step = 60,
		placeholder = 'Select date and time',
		disabled = false,
		error = false,
		label,
		id = createId('datetimepicker'),
		name,
		autocomplete,
		is24Hour = true,
		onchange,
		class: className = '',
	}: Props = $props();

	let open = $state(false);
	let activeTab: 'date' | 'time' = $state('date');
	let pickerElement = $state<HTMLDivElement>();
	let inputElement = $state<HTMLInputElement>();

	// Parse ISO datetime string to date and time parts
	function parseDateTime(dateTimeStr: string | undefined): { date: string; time: string } | null {
		if (!dateTimeStr || typeof dateTimeStr !== 'string') return null;
		const match = dateTimeStr.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?$/);
		if (!match) return null;
		return { date: match[1], time: match[2] };
	}

	// Parse ISO date string to Date object
	function parseISODate(isoString: string | undefined): Date | undefined {
		if (!isoString || typeof isoString !== 'string') return undefined;
		const date = new Date(isoString + 'T00:00:00');
		if (isNaN(date.getTime())) return undefined;
		return date;
	}

	// Parse time string to hours and minutes
	function parseTime(timeStr: string | undefined): { hours: number; minutes: number } | null {
		if (!timeStr || typeof timeStr !== 'string') return null;
		const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
		if (!match) return null;
		return {
			hours: parseInt(match[1], 10),
			minutes: parseInt(match[2], 10)
		};
	}

	// Get current date and time parts from value
	let selectedDateStr = $state('');
	let selectedHours = $state(0);
	let selectedMinutes = $state(0);

	// Initialize and sync when value changes externally
	$effect(() => {
		const p = parseDateTime(value);
		if (p) {
			selectedDateStr = p.date;
			const t = parseTime(p.time);
			if (t) {
				selectedHours = t.hours;
				selectedMinutes = t.minutes;
			}
		}
	});

	// Calendar state
	const selectedDate = $derived(parseISODate(selectedDateStr));
	let month = $state(new Date());

	// Track previous date to detect external changes
	let prevDateStr = $state('');
	$effect(() => {
		if (selectedDateStr !== prevDateStr) {
			prevDateStr = selectedDateStr;
			const parsedDate = parseISODate(selectedDateStr);
			if (parsedDate) {
				month = new Date(parsedDate);
			}
		}
	});

	// Parse min/max constraints
	const minDateTime = $derived(parseDateTime(min));
	const maxDateTime = $derived(parseDateTime(max));
	const minDateStr = $derived(minDateTime?.date);
	const maxDateStr = $derived(maxDateTime?.date);
	const minTimeStr = $derived(minDateTime?.time);
	const maxTimeStr = $derived(maxDateTime?.time);

	// Get time constraints for the selected date
	const effectiveMinTime = $derived.by(() => {
		// Only apply min time constraint if selected date matches min date
		if (minDateTime && selectedDateStr === minDateTime.date) {
			return minTimeStr;
		}
		return undefined;
	});

	const effectiveMaxTime = $derived.by(() => {
		// Only apply max time constraint if selected date matches max date
		if (maxDateTime && selectedDateStr === maxDateTime.date) {
			return maxTimeStr;
		}
		return undefined;
	});

	// Format date for display
	function formatDisplayDate(isoString: string | undefined): string {
		const date = parseISODate(isoString);
		if (!date) return '';
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Format time for display
	function formatDisplayTime(hours: number, minutes: number): string {
		if (is24Hour) {
			return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
		} else {
			const period = hours >= 12 ? 'PM' : 'AM';
			const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
			return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
		}
	}

	// Combined display value
	const displayValue = $derived.by(() => {
		const dateDisplay = formatDisplayDate(selectedDateStr);
		if (!dateDisplay) return '';
		const timeDisplay = formatDisplayTime(selectedHours, selectedMinutes);
		return `${dateDisplay}, ${timeDisplay}`;
	});

	// Convert Date to ISO string (YYYY-MM-DD)
	function toISODateString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Combine date and time into ISO datetime string
	function combineDateTime(dateStr: string, hours: number, minutes: number): string {
		const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
		return `${dateStr}T${timeStr}`;
	}

	function handleDateSelect(date: Date) {
		const dateStr = toISODateString(date);

		// Validate against min/max date constraints
		if (minDateStr && dateStr < minDateStr) return;
		if (maxDateStr && dateStr > maxDateStr) return;

		selectedDateStr = dateStr;
		// Auto-switch to time tab after selecting date
		activeTab = 'time';
	}

	function handleTimeSelect(hours: number, minutes: number) {
		selectedHours = hours;
		selectedMinutes = minutes;

		// If we have a date selected, update the value and close
		if (selectedDateStr) {
			value = combineDateTime(selectedDateStr, hours, minutes);
			open = false;

			// Trigger onchange
			if (onchange) {
				const event = new Event('change', { bubbles: true });
				inputElement?.dispatchEvent(event);
			}

			inputElement?.focus();
		}
	}

	function togglePicker(event: Event) {
		event.stopPropagation();
		if (disabled) return;
		open = !open;
	}

	function handleInputClick(event: MouseEvent) {
		event.stopPropagation();
		if (disabled) return;
		open = true;
	}

	function handleInputKeyDown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
			event.preventDefault();
			event.stopPropagation();
			open = true;
			return;
		}

		if (event.key === 'Tab' || event.ctrlKey || event.metaKey) {
			return;
		}

		if (event.key === 'Escape') {
			if (open) {
				event.preventDefault();
				open = false;
			}
			return;
		}

		event.preventDefault();
	}

	const errorClasses = $derived(error ? 'error-state' : '');
</script>

<div class="datetime-picker-wrapper w-full">
	{#if label}
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
	{/if}

	<!-- Hidden input for form submission -->
	{#if name}
		<input type="hidden" {name} value={value ?? ''} />
	{/if}

	<Dropdown bind:open placement="bottom-start" closeOnClickOutside={true}>
		{#snippet trigger()}
			<div class="relative w-full">
				<!-- Visible input -->
				<input
					bind:this={inputElement}
					type="text"
					{id}
					{disabled}
					{placeholder}
					{autocomplete}
					value={displayValue}
					readonly
					onclick={handleInputClick}
					onkeydown={handleInputKeyDown}
					aria-haspopup="dialog"
					aria-expanded={open}
					class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
						? disabledClasses
						: ''} {className} pr-12 cursor-pointer caret-transparent"
				/>

				<!-- Calendar + Clock icon -->
				<button
					type="button"
					tabindex={-1}
					onclick={togglePicker}
					{disabled}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-accent transition-colors duration-200 {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
					aria-label="Open date and time picker"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
						<circle cx="16" cy="16" r="2"></circle>
						<path d="M16 14v1"></path>
					</svg>
				</button>
			</div>
		{/snippet}

		<!-- Combined picker dropdown -->
		<div
			bind:this={pickerElement}
			role="dialog"
			aria-modal="true"
			aria-label="Choose date and time"
			class="datetime-picker-dropdown {variant === 'glass' ? 'glass-panel' : 'panel-floating'} rounded-lg overflow-hidden"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Tab navigation -->
			<div class="picker-tabs">
				<button
					type="button"
					class="picker-tab"
					class:active={activeTab === 'date'}
					onclick={(e) => { e.stopPropagation(); activeTab = 'date'; }}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
					</svg>
					Date
				</button>
				<button
					type="button"
					class="picker-tab"
					class:active={activeTab === 'time'}
					onclick={(e) => { e.stopPropagation(); activeTab = 'time'; }}
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
					Time
				</button>
			</div>

			<!-- Current selection display -->
			<div class="selection-display">
				<span class="selection-date" class:has-value={selectedDateStr}>
					{selectedDateStr ? formatDisplayDate(selectedDateStr) : 'No date selected'}
				</span>
				<span class="selection-separator">at</span>
				<span class="selection-time">
					{formatDisplayTime(selectedHours, selectedMinutes)}
				</span>
			</div>

			<!-- Picker content -->
			<div class="picker-content" onclick={(e) => e.stopPropagation()}>
				{#if activeTab === 'date'}
					<CalendarGrid
						bind:month={month}
						selectedDate={selectedDate}
						onDateSelect={handleDateSelect}
						highlightToday={true}
						class="calendar-picker"
					/>
				{:else}
					<TimePickerGrid
						bind:hours={selectedHours}
						bind:minutes={selectedMinutes}
						{is24Hour}
						{step}
						minTime={effectiveMinTime}
						maxTime={effectiveMaxTime}
						onTimeSelect={handleTimeSelect}
					/>
				{/if}
			</div>
		</div>
	</Dropdown>
</div>

<style>
	/* Override Dropdown's inline-block to allow full width trigger */
	.datetime-picker-wrapper :global(.relative.inline-block) {
		display: block;
		width: 100%;
	}

	/* Also target the inner trigger wrapper */
	.datetime-picker-wrapper :global(.relative.inline-block > .inline-block) {
		display: block;
		width: 100%;
	}

	.datetime-picker-dropdown {
		min-width: 320px;
	}

	.picker-tabs {
		display: flex;
		border-bottom: 1px solid var(--color-border);
	}

	.picker-tab {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: transparent;
		border: none;
		color: var(--color-text-soft);
		font-size: 0.875rem;
		font-weight: 500;
		font-family: var(--font-body);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-sharp);
	}

	.picker-tab:hover {
		color: var(--color-text);
		background: var(--color-base-2);
	}

	.picker-tab.active {
		color: var(--color-accent);
		background: var(--color-accent-overlay-10);
		box-shadow: inset 0 -2px 0 var(--color-accent);
	}

	.selection-display {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--color-base-1);
		border-bottom: 1px solid var(--color-border);
		font-size: 0.875rem;
	}

	.selection-date {
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.selection-date.has-value {
		color: var(--color-text);
	}

	.selection-separator {
		color: var(--color-text-muted);
	}

	.selection-time {
		font-weight: 600;
		color: var(--color-text);
		font-family: var(--font-mono);
	}

	.picker-content {
		min-height: 280px;
	}

	:global(.calendar-picker) {
		background: transparent;
	}

	:global(.calendar-picker .calendar-header) {
		padding: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	:global(.calendar-picker .month-title) {
		font-size: 1.125rem;
	}

	:global(.calendar-picker .calendar-body) {
		padding: 0.75rem;
	}

	:global(.calendar-picker .calendar-cell) {
		aspect-ratio: 1;
		min-width: 2.5rem;
		min-height: 2.5rem;
	}

	input[type='text'] {
		min-height: 3rem;
		cursor: pointer;
	}

	input[type='text']:disabled {
		cursor: not-allowed;
	}

	input[type='text']::selection {
		background: transparent;
	}
</style>
