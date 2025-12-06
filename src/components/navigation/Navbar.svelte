<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    position?: 'sticky' | 'fixed';
    height?: 'sm' | 'md' | 'lg';
    navigationAlign?: 'left' | 'center';
    toggleButton?: Snippet;
    logo?: Snippet;
    navigation?: Snippet;
    actions?: Snippet;
    children?: Snippet;
    currentPath?: string;
  }

  let {
    position = 'sticky',
    height = 'md',
    navigationAlign = 'center',
    toggleButton,
    logo,
    navigation,
    actions,
    children,
    currentPath
  }: Props = $props();

  const positionClasses = {
    sticky: 'sticky top-0',
    fixed: 'fixed top-0 left-0 right-0'
  };

  const heightClasses = {
    sm: 'h-16',
    md: 'h-18',
    lg: 'h-24'
  };

  const baseClasses = 'z-50 glass-panel flex items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300 ease-[var(--ease-luxe)]';

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
</script>

<nav bind:this={rootElement} data-navbar class="{baseClasses} {positionClasses[position]} {heightClasses[height]}">
  <!-- Left Section: Toggle Button and Logo -->
  <div class="flex items-center gap-3">
    {#if toggleButton}
      {@render toggleButton()}
    {/if}
    {#if logo}
      {@render logo()}
    {/if}
  </div>
  
  <!-- Center Section: Navigation Links -->
  {#if navigation}
    <div class="flex-1 flex items-center {navigationAlign === 'center' ? 'justify-center' : ''} gap-6 {logo ? 'ml-4' : ''}">
      {@render navigation()}
    </div>
  {:else if children}
    <div class="flex-1 flex items-center {navigationAlign === 'center' ? 'justify-center' : ''} gap-4 {logo ? 'ml-4' : ''}">
      {@render children()}
    </div>
  {/if}
  
  <!-- Right Section: Actions -->
  {#if actions}
    <div class="flex items-center gap-3">
      {@render actions()}
    </div>
  {/if}
</nav>

<style>
  nav :global(.navbar-logo) {
    color: var(--color-accent);
    font-weight: 600;
    font-size: var(--text-lg);
  }

  nav :global(a.active),
  nav :global(button.active) {
    color: var(--color-accent);
    font-weight: 600;
    position: relative;
  }

  nav :global(a.active::after),
  nav :global(button.active::after) {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-accent);
    box-shadow: var(--shadow-accent-glow);
  }

  nav :global(a:not(.active):hover),
  nav :global(button:not(.active):hover) {
    color: var(--color-accent-soft);
  }
</style>
