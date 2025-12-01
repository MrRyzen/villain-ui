<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    x?: number;
    y?: number;
    trigger?: Snippet;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    x = $bindable(0),
    y = $bindable(0),
    trigger,
    children
  }: Props = $props();

  let menuElement = $state<HTMLDivElement>();

  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    x = event.clientX;
    y = event.clientY;
    open = true;

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

  function handleClickOutside(event: MouseEvent) {
    if (menuElement && !menuElement.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
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
    class="fixed z-50 glass-panel rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-in_0.15s_var(--ease-luxe)]"
    style="left: {x}px; top: {y}px;"
  >
    {@render children?.()}
  </div>
{/if}
