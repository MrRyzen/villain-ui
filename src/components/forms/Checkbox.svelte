<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    label?: string;
    id?: string;
    onchange?: (event: Event) => void;
  }

  let {
    checked = $bindable(false),
    disabled = false,
    label,
    id = createId('checkbox'),
    onchange
  }: Props = $props();
</script>

<label for={id} class="flex items-center gap-2 cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''}">
  <input
    type="checkbox"
    {id}
    {disabled}
    bind:checked
    onchange={onchange}
    class="w-5 h-5 rounded-sm border-2 border-border-strong bg-transparent appearance-none transition-all duration-200 ease-luxe cursor-pointer checked:bg-accent checked:border-accent checked:accent-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base-1 relative {disabled ? 'cursor-not-allowed' : ''}"
  />
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
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none'%3E%3Cpath d='M2 5L4 7L8 3' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>
