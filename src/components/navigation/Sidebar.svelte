<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    side?: 'left' | 'right';
    width?: 'sm' | 'md' | 'lg';
    header?: Snippet;
    children?: Snippet;
    currentPath?: string;
  }

  let {
    open = $bindable(true),
    side = 'left',
    width = 'md',
    header,
    children,
    currentPath
  }: Props = $props();

  let navbarHeight = $state(0);

  $effect(() => {
    if (typeof document === 'undefined') return;

    const navbarElement = document.querySelector('[data-navbar]') as HTMLElement;
    
    if (navbarElement) {
      // Initial height
      navbarHeight = navbarElement.offsetHeight;

      // Watch for height changes (responsive behavior, window resize, etc.)
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
          navbarHeight = navbarElement.offsetHeight;
        });

        resizeObserver.observe(navbarElement);

        return () => {
          resizeObserver.disconnect();
        };
      }
    } else {
      navbarHeight = 0;
    }
  });

  // Track elements modified by the effect to preserve manual .active classes
  let autoManagedElements = $state(new Set<Element>());
  let rootElement: HTMLElement | null = $state(null);

  $effect(() => {
    if (typeof document === 'undefined') return;
    if (!rootElement) return;

    // Clear auto-managed active classes when currentPath becomes falsy
    if (!currentPath) {
      autoManagedElements.forEach((element) => {
        element.classList.remove('active');
      });
      autoManagedElements.clear();
      return;
    }

    const elements = rootElement.querySelectorAll('a, button');
    
    elements.forEach((element) => {
      const href = element.getAttribute('href');
      const dataHref = element.getAttribute('data-href');
      const targetPath = href || dataHref;

      // Match exact path or nested routes (e.g., /buttons matches /buttons/icon-button)
      const isActive = targetPath === currentPath || 
                      (targetPath && currentPath.startsWith(targetPath + '/'));

      if (isActive) {
        // Only add to autoManagedElements if we're adding the class ourselves
        if (!element.classList.contains('active')) {
          element.classList.add('active');
          autoManagedElements.add(element);
        }
      } else if (autoManagedElements.has(element)) {
        element.classList.remove('active');
        autoManagedElements.delete(element);
      }
    });
  });

  // Collapsed state icon/text detection
  $effect(() => {
    if (typeof document === 'undefined') return;
    if (!rootElement) return;

    // Reference open to make effect reactive to collapse/expand state changes
    // This ensures detection runs when sidebar toggles
    if (open === undefined) return;

    const elements = rootElement.querySelectorAll('a, button');
    
    elements.forEach((element) => {
      // Check for icon presence using documented .sidebar-item-icon class
      const hasIcon = element.querySelector('.sidebar-item-icon');
      
      if (hasIcon) {
        element.setAttribute('data-sidebar-has-icon', 'true');
        element.removeAttribute('data-sidebar-first-letter');
      } else {
        // Extract first letter from .sidebar-item-label or fallback to text content
        const label = element.querySelector('.sidebar-item-label');
        const textContent = (label?.textContent || element.textContent)?.trim();
        const firstChar = textContent?.[0];
        
        // Only set first-letter if it's alphanumeric
        if (firstChar && /[a-zA-Z0-9]/.test(firstChar)) {
          element.setAttribute('data-sidebar-first-letter', firstChar.toUpperCase());
          element.removeAttribute('data-sidebar-has-icon');
        } else {
          // No valid first letter - don't show anything in collapsed mode
          element.removeAttribute('data-sidebar-first-letter');
          element.removeAttribute('data-sidebar-has-icon');
        }
      }
    });
  });

  const widthClasses = {
    sm: { open: 'w-56', collapsed: 'w-14' },
    md: { open: 'w-64', collapsed: 'w-16' },
    lg: { open: 'w-80', collapsed: 'w-20' }
  };

  const sideClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  const currentWidth = $derived(open ? widthClasses[width].open : widthClasses[width].collapsed);
  const baseClasses = 'fixed bottom-0 z-[var(--z-40)] glass-panel overflow-y-auto overflow-x-hidden transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<aside bind:this={rootElement} data-sidebar class="{baseClasses} {sideClasses[side]} {currentWidth}" style="top: {navbarHeight}px">
  {#if header && open}
    {@render header()}
  {/if}
  {@render children?.()}
</aside>

<style>
  /* Header styling */
  aside :global(.sidebar-header) {
    padding: 1rem;
    font-weight: 600;
    color: var(--color-accent);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s var(--ease-luxe);
  }

  /* Collapsed state - center icons and hide text */
  aside[class*="w-14"] :global(a[data-sidebar-has-icon]),
  aside[class*="w-16"] :global(a[data-sidebar-has-icon]),
  aside[class*="w-20"] :global(a[data-sidebar-has-icon]),
  aside[class*="w-14"] :global(button[data-sidebar-has-icon]),
  aside[class*="w-16"] :global(button[data-sidebar-has-icon]),
  aside[class*="w-20"] :global(button[data-sidebar-has-icon]) {
    justify-content: center;
  }

  aside[class*="w-14"] :global(a[data-sidebar-has-icon] .sidebar-item-label),
  aside[class*="w-16"] :global(a[data-sidebar-has-icon] .sidebar-item-label),
  aside[class*="w-20"] :global(a[data-sidebar-has-icon] .sidebar-item-label),
  aside[class*="w-14"] :global(button[data-sidebar-has-icon] .sidebar-item-label),
  aside[class*="w-16"] :global(button[data-sidebar-has-icon] .sidebar-item-label),
  aside[class*="w-20"] :global(button[data-sidebar-has-icon] .sidebar-item-label) {
    display: none;
  }

  aside[class*="w-14"] :global(a[data-sidebar-has-icon] .sidebar-item-icon),
  aside[class*="w-16"] :global(a[data-sidebar-has-icon] .sidebar-item-icon),
  aside[class*="w-20"] :global(a[data-sidebar-has-icon] .sidebar-item-icon),
  aside[class*="w-14"] :global(button[data-sidebar-has-icon] .sidebar-item-icon),
  aside[class*="w-16"] :global(button[data-sidebar-has-icon] .sidebar-item-icon),
  aside[class*="w-20"] :global(button[data-sidebar-has-icon] .sidebar-item-icon) {
    font-size: var(--text-2xl);
    width: 1.5rem;
    height: 1.5rem;
  }

  /* Collapsed state - first letter circle for items without icons */
  aside[class*="w-14"] :global(a:not([data-sidebar-has-icon]))::before,
  aside[class*="w-16"] :global(a:not([data-sidebar-has-icon]))::before,
  aside[class*="w-20"] :global(a:not([data-sidebar-has-icon]))::before,
  aside[class*="w-14"] :global(button:not([data-sidebar-has-icon]))::before,
  aside[class*="w-16"] :global(button:not([data-sidebar-has-icon]))::before,
  aside[class*="w-20"] :global(button:not([data-sidebar-has-icon]))::before {
    content: attr(data-sidebar-first-letter);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent-overlay-20);
    color: var(--color-accent);
    font-weight: 600;
    font-size: var(--text-lg);
  }

  aside[class*="w-14"] :global(a:not([data-sidebar-has-icon])),
  aside[class*="w-16"] :global(a:not([data-sidebar-has-icon])),
  aside[class*="w-20"] :global(a:not([data-sidebar-has-icon])),
  aside[class*="w-14"] :global(button:not([data-sidebar-has-icon])),
  aside[class*="w-16"] :global(button:not([data-sidebar-has-icon])),
  aside[class*="w-20"] :global(button:not([data-sidebar-has-icon])) {
    justify-content: center;
  }

  aside[class*="w-14"] :global(a:not([data-sidebar-has-icon]) .sidebar-item-label),
  aside[class*="w-16"] :global(a:not([data-sidebar-has-icon]) .sidebar-item-label),
  aside[class*="w-20"] :global(a:not([data-sidebar-has-icon]) .sidebar-item-label),
  aside[class*="w-14"] :global(button:not([data-sidebar-has-icon]) .sidebar-item-label),
  aside[class*="w-16"] :global(button:not([data-sidebar-has-icon]) .sidebar-item-label),
  aside[class*="w-20"] :global(button:not([data-sidebar-has-icon]) .sidebar-item-label) {
    display: none;
  }

  aside :global(a.active),
  aside :global(button.active) {
    background: var(--color-accent-overlay-15);
    color: var(--color-accent);
    border-left: 3px solid var(--color-accent);
    font-weight: 600;
  }

  aside :global(a.active),
  aside :global(button.active) {
    box-shadow: var(--shadow-accent-glow);
  }

  aside :global(a:not(.active):hover),
  aside :global(button:not(.active):hover) {
    background: var(--color-base-3);
    color: var(--color-accent-soft);
  }

  aside :global(a),
  aside :global(button) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    margin: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
    color: var(--color-text-soft);
    text-decoration: none;
    transition: all 0.2s var(--ease-luxe);
    cursor: pointer;
    border: none;
    background: transparent;
    width: calc(100% - 1rem);
    text-align: left;
    font-family: var(--font-body);
    font-size: 0.875rem;
  }
</style>
