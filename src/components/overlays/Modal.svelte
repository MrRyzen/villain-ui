<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  export interface Props {
    open?: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closeOnBackdrop?: boolean;
    closeOnEscape?: boolean;
    children?: Snippet;
    footer?: Snippet;
    iconBefore?: Snippet;
    class?: string;
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    children,
    footer,
    iconBefore,
    class: className = ''
  }: Props = $props();

  let modalElement = $state<HTMLDivElement>();
  let previousFocus = $state<HTMLElement | null>(null);

  const sizeClasses = {
    sm: 'max-w-[28rem]',
    md: 'max-w-[36rem]',
    lg: 'max-w-[48rem]',
    xl: 'max-w-[64rem]'
  };

  const titleId = createId('modal-title');

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

  function handleFocusTrap(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !modalElement) return;

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      modalElement.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: moving backwards
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
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
      document.addEventListener('keydown', handleFocusTrap);

      // Focus first interactive element
      requestAnimationFrame(() => {
        const firstInteractive = modalElement?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstInteractive?.focus();
      });

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';

        // Remove event listeners
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleFocusTrap);

        // Restore previous focus
        previousFocus?.focus();
      };
    }
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md animate-[fade-in_0.2s_var(--ease-luxe)]"
    onclick={handleBackdropClick}
    role="presentation"
  >
    <div
      bind:this={modalElement}
      class="glass-panel rounded-[var(--radius-lg)] shadow-deep w-full {sizeClasses[size]} {className} animate-[fade-up_0.3s_var(--ease-luxe)] flex flex-col max-h-[90vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {#if title}
        <div class="flex items-center justify-between p-8 border-b border-border">
          <h2 id={titleId} class="text-xl font-semibold text-text flex items-center gap-3">
            {#if iconBefore}
              <span class="inline-flex items-center justify-center">
                {@render iconBefore()}
              </span>
            {/if}
            {title}
          </h2>
          <button
            type="button"
            onclick={handleClose}
            class="text-text-soft hover:text-text transition-colors"
            aria-label="Close modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/if}

      <div class="flex-1 overflow-y-auto p-8 max-h-[70vh]" style="scrollbar-width: thin; scrollbar-color: var(--color-accent) var(--color-base-3);">
        {@render children?.()}
      </div>

      {#if footer}
        <div class="flex items-center justify-end gap-4 p-8 border-t border-border">
          {@render footer?.()}
        </div>
      {/if}
    </div>
  </div>
{/if}
