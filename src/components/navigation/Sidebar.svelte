<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    side?: 'left' | 'right';
    width?: 'sm' | 'md' | 'lg';
    children?: Snippet;
    currentPath?: string;
  }

  let {
    open = $bindable(true),
    side = 'left',
    width = 'md',
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

      if (targetPath === currentPath) {
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
  const baseClasses = 'fixed bottom-0 z-40 glass-panel overflow-y-auto overflow-x-hidden transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<aside bind:this={rootElement} data-sidebar class="{baseClasses} {sideClasses[side]} {currentWidth}" style="top: {navbarHeight}px">
  {@render children?.()}
</aside>

<style>
  aside :global(a.active),
  aside :global(button.active) {
    background: rgba(127, 61, 255, 0.15);
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
