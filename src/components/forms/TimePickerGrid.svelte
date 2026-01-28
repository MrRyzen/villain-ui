<script lang="ts">
	interface Props {
		hours?: number;
		minutes?: number;
		is24Hour?: boolean;
		step?: number; // Step in seconds for minute increments
		minTime?: string; // HH:mm or HH:mm:ss
		maxTime?: string; // HH:mm or HH:mm:ss
		onTimeSelect?: (hours: number, minutes: number) => void;
		class?: string;
	}

	let {
		hours = $bindable(0),
		minutes = $bindable(0),
		is24Hour = true,
		step = 60, // Default 1 minute step
		minTime,
		maxTime,
		onTimeSelect,
		class: className = ''
	}: Props = $props();

	// Track AM/PM for 12-hour mode
	let isPM = $state(hours >= 12);

	// Sync isPM when hours change externally
	$effect(() => {
		isPM = hours >= 12;
	});

	// Parse time string to hours and minutes
	function parseTime(timeStr: string | undefined): { hours: number; minutes: number } | null {
		if (!timeStr) return null;
		const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
		if (!match) return null;
		return {
			hours: parseInt(match[1], 10),
			minutes: parseInt(match[2], 10)
		};
	}

	const minTimeObj = $derived(parseTime(minTime));
	const maxTimeObj = $derived(parseTime(maxTime));

	// Get minute increment based on step (step is in seconds)
	const minuteIncrement = $derived(Math.max(1, Math.floor(step / 60)));

	// Generate hour options
	const hourOptions = $derived.by(() => {
		const options: number[] = [];
		if (is24Hour) {
			for (let h = 0; h < 24; h++) {
				options.push(h);
			}
		} else {
			for (let h = 1; h <= 12; h++) {
				options.push(h);
			}
		}
		return options;
	});

	// Generate minute options based on step
	const minuteOptions = $derived.by(() => {
		const options: number[] = [];
		for (let m = 0; m < 60; m += minuteIncrement) {
			options.push(m);
		}
		return options;
	});

	// Check if a specific time is within min/max range
	function isTimeInRange(h: number, m: number): boolean {
		const totalMinutes = h * 60 + m;

		if (minTimeObj) {
			const minTotal = minTimeObj.hours * 60 + minTimeObj.minutes;
			if (totalMinutes < minTotal) return false;
		}

		if (maxTimeObj) {
			const maxTotal = maxTimeObj.hours * 60 + maxTimeObj.minutes;
			if (totalMinutes > maxTotal) return false;
		}

		return true;
	}

	// Check if any time with this hour is valid
	function isHourValid(h: number): boolean {
		// Check if any minute value makes this hour valid
		for (const m of minuteOptions) {
			if (isTimeInRange(h, m)) return true;
		}
		return false;
	}

	// Check if this minute is valid for current hour
	function isMinuteValid(m: number): boolean {
		return isTimeInRange(hours, m);
	}

	// Convert display hour (1-12) to 24-hour format
	function displayTo24Hour(displayHour: number, pm: boolean): number {
		if (is24Hour) return displayHour;

		if (displayHour === 12) {
			return pm ? 12 : 0;
		}
		return pm ? displayHour + 12 : displayHour;
	}

	// Convert 24-hour to display hour (1-12)
	function hourToDisplay(h: number): number {
		if (is24Hour) return h;

		if (h === 0) return 12;
		if (h > 12) return h - 12;
		return h;
	}

	// Get display hour for current selection
	const displayHour = $derived(hourToDisplay(hours));

	function handleHourSelect(displayHour: number) {
		const newHours = displayTo24Hour(displayHour, isPM);
		if (!isHourValid(newHours)) return;

		hours = newHours;

		// If current minutes are no longer valid, find nearest valid minute
		if (!isTimeInRange(hours, minutes)) {
			const validMinute = minuteOptions.find(m => isTimeInRange(hours, m));
			if (validMinute !== undefined) {
				minutes = validMinute;
			}
		}
	}

	function handleMinuteSelect(m: number) {
		if (!isMinuteValid(m)) return;
		minutes = m;
	}

	function handleAMPMToggle(pm: boolean) {
		isPM = pm;
		const newHours = displayTo24Hour(displayHour, isPM);

		if (isHourValid(newHours)) {
			hours = newHours;

			// Validate minutes too
			if (!isTimeInRange(hours, minutes)) {
				const validMinute = minuteOptions.find(m => isTimeInRange(hours, m));
				if (validMinute !== undefined) {
					minutes = validMinute;
				}
			}
		}
	}

	function handleConfirm() {
		if (isTimeInRange(hours, minutes)) {
			onTimeSelect?.(hours, minutes);
		}
	}

	// Element refs for scrolling
	let hourListElement = $state<HTMLDivElement>();
	let minuteListElement = $state<HTMLDivElement>();
	let ampmListElement = $state<HTMLDivElement>();

	// Focus a button in a specific column
	function focusInColumn(column: 'hours' | 'minutes' | 'ampm') {
		let listEl: HTMLDivElement | undefined;
		if (column === 'hours') listEl = hourListElement;
		else if (column === 'minutes') listEl = minuteListElement;
		else listEl = ampmListElement;

		const selected = listEl?.querySelector('[data-selected="true"]') as HTMLButtonElement;
		const firstEnabled = listEl?.querySelector('button:not(:disabled)') as HTMLButtonElement;
		(selected || firstEnabled)?.focus();
	}

	// Handle keyboard navigation for hour buttons
	function handleHourKeyDown(event: KeyboardEvent, h: number) {
		const idx = hourOptions.indexOf(h);

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (idx > 0) {
				handleHourSelect(hourOptions[idx - 1]);
				requestAnimationFrame(() => focusInColumn('hours'));
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (idx < hourOptions.length - 1) {
				handleHourSelect(hourOptions[idx + 1]);
				requestAnimationFrame(() => focusInColumn('hours'));
			}
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			focusInColumn('minutes');
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleConfirm();
		}
	}

	// Handle keyboard navigation for minute buttons
	function handleMinuteKeyDown(event: KeyboardEvent, m: number) {
		const idx = minuteOptions.indexOf(m);

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (idx > 0) {
				handleMinuteSelect(minuteOptions[idx - 1]);
				requestAnimationFrame(() => focusInColumn('minutes'));
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (idx < minuteOptions.length - 1) {
				handleMinuteSelect(minuteOptions[idx + 1]);
				requestAnimationFrame(() => focusInColumn('minutes'));
			}
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusInColumn('hours');
		} else if (event.key === 'ArrowRight' && !is24Hour) {
			event.preventDefault();
			focusInColumn('ampm');
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleConfirm();
		}
	}

	// Handle keyboard navigation for AM/PM buttons
	function handleAMPMKeyDown(event: KeyboardEvent, pm: boolean) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			handleAMPMToggle(!pm);
			requestAnimationFrame(() => focusInColumn('ampm'));
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusInColumn('minutes');
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleConfirm();
		}
	}

	// Scroll selected items into view when picker opens
	$effect(() => {
		if (hourListElement) {
			const selectedHour = hourListElement.querySelector('[data-selected="true"]');
			if (selectedHour) {
				selectedHour.scrollIntoView({ block: 'center', behavior: 'instant' });
			}
		}
	});

	$effect(() => {
		if (minuteListElement) {
			const selectedMinute = minuteListElement.querySelector('[data-selected="true"]');
			if (selectedMinute) {
				selectedMinute.scrollIntoView({ block: 'center', behavior: 'instant' });
			}
		}
	});
