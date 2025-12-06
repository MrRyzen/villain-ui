<script lang="ts">
  import { createId } from '../../lib/internal/id.js';
  import { baseInputClasses, focusClasses, disabledClasses } from './formClasses';

  export interface Props {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value?: string;
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
    class: className = ''
  }: Props = $props();

  const errorClasses = error ? 'border-error' : '';
</script>

{#if label}
  <div>
    <label for={id} class="text-text-soft text-sm mb-2 block">
      {label}
    </label>
    <div class="relative flex items-center">
      {#if iconBefore}
        <span class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render iconBefore()}
        </span>
      {/if}
      <input
        {type}
        {id}
        {placeholder}
        {disabled}
        bind:value
        oninput={oninput}
        class="{baseInputClasses} {focusClasses} {errorClasses} {disabled ? disabledClasses : ''} {className}"
        class:pl-12={iconBefore}
        class:pr-12={iconAfter}
      />
      {#if iconAfter}
        <span class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render iconAfter()}
        </span>
      {/if}
    </div>
  </div>
{:else}
  <div class="relative flex items-center">
    {#if iconBefore}
      <span class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render iconBefore()}
      </span>
    {/if}
    <input
      {type}
      {id}
      {placeholder}
      {disabled}
      bind:value
      oninput={oninput}
      class="{baseInputClasses} {focusClasses} {errorClasses} {disabled ? disabledClasses : ''} {className}"
      class:pl-12={iconBefore}
      class:pr-12={iconAfter}
    />
    {#if iconAfter}
      <span class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render iconAfter()}
      </span>
    {/if}
  </div>
{/if}
