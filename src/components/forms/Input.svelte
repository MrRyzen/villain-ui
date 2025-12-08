<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import {
		baseInputClasses,
		focusClasses,
		disabledClasses,
	} from './formClasses';

	export interface Props {
		type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
		label?: string;
		id?: string;
		oninput?: (event: Event) => void;
		iconBefore?: import('svelte').Snippet;
		iconAfter?: import('svelte').Snippet;
		class?: string;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder,
		disabled = false,
		error = false,
		label,
		id = createId('input'),
		oninput,
		iconBefore,
		iconAfter,
		class: className = '',
	}: Props = $props();

	const errorClasses = $derived(error ? 'error-state' : '');

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
					class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none"
				>
					{@render iconBefore()}
				</span>
			{/if}

			<!-- INPUT FIELD -->
			<input
				{type}
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
					class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none"
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
	</div>
{:else}
	<div class="relative flex items-center">
		{#if iconBefore}
			<span
				class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none"
			>
				{@render iconBefore()}
			</span>
		{/if}

		<input
			{type}
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
				class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none"
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
	}
</style>
