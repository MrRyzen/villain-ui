<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
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
		oninput?: (event: Event) => void;
		iconBefore?: import('svelte').Snippet;
		iconAfter?: import('svelte').Snippet;
		validate?: (value: string | number) => boolean | string;
		validationMessage?: string;
		showValidation?: boolean;
		class?: string;
	}

	let {
		type = 'text',
		name,
		value = $bindable(''),
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('input'),
		oninput,
		iconBefore,
		iconAfter,
		validate,
		validationMessage,
		showValidation = true,
		class: className = '',
	}: Props = $props();

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

	// Validate on value change
	$effect(() => {
		if (value !== undefined && value !== '') {
			performValidation(value);
		}
	});

	const hasError = $derived(error || (validationError !== null));
	const errorClasses = $derived(hasError ? 'error-state' : '');

	function increment() {
		if (disabled || type !== 'number') return;
		value = Number(value || 0) + 1;
	}

	function decrement() {
		if (disabled || type !== 'number') return;
		value = Number(value || 0) - 1;
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
				{type}
				{name}
				{id}
				{placeholder}
				{disabled}
				bind:value
				{oninput}
				class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
				class:pr-12={iconAfter || type === 'number'}
			/>

			<!-- AFTER ICON (non-number) -->
			{#if iconAfter && type !== 'number'}
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
				{type}
				{name}
				{id}
				{placeholder}
				{disabled}
				bind:value
				{oninput}
				class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
				class:pr-12={iconAfter || type === 'number'}
			/>

			{#if iconAfter && type !== 'number'}
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
