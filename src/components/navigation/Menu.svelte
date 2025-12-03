<script lang="ts">
  import type { Snippet } from 'svelte';

  interface MenuItem {
    id: string;
    label: string;
    icon?: Snippet;
    disabled?: boolean;
    onclick?: () => void;
  }

  interface Props {
    items?: MenuItem[];
    children?: Snippet;
  }

  let {
    items,
    children
  }: Props = $props();

  function handleItemClick(item: MenuItem) {
    if (!item.disabled && item.onclick) {
      item.onclick();
    }
  }
</script>

<div role="menu" class="glass-panel rounded-[var(--radius-lg)] p-3 shadow-[var(--shadow-deep)]">
  {#if children}
    {@render children()}
  {:else if items}
    {#each items as item}
      <button
        role="menuitem"
        aria-disabled={item.disabled}
        onclick={() => handleItemClick(item)}
        disabled={item.disabled}
        class="flex items-center gap-2 w-full px-4 py-3 rounded-[var(--radius-md)] text-[var(--color-text)] text-sm font-[var(--font-body)] hover:bg-[var(--color-base-3)] hover-lift transition-all duration-200 ease-[var(--ease-luxe)] {item.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}"
      >
        {#if item.icon}
          {@render item.icon()}
        {/if}
        <span>{item.label}</span>
      </button>
    {/each}
  {/if}
</div>
