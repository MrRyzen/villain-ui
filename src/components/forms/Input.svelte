<script lang="ts">
	import { createId } from '../../lib/internal/id';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';

	export interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'color' | 'search';
		name?: string;
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		label?: string;
		id?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		oninput?: (event: Event) => void;
		iconBefore?: import('svelte').Snippet;
		iconAfter?: import('svelte').Snippet;
		validate?: (value: string | number) => boolean | string;
		validationMessage?: string;
		showValidation?: boolean;
		/** Password inputs only: show an eye toggle to reveal the value. Replaces iconAfter. */
		revealable?: boolean;
		/** Number inputs only: lower bound enforced by the stepper arrows. */
		min?: number;
		/** Number inputs only: upper bound enforced by the stepper arrows. */
		max?: number;
		/** Number inputs only: stepper arrow increment. @default 1 */
		step?: number;
		class?: string;
	}

	let {
		type = 'text',
		name,
		value = $bindable(),
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('input'),
		autocomplete,
		oninput,
		iconBefore,
		iconAfter,
		validate,
		validationMessage,
		showValidation = true,
		revealable = false,
		min,
		max,
		step = 1,
		class: className = '',
	}: Props = $props();

	// Password reveal toggle (revealable only applies to type="password")
	let revealed = $state(false);
	const showReveal = $derived(revealable && type === 'password');
	const effectiveType = $derived(showReveal && revealed ? 'text' : type);

	// Built-in validation patterns
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
	const telPattern = /^[\d\s\-\+\(\)]+$/;

	// Validation logic
	let validationError = $state<string | null>(null);

	function performValidation(val: string | number): boolean {
		if (!val || val === '') {
			validationError = null;
			return true;
		}

		// Custom validation function
		if (validate) {
			const result = validate(val);
			if (result === true) {
				validationError = null;
				return true;
			} else if (typeof result === 'string') {
				validationError = result;
				return false;
			} else {
				validationError = validationMessage || 'Invalid input';
				return false;
			}
		}

		// Built-in validation based on type
		const stringVal = String(val);
		switch (type) {
			case 'email':
				if (!emailPattern.test(stringVal)) {
					validationError = validationMessage || 'Please enter a valid email address';
					return false;
				}
				break;
			case 'url':
				if (!urlPattern.test(stringVal)) {
					validationError = validationMessage || 'Please enter a valid URL';
					return false;
				}
				break;
			case 'tel':
				if (!telPattern.test(stringVal)) {
					validationError = validationMessage || 'Please enter a valid phone number';
					return false;
				}
				break;
		}

		validationError = null;
		return true;
	}

	// Validate on value change (only when no external validation message is provided)
	$effect(() => {
		if (validationMessage !== undefined) {
			// External validation takes precedence
			validationError = validationMessage || null;
		} else if (value !== undefined && value !== '') {
			performValidation(value);
		}
	});

	const hasError = $derived(error || (validationError !== null));
	const errorClasses = $derived(hasError ? 'error-state' : '');

	function clamp(n: number): number {
		if (min !== undefined && n < min) return min;
		if (max !== undefined && n > max) return max;
		return n;
	}

	function increment() {
		if (disabled || type !== 'number') return;
		value = clamp(Number(value || 0) + step);
	}

	function decrement() {
		if (disabled || type !== 'number') return;
		value = clamp(Number(value || 0) - step);
	}
</script>

