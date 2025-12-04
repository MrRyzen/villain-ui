<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    oninput?: (event: Event) => void;
    icon?: import('svelte').Snippet;
    iconPosition?: 'before' | 'after';
    iconPrefix?: import('svelte').Snippet;
    iconSuffix?: import('svelte').Snippet;
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
    icon,
    iconPosition = 'before',
    iconPrefix,
    iconSuffix
  }: Props = $props();

  // If icon is provided without iconPrefix/iconSuffix, use iconPosition
  const displayIconPrefix = $derived(iconPrefix || (icon && iconPosition === 'before' ? icon : undefined));
  const displayIconSuffix = $derived(iconSuffix || (icon && iconPosition === 'after' ? icon : undefined));

  const baseClasses = 'glass-panel rounded-[var(--radius-lg)] px-5 py-3.5 font-body text-text placeholder:text-text-muted transition-all duration-300 ease-luxe w-full';
  const focusClasses = 'focus:outline-none focus:border-accent focus:accent-glow';
  const errorClasses = error ? 'border-error' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
</script>

{#if label}
  <div>
    <label for={id} class="text-text-soft text-sm mb-2 block">
      {label}
    </label>
    <div class="relative flex items-center">
      {#if displayIconPrefix}
        <span class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render displayIconPrefix()}
        </span>
      {/if}
      <input
        {type}
        {id}
        {placeholder}
        {disabled}
        bind:value
        oninput={oninput}
        class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
        class:pl-12={displayIconPrefix}
        class:pr-12={displayIconSuffix}
      />
      {#if displayIconSuffix}
        <span class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render displayIconSuffix()}
        </span>
      {/if}
    </div>
  </div>
{:else}
  <div class="relative flex items-center">
    {#if displayIconPrefix}
      <span class="absolute left-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render displayIconPrefix()}
      </span>
    {/if}
    <input
      {type}
      {id}
      {placeholder}
      {disabled}
      bind:value
      oninput={oninput}
      class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
      class:pl-12={displayIconPrefix}
      class:pr-12={displayIconSuffix}
    />
    {#if displayIconSuffix}
      <span class="absolute right-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render displayIconSuffix()}
      </span>
    {/if}
  </div>
{/if}
