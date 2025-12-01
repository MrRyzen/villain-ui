<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';
  import ScrollArea from '../utilities/ScrollArea.svelte';

  interface Props {
    open?: boolean;
    side?: 'left' | 'right' | 'top' | 'bottom';
    size?: 'sm' | 'md' | 'lg';
    title?: string;
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    children?: Snippet;
    footer?: Snippet;
  }

  let {
    open = $bindable(false),
    side = 'right',
    size = 'md',
    title,
    closeOnBackdrop = true,
    closeOnEscape = true,
    children,
    footer
  }: Props = $props();

  let drawerElement = $state<HTMLDivElement>();
  let previousFocus = $state<HTMLElement | null>(null);

  const titleId = createId('drawer-title');

  const sizeClasses = {
    left: {
      sm: 'max-w-[20rem]',
      md: 'max-w-[28rem]',
      lg: 'max-w-[36rem]'
    },
    right: {
      sm: 'max-w-[20rem]',
      md: 'max-w-[28rem]',
      lg: 'max-w-[36rem]'
    },
    top: {
      sm: 'max-h-[20rem]',
      md: 'max-h-[28rem]',
      lg: 'max-h-[36rem]'
    },
    bottom: {
      sm: 'max-h-[20rem]',
      md: 'max-h-[28rem]',
      lg: 'max-h-[36rem]'
    }
  };

  const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
  };

  const animationClasses = {
    left: 'animate-[slide-in-left_0.3s_var(--ease-luxe)]',
    right: 'animate-[slide-in-right_0.3s_var(--ease-luxe)]',
    top: 'animate-[slide-in-top_0.3s_var(--ease-luxe)]',
    bottom: 'animate-[slide-in-bottom_0.3s_var(--ease-luxe)]'
  };

  function handleClose() {
    open = false;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape') {
      handleClose();
    }
  }

  $effect(() => {
    if (typeof document === 'undefined') return;
    
    if (open) {
      // Store previous focus
      previousFocus = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add event listeners
      document.addEventListener('keydown', handleEscape);

      // Focus first interactive element
      requestAnimationFrame(() => {
        const firstInteractive = drawerElement?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstInteractive?.focus();
      });

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';

        // Remove event listeners
        document.removeEventListener('keydown', handleEscape);

        // Restore previous focus
        previousFocus?.focus();
      };
    }
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 bg-overlay backdrop-blur-md animate-[fade-in_0.2s_var(--ease-luxe)]"
    onclick={handleBackdropClick}
    role="presentation"
  >
    <div
      bind:this={drawerElement}
      class="glass-panel shadow-deep fixed {positionClasses[side]} {sizeClasses[side][size]} {animationClasses[side]} flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {#if title}
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h2 id={titleId} class="text-xl font-semibold text-text">
            {title}
          </h2>
          <button
            type="button"
            onclick={handleClose}
            class="text-text-soft hover:text-text transition-colors"
            aria-label="Close drawer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}

      <div class="flex-1 overflow-hidden">
        <ScrollArea height="100%">
          <div class="p-6">
            {@render children?.()}
          </div>
        </ScrollArea>
      </div>

      {#if footer}
        <div class="flex items-center justify-end gap-3 p-6 border-t border-border">
          {@render footer?.()}
        </div>
      {/if}
    </div>
  </div>
{/if}
