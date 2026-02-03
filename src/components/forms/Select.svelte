<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';

	export interface Props {
		value?: string;
		options: Array<{ value: string; label: string }>;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		label?: string;
		id?: string;
		name?: string;
		autocomplete?: HTMLSelectElement['autocomplete'];
		onchange?: (event: Event) => void;
		iconBefore?: import('svelte').Snippet;
		validationMessage?: string;
		class?: string;
	}

	let {
		value = $bindable(),
		options,
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('select'),
		name,
		autocomplete,
		onchange,
		iconBefore,
		validationMessage,
		class: className = '',
	}: Props = $props();

	const selectClasses = `${baseInputClasses} pr-12 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:16px] cursor-pointer select-with-chevron`;

	const hasError = $derived(error || !!validationMessage);
	const errorClasses = $derived(hasError ? 'error-state' : '');
</script>

{#if label}
	<div>
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
		<div class="relative">
			{#if iconBefore}
				<span
					class="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<select
				{id}
				name={name}
				{disabled}
				{autocomplete}
				bind:value
				{onchange}
				class="{selectClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
			>
				{#if placeholder}
					<option disabled value="" aria-hidden="true" hidden
						>{placeholder}</option
					>
				{/if}

				{#each options as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
		{#if validationMessage}
			<p class="text-error text-xs mt-1.5">{validationMessage}</p>
		{/if}
	</div>
{:else}
	<div>
		<div class="relative">
			{#if iconBefore}
				<span
					class="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<select
				{id}
				name={name}
				{disabled}
				{autocomplete}
				bind:value
				{onchange}
				class="{selectClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
			>
				{#if placeholder}
					<option disabled value="" aria-hidden="true" hidden
						>{placeholder}</option
					>
				{/if}

				{#each options as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
		{#if validationMessage}
			<p class="text-error text-xs mt-1.5">{validationMessage}</p>
		{/if}
	</div>
{/if}

<style>
	/* Chevron styling using background-image with accent color via CSS filter */
	.select-with-chevron {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%239b87f5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 16px;
	}

	.select-with-chevron:disabled {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
	}

	/* Force dark dropdown (Firefox + Chromium) */
	select {
		color-scheme: var(--color-base-0);
	}

	/* Option styling */
	select option {
		background-color: var(--color-base-2);
		color: var(--color-text);
		padding: 0.5rem;
	}

	select option:hover {
    background-color: var(--color-accent-overlay-50);
    color: var(--color-text);
	}
	select option:focus,
	select option:checked {
		background-color: var(--color-accent);
		color: var(--color-text);
	}

	select option:disabled {
		color: var(--color-text-muted);
		opacity: 0.5;
	}
</style>
