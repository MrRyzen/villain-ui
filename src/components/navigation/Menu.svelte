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

  let selectedIndex = $state(0);
  let menuContainer: HTMLDivElement;

  function handleItemClick(item: MenuItem) {
    if (!item.disabled && item.onclick) {
      item.onclick();
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent) {
    if (!items) return;
    
    const enabledItems = items.filter(item => !item.disabled);
    const currentEnabledIndex = enabledItems.findIndex(item => item.id === items[selectedIndex]?.id);
    let nextIndex = currentEnabledIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentEnabledIndex < enabledItems.length - 1 ? currentEnabledIndex + 1 : 0;
        selectedIndex = items.findIndex(item => item.id === enabledItems[nextIndex]?.id);
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledItems.length - 1;
        selectedIndex = items.findIndex(item => item.id === enabledItems[nextIndex]?.id);
        break;
      case 'Home':
        event.preventDefault();
        selectedIndex = items.findIndex(item => item.id === enabledItems[0]?.id);
        break;
      case 'End':
        event.preventDefault();
        selectedIndex = items.findIndex(item => item.id === enabledItems[enabledItems.length - 1]?.id);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (items[selectedIndex] && !items[selectedIndex].disabled) {
          handleItemClick(items[selectedIndex]);
        }
        break;
    }
  }

  $effect(() => {
    if (items && selectedIndex >= 0 && menuContainer) {
      const selectedButton = menuContainer.querySelector(`[role="menuitem"][tabindex="0"]`) as HTMLElement;
      selectedButton?.focus();
    }
  });
</script>

<div bind:this={menuContainer} role="menu" tabindex="-1" onkeydown={handleMenuKeyDown} class="glass-panel rounded-[var(--radius-lg)] p-3 shadow-[var(--shadow-deep)]">
  {#if children}
    {@render children()}
  {:else if items}
    {#each items as item, index}
      <button
        role="menuitem"
        aria-disabled={item.disabled}
        tabindex={index === selectedIndex ? 0 : -1}
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
