<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  export interface Props {
    checked?: boolean;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    name?: string;
    onchange?: (event: Event) => void;
    iconBefore?: import('svelte').Snippet;
    validationMessage?: string;
    class?: string;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    error = false,
    label,
    id = createId('switch'),
    name,
    onchange,
    iconBefore,
    validationMessage,
    class: className = ''
  }: Props = $props();

  const hasError = $derived(error || !!validationMessage);
</script>

<div>
  <label for={id} class="flex items-center gap-2 cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''} {className}">
    <input
      type="checkbox"
      role="switch"
      aria-checked={checked}
      {id}
      name={name}
      {disabled}
      bind:checked
      onchange={onchange}
      class="w-14 h-7 rounded-pill bg-base-3 border appearance-none transition-all duration-300 ease-luxe cursor-pointer checked:bg-accent checked:accent-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base-1 relative {hasError ? 'border-error' : 'border-border'} {disabled ? 'cursor-not-allowed' : ''}"
    />
    {#if iconBefore}
      <span class="inline-flex items-center justify-center text-text-soft">
        {@render iconBefore()}
      </span>
    {/if}
    {#if label}
      <span class="text-text text-sm select-none">
        {label}
      </span>
    {/if}
  </label>
  {#if validationMessage}
    <p class="text-error text-xs mt-1.5 ml-16">{validationMessage}</p>
  {/if}
</div>

<style>
  input[type="checkbox"]::after {
    content: '';
    position: absolute;
    left: 0.375rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--radius-pill);
    background: var(--color-text);
    background-image: none;
    transition: all 0.3s var(--ease-luxe);
  }

  input[type="checkbox"]:checked::after {
    transform: translate(1.75rem, -50%);
    background-image: none;
  }
</style>
