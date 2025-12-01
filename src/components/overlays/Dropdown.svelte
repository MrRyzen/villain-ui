<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    placement = 'bottom-start',
    children
  }: Props = $props();

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2'
  };
</script>

{#if open}
  <div
    class="absolute {placementClasses[placement]} z-50 glass-panel rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-up_0.2s_var(--ease-luxe)]"
  >
    {@render children?.()}
  </div>
{/if}
