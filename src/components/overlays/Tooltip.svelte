<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    trigger?: Snippet;
  }

  let {
    content,
    placement = 'top',
    delay = 200,
    trigger
  }: Props = $props();

  let visible = $state(false);
  let actualPlacement = $state(placement);
  let tooltipElement = $state<HTMLDivElement>();
  let timeoutId: number | undefined;

  const tooltipId = createId('tooltip');

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const oppositePlacement = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  } as const;

  function handleMouseEnter() {
    if (typeof window === 'undefined') return;
    timeoutId = window.setTimeout(() => {
      visible = true;
    }, delay);
  }

  function handleMouseLeave() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    visible = false;
  }

  function handleFocus() {
    handleMouseEnter();
  }

  function handleBlur() {
    handleMouseLeave();
  }

  // Reset actualPlacement when visibility changes
  $effect(() => {
    if (!visible) {
      actualPlacement = placement;
    }
  });

  // Check viewport bounds and flip placement if needed
  $effect(() => {
    if (typeof window === 'undefined') return;
    
    if (visible && tooltipElement) {
      const rect = tooltipElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Determine if current placement overflows and flip if needed
      if (actualPlacement === 'top' && rect.top < 0 && actualPlacement !== oppositePlacement[placement]) {
        actualPlacement = 'bottom';
      } else if (actualPlacement === 'bottom' && rect.bottom > viewportHeight && actualPlacement !== oppositePlacement[placement]) {
        actualPlacement = 'top';
      } else if (actualPlacement === 'left' && rect.left < 0 && actualPlacement !== oppositePlacement[placement]) {
        actualPlacement = 'right';
      } else if (actualPlacement === 'right' && rect.right > viewportWidth && actualPlacement !== oppositePlacement[placement]) {
        actualPlacement = 'left';
      }
    }
  });
</script>

<div class="relative inline-block">
  <div
    aria-describedby={visible ? tooltipId : undefined}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onfocus={handleFocus}
    onblur={handleBlur}
    role="presentation"
    class="contents"
  >
    {@render trigger?.()}
  </div>

  {#if visible}
    <div
      bind:this={tooltipElement}
      id={tooltipId}
      role="tooltip"
      class="absolute {placementClasses[actualPlacement]} z-50 glass-panel rounded-md px-3 py-2 text-sm text-text whitespace-nowrap animate-[fade-in_0.15s_var(--ease-luxe)] pointer-events-none"
    >
      {content}
    </div>
  {/if}
</div>