{#if label}
	<div>
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
		<div class="relative flex items-center">
			<!-- BEFORE ICON -->
			{#if iconBefore}
				<span
					class="absolute left-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<!-- INPUT FIELD -->
			<input
				type={effectiveType}
				{name}
				{id}
				{placeholder}
				{disabled}
				{autocomplete}
				min={type === 'number' ? min : undefined}
				max={type === 'number' ? max : undefined}
				step={type === 'number' ? step : undefined}
				bind:value
				{oninput}
				class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
				class:pr-12={iconAfter || showReveal || type === 'number'}
			/>

			<!-- AFTER ICON (non-number) -->
			{#if showReveal}
				<button
					type="button"
					onclick={() => (revealed = !revealed)}
					class="absolute right-4 z-10 inline-flex cursor-pointer items-center justify-center text-text-soft transition-colors hover:text-[var(--color-text)]"
					aria-label={revealed ? 'Hide password' : 'Show password'}
					aria-pressed={revealed}
				>
					{#if revealed}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
					{:else}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					{/if}
				</button>
			{:else if iconAfter && type !== 'number'}
				<span
					class="absolute right-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconAfter()}
				</span>
			{/if}

			<!-- CUSTOM ARROWS (NUMBER INPUT ONLY) -->
			{#if type === 'number'}
				<div class="number-arrows">
					<button
						type="button"
						onclick={increment}
						class="arrow-btn arrow-up"
						tabindex="-1"
					>
						▲
					</button>
					<button
						type="button"
						onclick={decrement}
						class="arrow-btn arrow-down"
						tabindex="-1"
					>
						▼
					</button>
				</div>
			{/if}
		</div>
		{#if showValidation && validationError}
			<p class="text-error text-xs mt-1.5">
				{validationError}
			</p>
		{/if}
	</div>
{:else}
	<div>
		<div class="relative flex items-center">
			{#if iconBefore}
				<span
					class="absolute left-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<input
				type={effectiveType}
				{name}
				{id}
				{placeholder}
				{disabled}
				{autocomplete}
				min={type === 'number' ? min : undefined}
				max={type === 'number' ? max : undefined}
				step={type === 'number' ? step : undefined}
				bind:value
				{oninput}
				class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
				class:pr-12={iconAfter || showReveal || type === 'number'}
			/>

			{#if showReveal}
				<button
					type="button"
					onclick={() => (revealed = !revealed)}
					class="absolute right-4 z-10 inline-flex cursor-pointer items-center justify-center text-text-soft transition-colors hover:text-[var(--color-text)]"
					aria-label={revealed ? 'Hide password' : 'Show password'}
					aria-pressed={revealed}
				>
					{#if revealed}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
							/>
						</svg>
					{:else}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
					{/if}
				</button>
			{:else if iconAfter && type !== 'number'}
				<span
					class="absolute right-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconAfter()}
				</span>
			{/if}

			{#if type === 'number'}
				<div class="number-arrows">
					<button
						type="button"
						onclick={increment}
						class="arrow-btn arrow-up"
						tabindex="-1"
					>
						▲
					</button>
					<button
						type="button"
						onclick={decrement}
						class="arrow-btn arrow-down"
						tabindex="-1"
					>
						▼
					</button>
				</div>
			{/if}
		</div>
		{#if showValidation && validationError}
			<p class="text-error text-xs mt-1.5">
				{validationError}
			</p>
		{/if}
	</div>
{/if}

<style>
	.number-arrows {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 2.25rem; /* doesn't overlap your icons */
		display: flex;
		flex-direction: column;
		border-left: 1px solid var(--color-border-strong);
		background: color-mix(in srgb, var(--color-accent) 8%, transparent);
		border-radius: 0 var(--radius-md) var(--radius-md) 0;
		overflow: hidden;
	}

	.arrow-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		color: var(--color-text-soft);
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 120ms var(--ease-sharp);
		user-select: none;
	}

	.arrow-btn:hover {
		background: var(--color-accent-overlay-20);
		color: var(--color-accent-soft);
	}

	.arrow-btn:active {
		background: var(--color-accent-overlay-30);
		color: var(--color-accent);
	}

	.arrow-btn:disabled,
	.arrow-btn[disabled] {
		opacity: 0.4;
		cursor: not-allowed;
	}

	/* Remove default browser arrows */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* Color input styling */
	input[type='color'] {
		width: 60px;
		min-width: 60px;
		min-height: 3rem;
		padding: 0.375rem;
		cursor: pointer;
	}

	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}

	input[type='color']::-webkit-color-swatch {
		border: 1px solid var(--color-border-strong);
		border-radius: calc(var(--radius-md) - 2px);
	}

	input[type='color']::-moz-color-swatch {
		border: 1px solid var(--color-border-strong);
		border-radius: calc(var(--radius-md) - 2px);
	}
</style>
