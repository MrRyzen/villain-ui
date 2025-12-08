/**
 * ContextMenu Component
 * 
 * Accessibility:
 * - Keyboard: Arrow Up/Down to navigate items, Home/End for first/last, Enter/Space to activate, Escape to close
 * - ARIA: role="menu", role="menuitem"
 * - Focus: Auto-focus first item on open, roving tabindex pattern
 * - Screen readers: Menu items announced with position and selection state
 */
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface MenuItem {
    id: string;
    label: string;
    onclick?: () => void;
    disabled?: boolean;
    icon?: Snippet;
  }

  interface Props {
    items: MenuItem[];
    open?: boolean;
    x?: number;
    y?: number;
    trigger?: Snippet;
  }

  let {
    items,
    open = $bindable(false),
    x = $bindable(0),
    y = $bindable(0),
    trigger
  }: Props = $props();

  let menuElement = $state<HTMLDivElement>();
  let selectedIndex = $state(0);
  const menuId = createId('context-menu');

  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    x = event.clientX;
    y = event.clientY;
    open = true;
    selectedIndex = 0;

    // Adjust position if menu would overflow viewport
    requestAnimationFrame(() => {
      if (menuElement) {
        const menuRect = menuElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x + menuRect.width > viewportWidth) {
          x = viewportWidth - menuRect.width - 10;
        }

        if (y + menuRect.height > viewportHeight) {
          y = viewportHeight - menuRect.height - 10;
        }
      }
    });
  }

  function handleItemClick(item: MenuItem) {
    if (item.disabled) return;
    item.onclick?.();
    open = false;
  }

  function handleMenuKeyDown(event: KeyboardEvent) {
    // Derive current index from focused element to stay in sync
    const focusedElement = document.activeElement as HTMLElement;
    const dataIndex = focusedElement?.getAttribute('data-index');
    if (dataIndex !== null) {
      const currentFocusedIndex = parseInt(dataIndex || '0', 10);
      if (!isNaN(currentFocusedIndex) && currentFocusedIndex >= 0 && currentFocusedIndex < items.length) {
        selectedIndex = currentFocusedIndex;
      }
    }

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
      case 'Escape':
        event.preventDefault();
        open = false;
        break;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (menuElement && !menuElement.contains(event.target as Node)) {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
      requestAnimationFrame(() => {
        const firstItem = menuElement?.querySelector('[role="menuitem"]') as HTMLElement;
        if (firstItem) {
          const dataIndex = firstItem.getAttribute('data-index');
          if (dataIndex !== null) {
            selectedIndex = parseInt(dataIndex, 10);
          }
          firstItem.focus();
        }
      });

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  });
</script>

<div oncontextmenu={handleContextMenu} role="presentation" class="contents">
  {@render trigger?.()}
</div>

{#if open}
  <div
    bind:this={menuElement}
    id={menuId}
    role="menu"
    tabindex="-1"
    onkeydown={handleMenuKeyDown}
    class="fixed z-[var(--z-50)] glass-panel rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-in_0.15s_var(--ease-luxe)]"
    style="left: {x}px; top: {y}px;"
  >
    {#each items as item, index}
      <button
        role="menuitem"
        data-index={index}
        tabindex={index === selectedIndex ? 0 : -1}
        onclick={() => handleItemClick(item)}
        disabled={item.disabled}
        class="w-full text-left px-4 py-2 text-sm text-text hover:bg-base-3 transition-colors duration-200 flex items-center gap-2 {item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
      >
        {#if item.icon}
          {@render item.icon()}
        {/if}
        {item.label}
      </button>
    {/each}
  </div>
{/if}
