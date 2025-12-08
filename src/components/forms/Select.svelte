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
		onchange?: (event: Event) => void;
		iconBefore?: import('svelte').Snippet;
		class?: string;
	}

	let {
		value = $bindable(''),
		options,
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('select'),
		onchange,
		iconBefore,
		class: className = '',
	}: Props = $props();

	const chevronIcon =
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23A855F7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

	const selectClasses = `${baseInputClasses} pr-12 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:16px] cursor-pointer`;

	const errorClasses = $derived(error ? 'error-state' : '');
</script>

{#if label}
	<div>
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
		<div class="relative">
			{#if iconBefore}
				<span
					class="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<select
				{id}
				{disabled}
				bind:value
				{onchange}
				class="{selectClasses} {focusClasses} {errorClasses} {disabled
					? disabledClasses
					: ''} {className}"
				class:pl-12={iconBefore}
				style={`background-image: url('${chevronIcon}')`}
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
	</div>
{:else}
	<div class="relative">
		{#if iconBefore}
			<span
				class="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-text-soft pointer-events-none"
			>
				{@render iconBefore()}
			</span>
		{/if}

		<select
			{id}
			{disabled}
			bind:value
			{onchange}
			class="{selectClasses} {focusClasses} {errorClasses} {disabled
				? disabledClasses
				: ''} {className}"
			class:pl-12={iconBefore}
			style={`background-image: url('${chevronIcon}')`}
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
{/if}

<style>
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
