<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';

	export interface Props {
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
		onchange?: (event: Event) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		min,
		max,
		step,
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('datetimepicker'),
		name,
		onchange,
		class: className = '',
	}: Props = $props();

	const errorClasses = $derived(error ? 'error-state' : '');
</script>

{#if label}
	<div>
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
		<input
			type="datetime-local"
			{id}
			name={name}
			{placeholder}
			{disabled}
			{min}
			{max}
			{step}
			bind:value
			{onchange}
			class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
				? disabledClasses
				: ''} {className}"
		/>
	</div>
{:else}
	<input
		type="datetime-local"
		{id}
		name={name}
		{placeholder}
		{disabled}
		{min}
		{max}
		{step}
		bind:value
		{onchange}
		class="{baseInputClasses} {focusClasses} {errorClasses} {disabled
			? disabledClasses
			: ''} {className}"
	/>
{/if}

<style>
	input[type='datetime-local'] {
		min-height: 3rem;
		cursor: pointer;
	}

	input[type='datetime-local']::-webkit-calendar-picker-indicator {
		cursor: pointer;
		filter: invert(0.7);
		transition: filter 120ms var(--ease-sharp);
	}

	input[type='datetime-local']:hover::-webkit-calendar-picker-indicator {
		filter: invert(1);
	}

	input[type='datetime-local']:disabled::-webkit-calendar-picker-indicator {
		cursor: not-allowed;
		opacity: 0.4;
	}
</style>