</script>

<div
	class="time-picker-grid {className}"
	role="group"
	aria-label="Time picker"
>
	<div class="time-columns">
		<!-- Hours column -->
		<div class="time-column" role="listbox" aria-label="Hours">
			<div class="column-header">Hour</div>
			<div bind:this={hourListElement} class="column-list">
				{#each hourOptions as h}
					{@const actualHour = displayTo24Hour(h, isPM)}
					{@const isValid = isHourValid(actualHour)}
					{@const isSelected = displayHour === h}
					<button
						type="button"
						role="option"
						class="time-option"
						class:selected={isSelected}
						class:disabled={!isValid}
						data-selected={isSelected}
						aria-selected={isSelected}
						aria-disabled={!isValid}
						disabled={!isValid}
						onclick={() => handleHourSelect(h)}
						onkeydown={(e) => handleHourKeyDown(e, h)}
						tabindex={isSelected ? 0 : -1}
					>
						{is24Hour ? String(h).padStart(2, '0') : h}
					</button>
				{/each}
			</div>
		</div>

		<!-- Minutes column -->
		<div class="time-column" role="listbox" aria-label="Minutes">
			<div class="column-header">Min</div>
			<div bind:this={minuteListElement} class="column-list">
				{#each minuteOptions as m}
					{@const isValid = isMinuteValid(m)}
					{@const isSelected = minutes === m}
					<button
						type="button"
						role="option"
						class="time-option"
						class:selected={isSelected}
						class:disabled={!isValid}
						data-selected={isSelected}
						aria-selected={isSelected}
						aria-disabled={!isValid}
						disabled={!isValid}
						onclick={() => handleMinuteSelect(m)}
						onkeydown={(e) => handleMinuteKeyDown(e, m)}
						tabindex={isSelected ? 0 : -1}
					>
						{String(m).padStart(2, '0')}
					</button>
				{/each}
			</div>
		</div>

		<!-- AM/PM toggle (12-hour mode only) -->
		{#if !is24Hour}
			<div class="time-column ampm-column" role="listbox" aria-label="AM/PM">
				<div class="column-header">Period</div>
				<div bind:this={ampmListElement} class="column-list ampm-list">
					<button
						type="button"
						role="option"
						class="time-option ampm-option"
						class:selected={!isPM}
						aria-selected={!isPM}
						onclick={() => handleAMPMToggle(false)}
						onkeydown={(e) => handleAMPMKeyDown(e, false)}
						tabindex={!isPM ? 0 : -1}
					>
						AM
					</button>
					<button
						type="button"
						role="option"
						class="time-option ampm-option"
						class:selected={isPM}
						aria-selected={isPM}
						onclick={() => handleAMPMToggle(true)}
						onkeydown={(e) => handleAMPMKeyDown(e, true)}
						tabindex={isPM ? 0 : -1}
					>
						PM
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Confirm button -->
	<div class="time-actions">
		<button
			type="button"
			class="confirm-button"
			onclick={handleConfirm}
			disabled={!isTimeInRange(hours, minutes)}
		>
			Select
		</button>
	</div>
</div>

<style>
	.time-picker-grid {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-family: var(--font-body);
		color: var(--color-text);
	}

	.time-columns {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem;
	}

	.time-column {
		flex: 1;
		min-width: 4rem;
	}

	.ampm-column {
		min-width: 3rem;
		flex: 0.6;
	}

	.column-header {
		text-align: center;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-soft);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.5rem;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: 0.5rem;
	}

	.column-list {
		max-height: 12rem;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		scrollbar-width: thin;
		scrollbar-color: var(--color-base-3) transparent;
	}

	.column-list::-webkit-scrollbar {
		width: 6px;
	}

	.column-list::-webkit-scrollbar-track {
		background: transparent;
	}

	.column-list::-webkit-scrollbar-thumb {
		background: var(--color-base-3);
		border-radius: 3px;
	}

	.ampm-list {
		max-height: none;
		overflow: visible;
	}

	.time-option {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.625rem 0.5rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		color: var(--color-text);
		font-size: 0.9375rem;
		font-weight: 500;
		font-family: var(--font-mono);
		cursor: pointer;
		transition: all var(--duration-150) var(--ease-sharp);
	}

	.time-option:hover:not(:disabled) {
		background: var(--color-base-2);
		border-color: var(--color-border);
	}

	.time-option:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		z-index: 1;
	}

	.time-option.selected {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: var(--color-base-0);
		font-weight: 700;
		box-shadow: 0 0 12px var(--color-accent-glow);
	}

	.time-option.disabled,
	.time-option:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.ampm-option {
		font-family: var(--font-body);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.time-actions {
		display: flex;
		padding: 0.75rem;
		border-top: 1px solid var(--color-border);
	}

	.confirm-button {
		flex: 1;
		padding: 0.75rem 1rem;
		background: var(--color-accent);
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-base-0);
		font-size: 0.875rem;
		font-weight: 600;
		font-family: var(--font-body);
		cursor: pointer;
		transition: all var(--duration-200) var(--ease-sharp);
	}

	.confirm-button:hover:not(:disabled) {
		background: var(--color-accent-hover);
		box-shadow: 0 0 20px var(--color-accent-glow);
		transform: translateY(-1px);
	}

	.confirm-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.confirm-button:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.confirm-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.time-option,
		.confirm-button {
			transition: none;
		}

		.confirm-button:hover:not(:disabled) {
			transform: none;
		}
	}
</style>
