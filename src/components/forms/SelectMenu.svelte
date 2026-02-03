<script lang="ts">
	import { createId } from '../../lib/internal/id.js';
	import Dropdown from '../overlays/Dropdown.svelte';
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
		iconBefore?: import('svelte').Snippet;
		onchange?: (value: string) => void;
		validationMessage?: string;
		class?: string;
	}

	let {
		value = $bindable(),
		options,
		placeholder = 'Select an option',
		disabled = false,
		error = false,
		label,
		id = createId('selectmenu'),
		name,
		iconBefore,
		onchange,
		validationMessage,
		class: className = '',
	}: Props = $props();

	const hasError = $derived(error || !!validationMessage);

	let open = $state(false);
	let highlightedIndex = $state(-1);
	let listboxElement = $state<HTMLDivElement>();

	// Unique IDs for ARIA
	const listboxId = `${id}-listbox`;
	const getOptionId = (index: number) => `${id}-option-${index}`;

	// Find selected option for display
	const selectedOption = $derived(options.find(opt => opt.value === value));
	const displayLabel = $derived(selectedOption?.label ?? '');

	// Get index of currently selected value
	const selectedIndex = $derived(options.findIndex(opt => opt.value === value));

	function toggleDropdown(event: Event) {
		event.stopPropagation(); // Prevent Dropdown's wrapper from also toggling
		if (disabled) return;
		open = !open;
	}

	function closeDropdown() {
		open = false;
		highlightedIndex = -1;
	}

	function selectOption(optionValue: string, event?: Event) {
		event?.stopPropagation();
		value = optionValue;
		closeDropdown();
		if (onchange) {
			onchange(optionValue);
		}
	}

	function handleTriggerKeyDown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
			case 'ArrowDown':
				event.preventDefault();
				event.stopPropagation();
				open = true;
				break;
			case 'ArrowUp':
				event.preventDefault();
				event.stopPropagation();
				open = true;
				highlightedIndex = options.length - 1;
				break;
		}
	}

	function handleListboxKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				highlightedIndex = (highlightedIndex + 1) % options.length;
				scrollOptionIntoView(highlightedIndex);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlightedIndex = highlightedIndex <= 0 ? options.length - 1 : highlightedIndex - 1;
				scrollOptionIntoView(highlightedIndex);
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < options.length) {
					selectOption(options[highlightedIndex].value);
				}
				break;
			case 'Escape':
				event.preventDefault();
				closeDropdown();
				break;
			case 'Home':
				event.preventDefault();
				highlightedIndex = 0;
				scrollOptionIntoView(highlightedIndex);
				break;
			case 'End':
				event.preventDefault();
				highlightedIndex = options.length - 1;
				scrollOptionIntoView(highlightedIndex);
				break;
		}
	}

	function scrollOptionIntoView(index: number) {
		requestAnimationFrame(() => {
			const optionEl = listboxElement?.querySelector(`[data-index="${index}"]`) as HTMLElement;
			optionEl?.scrollIntoView({ block: 'nearest' });
		});
	}

	// Set highlighted index and focus listbox when dropdown opens
	$effect(() => {
		if (open) {
			highlightedIndex = selectedIndex >= 0 ? selectedIndex : 0;
			if (listboxElement) {
				requestAnimationFrame(() => listboxElement?.focus());
			}
		}
	});

	// Chevron SVG
	const chevronIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;

	const triggerClasses = $derived(`
		${baseInputClasses}
		${focusClasses}
		${hasError ? 'error-state' : ''}
		${disabled ? disabledClasses : ''}
		${iconBefore ? 'pl-12' : ''}
		${className}
		pr-12 cursor-pointer text-left flex items-center
	`.replace(/\s+/g, ' ').trim());
</script>

<div class="select-menu-wrapper w-full">
	{#if label}
		<label for={id} class="text-text-soft text-sm mb-2 block">
			{label}
		</label>
	{/if}

	<!-- Hidden input for form submission -->
	{#if name}
		<input type="hidden" {name} value={value ?? ''} />
	{/if}

	<Dropdown bind:open placement="bottom-start" closeOnClickOutside={true} fullWidth={true}>
		{#snippet trigger()}
			<div class="relative w-full">
				{#if iconBefore}
					<span class="absolute left-4 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none">
						{@render iconBefore()}
					</span>
				{/if}

				<button
					type="button"
					{id}
					{disabled}
					onclick={toggleDropdown}
					onkeydown={handleTriggerKeyDown}
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-controls={open ? listboxId : undefined}
					class={triggerClasses}
				>
					<span class={displayLabel ? 'text-text' : 'text-text-muted'}>
						{displayLabel || placeholder}
					</span>

					<span
						class="absolute right-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-200 pointer-events-none"
						class:rotate-180={open}
					>
						{@html chevronIcon}
					</span>
				</button>
			</div>
		{/snippet}

		<!-- Listbox dropdown content -->
		<div
			bind:this={listboxElement}
			id={listboxId}
			role="listbox"
			tabindex={0}
			aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
			onkeydown={handleListboxKeyDown}
			class="select-menu-listbox outline-none max-h-[280px] overflow-auto"
		>
			{#each options as option, index}
				{@const isSelected = option.value === value}
				{@const isHighlighted = index === highlightedIndex}
				<button
					type="button"
					id={getOptionId(index)}
					role="option"
					data-index={index}
					aria-selected={isSelected}
					onmouseenter={() => highlightedIndex = index}
					onclick={(e) => { e.stopPropagation(); selectOption(option.value, e); }}
					class="select-menu-option w-full px-4 py-3 text-left cursor-pointer transition-colors duration-150"
					class:option-highlighted={isHighlighted}
					class:option-selected={isSelected}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</Dropdown>

	{#if validationMessage}
		<p class="text-error text-xs mt-1.5">{validationMessage}</p>
	{/if}
</div>

<style>
	.select-menu-wrapper :global(button[aria-haspopup="listbox"]) {
		min-height: 3rem;
		width: 100%;
	}

	.select-menu-wrapper :global(button:disabled) {
		cursor: not-allowed;
	}

	.select-menu-listbox {
		outline: none;
	}

	.select-menu-option {
		color: var(--color-text);
		background: transparent;
		border: none;
		font: inherit;
	}

	.select-menu-option:hover,
	.option-highlighted {
		background-color: var(--color-accent-overlay-20);
	}

	.option-selected {
		background-color: var(--color-accent-overlay-30);
		color: var(--color-accent-soft);
	}

	.option-selected.option-highlighted {
		background-color: var(--color-accent-overlay-40);
	}
</style>
