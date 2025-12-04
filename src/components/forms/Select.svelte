<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    value?: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    onchange?: (event: Event) => void;
    icon?: import('svelte').Snippet;
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
    icon
  }: Props = $props();

  const chevronIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%23ADADAD' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
  
  // Icon spacing: pl-12 (3rem) = left-4 (1rem) icon position + ~2rem for icon width and spacing
  // This ensures text doesn't overlap with the absolutely positioned icon
  const baseClasses = `glass-panel rounded-[var(--radius-lg)] px-5 py-3.5 pr-12 font-body text-text transition-all duration-300 ease-luxe w-full appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px]`;
  const focusClasses = 'focus:outline-none focus:border-accent focus:accent-glow';
  const errorClasses = error ? 'border-error' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
</script>

{#if label}
  <div>
    <label for={id} class="text-text-soft text-sm mb-2 block">
      {label}
    </label>
    <div class="relative">
      {#if icon}
        <span class="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render icon()}
        </span>
      {/if}
      <select
        {id}
        {disabled}
        bind:value
        onchange={onchange}
        class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
        class:pl-12={icon}
        style={`background-image: url('${chevronIcon}')`}
      >
        {#if placeholder}
          <option disabled value="">{placeholder}</option>
        {/if}
        {#each options as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>
{:else}
  <div class="relative">
    {#if icon}
      <span class="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render icon()}
      </span>
    {/if}
    <select
      {id}
      {disabled}
      bind:value
      onchange={onchange}
      class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
      class:pl-12={icon}
      style={`background-image: url('${chevronIcon}')`}
    >
      {#if placeholder}
        <option disabled value="">{placeholder}</option>
      {/if}
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
{/if}
