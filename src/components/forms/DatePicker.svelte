<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';
	import CalendarGrid from '../data/CalendarGrid.svelte';
	import Dropdown from '../overlays/Dropdown.svelte';
	
	export interface Props {
		variant?: 'glass' | 'floating';
		value?: string;
		min?: string;
		max?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		label?: string;
		id?: string;
		name?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		onchange?: (event: Event) => void;
		validationMessage?: string;
		class?: string;
	}

	let {
		variant = 'glass',
		value = $bindable(),
		min,
		max,
		placeholder = 'Select date',
		disabled = false,
		error = false,
		label,
		id = createId('datepicker'),
		name,
		autocomplete,
		onchange,
		validationMessage,
		class: className = '',
	}: Props = $props();

	let open = $state(false);
	let calendarElement = $state<HTMLDivElement>();
	let inputElement = $state<HTMLInputElement>();

	// Helper to safely parse ISO date string to Date
	function parseISODate(isoString: string | undefined): Date | undefined {
		if (!isoString || typeof isoString !== 'string') return undefined;
		const date = new Date(isoString + 'T00:00:00');
		// Check for Invalid Date
		if (isNaN(date.getTime())) return undefined;
		return date;
	}

	// Convert ISO string to Date for CalendarGrid
	const selectedDate = $derived(parseISODate(value));

	// Initialize month to current date - will be synced via effect
	let month = $state(new Date());

	// Track previous value to detect external changes only
	let prevValue = $state(value);

	// Sync month ONLY when value prop changes externally (not during navigation)
	$effect(() => {
		if (value !== prevValue) {
			prevValue = value;
			const parsed = parseISODate(value);
			if (parsed) {
				month = new Date(parsed);
			}
		}
	});

	// Parse min/max to Date objects for comparison
	const minDate = $derived(parseISODate(min));
	const maxDate = $derived(parseISODate(max));

	// Format date for display (e.g., "Jan 24, 2026")
	function formatDisplayDate(isoString: string | undefined): string {
		const date = parseISODate(isoString);
		if (!date) return '';
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	const displayValue = $derived(formatDisplayDate(value));

	// Try to parse various date formats (for autofill support)
	function tryParseDate(input: string): Date | undefined {
		if (!input || typeof input !== 'string') return undefined;

		const trimmed = input.trim();
		if (!trimmed) return undefined;

		// Try ISO format first (YYYY-MM-DD)
		const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
		if (isoMatch) {
			const date = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
			if (!isNaN(date.getTime())) return date;
		}

		// Try MM/DD/YYYY or M/D/YYYY
		const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
		if (usMatch) {
			const date = new Date(parseInt(usMatch[3]), parseInt(usMatch[1]) - 1, parseInt(usMatch[2]));
			if (!isNaN(date.getTime())) return date;
		}

		// Try DD/MM/YYYY or D/M/YYYY (European)
		const euMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
		if (euMatch) {
			// Try European format (day first) - only if day > 12 to disambiguate
			const day = parseInt(euMatch[1]);
			const month = parseInt(euMatch[2]);
			if (day > 12 && month <= 12) {
				const date = new Date(parseInt(euMatch[3]), month - 1, day);
				if (!isNaN(date.getTime())) return date;
			}
		}

		// Try DD.MM.YYYY (German/European with dots)
		const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
		if (dotMatch) {
			const date = new Date(parseInt(dotMatch[3]), parseInt(dotMatch[2]) - 1, parseInt(dotMatch[1]));
			if (!isNaN(date.getTime())) return date;
		}

		// Try native Date parsing as fallback
		const nativeDate = new Date(trimmed);
		if (!isNaN(nativeDate.getTime())) return nativeDate;

		return undefined;
	}

	// Check if a date is within min/max range
	function isDateInRange(date: Date): boolean {
		const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		if (minDate && dateOnly < minDate) return false;
		if (maxDate && dateOnly > maxDate) return false;
		return true;
	}

	// Convert Date to ISO string (YYYY-MM-DD)
	function toISOString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function handleDateSelect(date: Date) {
		if (!isDateInRange(date)) return;

		value = toISOString(date);
		open = false;

		// Trigger onchange with a synthetic event
		if (onchange) {
			const event = new Event('change', { bubbles: true });
			inputElement?.dispatchEvent(event);
		}
	}

	function toggleCalendar(event: Event) {
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

		// Allow navigation keys
		if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
			event.preventDefault();
			event.stopPropagation();
			open = true;
			return;
		}

		// Allow Tab, Escape, and modifier combinations (for browser shortcuts)
		if (event.key === 'Tab' || event.key === 'Escape' || event.ctrlKey || event.metaKey) {
			return;
		}

		// Block all other typing to prevent manual entry
		event.preventDefault();
	}

	// Handle autofill - detect when browser fills in a value
	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const inputValue = input.value;

		// If input value matches display value, nothing changed (user focused/blurred)
		if (inputValue === displayValue) return;

		// Try to parse the autofilled value
		const parsed = tryParseDate(inputValue);
		if (parsed && isDateInRange(parsed)) {
			value = toISOString(parsed);
			// Trigger onchange
			if (onchange) {
				const changeEvent = new Event('change', { bubbles: true });
				inputElement?.dispatchEvent(changeEvent);
			}
		}

		// Reset input to display value (whether parse succeeded or not)
		// If parse succeeded, displayValue will update reactively
		requestAnimationFrame(() => {
			if (inputElement) {
				inputElement.value = displayValue;
			}
		});
	}

	// Focus the first cell when calendar opens
	$effect(() => {
		if (open) {
			requestAnimationFrame(() => {
				const firstCell = calendarElement?.querySelector('[role="gridcell"]') as HTMLElement;
				firstCell?.focus();
			});
		}
	});

	const hasError = $derived(error || !!validationMessage);
	const errorClasses = $derived(hasError ? 'error-state' : '');
