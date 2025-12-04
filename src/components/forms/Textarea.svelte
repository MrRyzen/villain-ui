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
    icon?: import('svelte').Snippet;
  }

  let {
    value = $bindable(''),
    placeholder,
    rows = 4,
    disabled = false,
    error = false,
    label,
    id = createId('textarea'),
    oninput,
    icon
  }: Props = $props();

  // Icon spacing: pl-12 (3rem) = left-4 (1rem) icon position + ~2rem for icon width and spacing
  // top-4 keeps icon fixed at top when textarea is resized
  // This ensures text doesn't overlap with the absolutely positioned icon
  const baseClasses = 'glass-panel rounded-[var(--radius-lg)] px-5 py-3.5 font-body text-text placeholder:text-text-muted transition-all duration-300 ease-luxe w-full resize-y min-h-[100px]';
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
        <span class="absolute left-4 top-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
          {@render icon()}
        </span>
      {/if}
      <textarea
        {id}
        {placeholder}
        {disabled}
        {rows}
        bind:value
        oninput={oninput}
        class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
        class:pl-12={icon}
      ></textarea>
    </div>
  </div>
{:else}
  <div class="relative">
    {#if icon}
      <span class="absolute left-4 top-4 inline-flex items-center justify-center text-text-soft pointer-events-none">
        {@render icon()}
      </span>
    {/if}
    <textarea
      {id}
      {placeholder}
      {disabled}
      {rows}
      bind:value
      oninput={oninput}
      class="{baseClasses} {focusClasses} {errorClasses} {disabledClasses}"
      class:pl-12={icon}
    ></textarea>
  </div>
{/if}
