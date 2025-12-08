/**
 * DropdownMenu Component
 * 
 * Accessibility:
 * - Keyboard: Arrow Up/Down to navigate items, Home/End for first/last, Enter/Space to activate, Escape to close
 * - ARIA: role="menu", role="menuitem", aria-haspopup="menu", aria-expanded, aria-controls
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
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    trigger?: Snippet;
  }

  let {
    items,
    open = $bindable(false),
    placement = 'bottom-start',
    trigger
  }: Props = $props();

  let menuElement = $state<HTMLDivElement>();
  let wrapperElement: HTMLDivElement;
  let selectedIndex = $state(0);
  const menuId = createId('dropdown-menu');

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2'
  };

  function toggleMenu() {
    open = !open;
    if (open) {
      selectedIndex = 0;
    }
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
    if (menuElement && !wrapperElement.contains(event.target as Node)) {
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

<div bind:this={wrapperElement} class="relative">
  <button
    type="button"
    onclick={toggleMenu}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    }}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={menuId}
    class="bg-transparent border-none p-0 cursor-pointer"
  >
    {@render trigger?.()}
  </button>

  {#if open}
    <div
      bind:this={menuElement}
      id={menuId}
      role="menu"
      tabindex="-1"
      onkeydown={handleMenuKeyDown}
      class="absolute {placementClasses[placement]} z-[var(--z-50)] glass-panel rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-up_0.2s_var(--ease-luxe)]"
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
</div>
