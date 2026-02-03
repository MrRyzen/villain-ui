<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';
	import TimePickerGrid from './TimePickerGrid.svelte';
	import Dropdown from '../overlays/Dropdown.svelte';

	export interface Props {
		variant?: 'glass' | 'floating';
		value?: string;
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
		validationMessage?: string;
		class?: string;
	}

	let {
		variant = 'glass',
		value = $bindable(),
		min,
		max,
		step = 60,
		placeholder = 'Select time',
		disabled = false,
		error = false,
		label,
		id = createId('timepicker'),
		name,
		autocomplete,
		is24Hour = true,
		onchange,
		validationMessage,
		class: className = '',
	}: Props = $props();

	let open = $state(false);
	let pickerElement = $state<HTMLDivElement>();
	let inputElement = $state<HTMLInputElement>();

	// Parse ISO time string (HH:mm or HH:mm:ss) to hours and minutes
	function parseTime(timeStr: string | undefined): { hours: number; minutes: number } | null {
		if (!timeStr || typeof timeStr !== 'string') return null;
		const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
		if (!match) return null;
		const hours = parseInt(match[1], 10);
		const minutes = parseInt(match[2], 10);
		if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
		return { hours, minutes };
	}

	// Get current hours and minutes from value
	const currentTime = $derived(parseTime(value));
	let selectedHours = $state(currentTime?.hours ?? 0);
	let selectedMinutes = $state(currentTime?.minutes ?? 0);

	// Sync selection when value changes externally
	$effect(() => {
		const parsed = parseTime(value);
		if (parsed) {
			selectedHours = parsed.hours;
			selectedMinutes = parsed.minutes;
		}
	});

	// Format time for display
	function formatDisplayTime(timeStr: string | undefined): string {
		const parsed = parseTime(timeStr);
		if (!parsed) return '';

		const { hours, minutes } = parsed;

		if (is24Hour) {
			return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
		} else {
			const period = hours >= 12 ? 'PM' : 'AM';
			const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
			return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
		}
	}

	// Format time to ISO string (HH:mm)
	function toISOTime(hours: number, minutes: number): string {
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
	}

	const displayValue = $derived(formatDisplayTime(value));

	function handleTimeSelect(hours: number, minutes: number) {
		value = toISOTime(hours, minutes);
		open = false;

		// Trigger onchange with a synthetic event
		if (onchange) {
			const event = new Event('change', { bubbles: true });
			inputElement?.dispatchEvent(event);
		}

		// Return focus to input
		inputElement?.focus();
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

		// Open picker on Enter, Space, or ArrowDown
		if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
			event.preventDefault();
			event.stopPropagation();
			open = true;
			return;
		}

		// Allow Tab and modifier combinations
		if (event.key === 'Tab' || event.ctrlKey || event.metaKey) {
			return;
		}

		// Allow Escape to close
		if (event.key === 'Escape') {
			if (open) {
				event.preventDefault();
				open = false;
			}
			return;
		}

		// Block all other typing to prevent manual entry
		event.preventDefault();
	}

	// Focus the first focusable element when picker opens
	$effect(() => {
		if (open) {
			requestAnimationFrame(() => {
				const firstButton = pickerElement?.querySelector('button:not(:disabled)') as HTMLElement;
				firstButton?.focus();
			});
		}
	});

	const hasError = $derived(error || !!validationMessage);
	const errorClasses = $derived(hasError ? 'error-state' : '');
</script>

<div class="time-picker-wrapper w-full">
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
				<!-- Visible input - readonly to prevent manual entry -->
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

				<!-- Clock icon -->
				<button
					type="button"
					tabindex={-1}
					onclick={togglePicker}
					{disabled}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-accent transition-colors duration-200 {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
					aria-label="Open time picker"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
				</button>
			</div>
		{/snippet}

		<!-- Time picker dropdown -->
		<div
			bind:this={pickerElement}
			role="dialog"
			aria-modal="true"
			aria-label="Choose time"
			class="time-picker-dropdown {variant === 'glass' ? 'glass-panel' : 'panel-floating'} rounded-lg overflow-hidden"
		>
			<TimePickerGrid
				bind:hours={selectedHours}
				bind:minutes={selectedMinutes}
				{is24Hour}
				{step}
				minTime={min}
				maxTime={max}
				onTimeSelect={handleTimeSelect}
			/>
		</div>
	</Dropdown>

	{#if validationMessage}
		<p class="text-error text-xs mt-1.5">{validationMessage}</p>
	{/if}
</div>

<style>
	/* Override Dropdown's inline-block to allow full width trigger */
	.time-picker-wrapper :global(.relative.inline-block) {
		display: block;
		width: 100%;
	}

	/* Also target the inner trigger wrapper */
	.time-picker-wrapper :global(.relative.inline-block > .inline-block) {
		display: block;
		width: 100%;
	}

	.time-picker-dropdown {
		min-width: 280px;
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
