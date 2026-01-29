<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    height?: string;
    scrollPercent?: number;
    children?: Snippet;
  }

  let { height = '400px', scrollPercent = $bindable(0), children }: Props = $props();

  let containerRef: HTMLDivElement | undefined = $state();

  function handleScroll() {
    if (!containerRef) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef;
    const maxScroll = scrollHeight - clientHeight;
    scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  }

  $effect(() => {
    if (!containerRef) return;
    const { scrollHeight, clientHeight } = containerRef;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const targetScroll = (scrollPercent / 100) * maxScroll;
      if (Math.abs(containerRef.scrollTop - targetScroll) > 1) {
        containerRef.scrollTop = targetScroll;
      }
    }
  });
</script>

<div
  bind:this={containerRef}
  onscroll={handleScroll}
  class="overflow-y-auto"
  style="
    height: {height};
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent) var(--color-base-3);
  "
>
  {@render children?.()}
</div>

<style>
  div::-webkit-scrollbar {
    width: 8px;
  }

  div::-webkit-scrollbar-track {
    background: var(--color-base-3);
    border-radius: var(--radius-sm);
  }

  div::-webkit-scrollbar-thumb {
    background: var(--color-accent);
    border-radius: var(--radius-sm);
  }

  div::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-soft);
  }
</style>
