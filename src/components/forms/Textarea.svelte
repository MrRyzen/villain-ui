<script lang="ts">
  import { createId } from '../../lib/internal/id.js';
  import { baseInputClasses, focusClasses, disabledClasses } from './formClasses';

  export interface Props {
    value?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    name?: string;
    autocomplete?: HTMLTextAreaElement['autocomplete'];
    oninput?: (event: Event) => void;
    iconBefore?: import('svelte').Snippet;
    validationMessage?: string;
    class?: string;
  }

  let {
    value = $bindable(),
    placeholder,
    rows = 4,
    disabled = false,
    error = false,
    label,
    id = createId('textarea'),
    name,
    autocomplete,
    oninput,
    iconBefore,
    validationMessage,
    class: className = ''
  }: Props = $props();

  const hasError = $derived(error || !!validationMessage);

  // Icon spacing: pl-12 (3rem) = left-4 (1rem) icon position + ~2rem for icon width and spacing
  // top-4 keeps icon fixed at top when textarea is resized
  // This ensures text doesn't overlap with the absolutely positioned icon
  const textareaClasses = `${baseInputClasses} resize-y min-h-[100px]`;
  const errorClasses = $derived(hasError ? 'error-state' : '');
</script>

{#if label}
  <div>
    <label for={id} class="text-text-soft text-sm mb-2 block">
      {label}
    </label>
    <div class="relative">
      {#if iconBefore}
        <span class="absolute left-4 top-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render iconBefore()}
        </span>
      {/if}
      <textarea
        {id}
        name={name}
        {placeholder}
        {disabled}
        {rows}
        {autocomplete}
        bind:value
        oninput={oninput}
        class="{textareaClasses} {focusClasses} {errorClasses} {disabled ? disabledClasses : ''} {className}"
        class:pl-12={iconBefore}
      ></textarea>
    </div>
    {#if validationMessage}
      <p class="text-error text-xs mt-1.5">{validationMessage}</p>
    {/if}
  </div>
{:else}
  <div>
    <div class="relative">
      {#if iconBefore}
        <span class="absolute left-4 top-4 z-10 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render iconBefore()}
        </span>
      {/if}
      <textarea
        {id}
        name={name}
        {placeholder}
        {disabled}
        {rows}
        {autocomplete}
        bind:value
        oninput={oninput}
        class="{textareaClasses} {focusClasses} {errorClasses} {disabled ? disabledClasses : ''} {className}"
        class:pl-12={iconBefore}
      ></textarea>
    </div>
    {#if validationMessage}
      <p class="text-error text-xs mt-1.5">{validationMessage}</p>
    {/if}
  </div>
{/if}
