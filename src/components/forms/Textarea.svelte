<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    value?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    oninput?: (event: Event) => void;
  }

  let {
    value = $bindable(''),
    placeholder,
    rows = 4,
    disabled = false,
    error = false,
    label,
    id = createId('textarea'),
    oninput
  }: Props = $props();

  const baseClasses = 'glass-panel rounded-lg px-4 py-3 font-body text-text placeholder:text-text-muted transition-all duration-300 ease-luxe w-full resize-y min-h-[100px]';
  const focusClasses = 'focus:outline-none focus:border-accent focus:accent-glow';
  const errorClasses = error ? 'border-error' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
</script>

{#if label}
  <div>
    <label for={id} class="text-text-soft text-sm mb-2 block">
      {label}
    </label>
    <textarea
      {id}
      {placeholder}
      {disabled}
      {rows}
      bind:value
      oninput={oninput}
      class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
    ></textarea>
  </div>
{:else}
  <textarea
    {id}
    {placeholder}
    {disabled}
    {rows}
    bind:value
    oninput={oninput}
    class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
  ></textarea>
{/if}
