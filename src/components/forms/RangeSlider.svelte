<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    showValue?: boolean;
    id?: string;
    name?: string;
    oninput?: (event: Event) => void;
    validationMessage?: string;
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    error = false,
    label,
    showValue = true,
    id = createId('range'),
    name,
    oninput,
    validationMessage
  }: Props = $props();

  const hasError = $derived(error || !!validationMessage);
  const percentage = $derived(max === min ? 0 : ((value - min) / (max - min)) * 100);
</script>

<div>
  {#if label || showValue}
    <div class="flex justify-between items-center mb-2">
      {#if label}
        <label for={id} class="text-text-soft text-sm">
          {label}
        </label>
      {/if}
      {#if showValue}
        <span class="text-text-soft text-sm">
          {value}
        </span>
      {/if}
    </div>
  {/if}
  <input
    type="range"
    {id}
    name={name}
    {min}
    {max}
    {step}
    {disabled}
    bind:value
    oninput={oninput}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    class="w-full h-2 rounded-pill appearance-none cursor-pointer transition-opacity duration-200 {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    style="background: linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) {percentage}%, var(--color-base-3) {percentage}%, var(--color-base-3) 100%); border: 1px solid {hasError ? 'var(--color-error)' : 'var(--color-border)'};"
  />
  {#if validationMessage}
    <p class="text-error text-xs mt-1.5">{validationMessage}</p>
  {/if}
</div>

<style>
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    box-shadow: var(--shadow-accent-glow);
    cursor: pointer;
    transition: transform 0.2s var(--ease-luxe);
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  input[type="range"]::-moz-range-thumb {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    box-shadow: var(--shadow-accent-glow);
    cursor: pointer;
    transition: transform 0.2s var(--ease-luxe);
    border: none;
  }

  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  input[type="range"]:focus::-webkit-slider-thumb {
    box-shadow: 
      var(--shadow-accent-glow),
      0 0 0 3px var(--color-base-1),
      0 0 0 5px var(--color-accent);
  }

  input[type="range"]:focus::-moz-range-thumb {
    box-shadow: 
      var(--shadow-accent-glow),
      0 0 0 3px var(--color-base-1),
      0 0 0 5px var(--color-accent);
  }

  input[type="range"]:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  input[type="range"]:disabled::-moz-range-thumb {
    cursor: not-allowed;
  }
</style>
