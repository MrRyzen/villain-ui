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
    id = createId('switch'),
    onchange
  }: Props = $props();
</script>

<label for={id} class="flex items-center gap-2 cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''}">
  <input
    type="checkbox"
    role="switch"
    aria-checked={checked}
    {id}
    {disabled}
    bind:checked
    onchange={onchange}
    class="w-11 h-6 rounded-pill bg-base-3 border border-border appearance-none transition-all duration-300 ease-luxe cursor-pointer checked:bg-accent checked:accent-glow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-base-1 relative {disabled ? 'cursor-not-allowed' : ''}"
  />
  {#if label}
    <span class="text-text text-sm select-none">
      {label}
    </span>
  {/if}
</label>

<style>
  input[type="checkbox"]::after {
    content: '';
    position: absolute;
    left: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    border-radius: var(--radius-pill);
    background: var(--color-text);
    transition: all 0.3s var(--ease-luxe);
  }

  input[type="checkbox"]:checked::after {
    transform: translate(1.25rem, -50%);
  }
</style>
