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
  }

  let {
    type = 'text',
    value = $bindable(''),
    placeholder,
    disabled = false,
    error = false,
    label,
    id = createId('input'),
    oninput
  }: Props = $props();

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
    <input
      {type}
      {id}
      {placeholder}
      {disabled}
      bind:value
      oninput={oninput}
      class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
    />
  </div>
{:else}
  <input
    {type}
    {id}
    {placeholder}
    {disabled}
    bind:value
    oninput={oninput}
    class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
  />
{/if}