</script>

<div class="date-picker-wrapper w-full">
	{#if label}
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
	{/if}

	<!-- Hidden input for form submission (ISO value) -->
	{#if name}
		<input type="hidden" {name} value={value ?? ''} />
	{/if}

	<Dropdown bind:open placement="bottom-start" closeOnClickOutside={true}>
		{#snippet trigger()}
			<div class="relative w-full">
				<!-- Visible input - not readonly to allow autofill -->
				<input
					bind:this={inputElement}
					type="text"
					{id}
					{disabled}
					{placeholder}
					{autocomplete}
					value={displayValue}
					onclick={handleInputClick}
					onkeydown={handleInputKeyDown}
					oninput={handleInput}
					aria-haspopup="dialog"
					aria-expanded={open}
					class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
						? disabledClasses
						: ''} {className} pr-12 cursor-pointer caret-transparent"
				/>

				<!-- Calendar icon -->
				<button
					type="button"
					tabindex={-1}
					onclick={toggleCalendar}
					{disabled}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-accent transition-colors duration-200 {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
					aria-label="Open calendar"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
					</svg>
				</button>
			</div>
		{/snippet}

		<!-- Calendar dropdown -->
		<div
			bind:this={calendarElement}
			role="dialog"
			aria-modal="true"
			aria-label="Choose date"
			class="calendar-dropdown {variant === 'glass' ? 'glass-panel' : 'panel-floating'} rounded-lg overflow-hidden"
			onclick={(e) => e.stopPropagation()}
		>
			<CalendarGrid
				bind:month={month}
				selectedDate={selectedDate}
				onDateSelect={handleDateSelect}
				highlightToday={true}
				class="calendar-picker"
			/>
		</div>
	</Dropdown>

	{#if validationMessage}
		<p class="text-error text-xs mt-1.5">{validationMessage}</p>
	{/if}
</div>

<style>
	/* Override Dropdown's inline-block to allow full width trigger */
	.date-picker-wrapper :global(.relative.inline-block) {
		display: block;
		width: 100%;
	}

	/* Also target the inner trigger wrapper */
	.date-picker-wrapper :global(.relative.inline-block > .inline-block) {
		display: block;
		width: 100%;
	}

	.calendar-dropdown {
		min-width: 320px;
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

	/* Hide text selection since manual typing is blocked */
	input[type='text']::selection {
		background: transparent;
	}
</style>
