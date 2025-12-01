<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Portal component - teleports content to a different DOM location.
   * 
   * **Focus Management**: This component handles DOM manipulation only.
   * For focus-sensitive content (modals, drawers, toasts), the parent component
   * should manage focus using the patterns from Modal.svelte and Drawer.svelte:
   * - Store previousFocus before opening
   * - Focus appropriate element after mount
   * - Restore focus on cleanup
   * 
   * **Stacking Coordination**: Multiple portals can coexist. For z-index stacking,
   * manage via CSS classes on the portal children or implement a portal manager.
   */
  interface Props {
    target?: HTMLElement | string;
    children?: Snippet;
  }

  let { target = 'body', children }: Props = $props();

  let mountElement = $state<HTMLElement | null>(null);

  function portal(node: HTMLElement, currentTarget: HTMLElement) {
    currentTarget.appendChild(node);
    return {
      update(newTarget: HTMLElement) {
        // Handle target prop changes by moving node to new parent
        if (newTarget !== currentTarget) {
          newTarget.appendChild(node);
        }
      },
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
  }

  $effect(() => {
    if (typeof document === 'undefined') return;

    // Resolve target element
    const targetElement = typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : target;

    if (!targetElement) return;

    // Create container div
    const container = document.createElement('div');
    targetElement.appendChild(container);
    mountElement = container;

    return () => {
      // Cleanup: remove container from DOM
      container.remove();
      mountElement = null;
    };
  });
</script>

{#if mountElement}
  {#if children}
    <div use:portal={mountElement}>
      {@render children()}
    </div>
  {/if}
{/if}
