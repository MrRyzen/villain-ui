<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    open?: boolean;
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
    closeOnClickOutside?: boolean;
    trigger?: Snippet;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    placement = 'bottom',
    closeOnClickOutside = true,
    trigger,
    children
  }: Props = $props();

  let popoverElement = $state<HTMLDivElement>();
  let wrapperElement = $state<HTMLDivElement>();
  let actualPlacement = $state(placement);

  const popoverId = createId('popover');

  const placementClasses = {
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'left': 'right-full top-1/2 -translate-y-1/2 mr-2',
    'right': 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const oppositePlacement = {
    'top': 'bottom',
    'top-start': 'bottom-start',
    'top-end': 'bottom-end',
    'bottom': 'top',
    'bottom-start': 'top-start',
    'bottom-end': 'top-end',
    'left': 'right',
    'right': 'left'
  } as const;

  function toggleOpen() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (closeOnClickOutside && popoverElement && wrapperElement && !wrapperElement.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  // Reset actualPlacement when visibility changes
  $effect(() => {
    if (!open) {
      actualPlacement = placement;
    }
  });

  // Check viewport bounds and flip placement if needed
  $effect(() => {
    if (typeof window === 'undefined') return;
    
    if (open && popoverElement) {
      const rect = popoverElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Determine if current placement overflows and flip if needed
      if (actualPlacement.startsWith('top') && rect.top < 0) {
        actualPlacement = oppositePlacement[actualPlacement] || placement;
      } else if (actualPlacement.startsWith('bottom') && rect.bottom > viewportHeight) {
        actualPlacement = oppositePlacement[actualPlacement] || placement;
      } else if (actualPlacement === 'left' && rect.left < 0) {
        actualPlacement = 'right';
      } else if (actualPlacement === 'right' && rect.right > viewportWidth) {
        actualPlacement = 'left';
      }
    }
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    
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

<div bind:this={wrapperElement} class="relative inline-block">
  <button
    type="button"
    onclick={toggleOpen}
    aria-haspopup="true"
    aria-expanded={open}
    aria-controls={open ? popoverId : undefined}
    class="bg-transparent border-none p-0 cursor-pointer"
  >
    {@render trigger?.()}
  </button>

  {#if open}
    <div
      bind:this={popoverElement}
      id={popoverId}
      class="absolute {placementClasses[actualPlacement]} z-[var(--z-50)] glass-panel rounded-[var(--radius-lg)] shadow-deep p-4 animate-[fade-up_0.2s_var(--ease-luxe)]"
      role="dialog"
    >
      {@render children?.()}
    </div>
  {/if}
</div>
