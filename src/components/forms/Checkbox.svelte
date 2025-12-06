<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  export interface Props {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    id?: string;
    onchange?: (event: Event) => void;
    iconBefore?: import('svelte').Snippet;
    class?: string;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    label,
    id = createId('checkbox'),
    onchange,
    iconBefore,
    class: className = ''
  }: Props = $props();
</script>

<label for={id} class="flex items-center gap-2 cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''} {className}">
  <input
    type="checkbox"
    {id}
    {disabled}
    bind:checked
    onchange={onchange}
    class="w-6 h-6 rounded-sm border-2 border-border-strong bg-transparent appearance-none transition-all duration-200 ease-luxe cursor-pointer checked:bg-accent checked:border-accent checked:accent-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base-1 relative {disabled ? 'cursor-not-allowed' : ''}"
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

<style>
  input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6L5 8.5L9.5 3.5' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
