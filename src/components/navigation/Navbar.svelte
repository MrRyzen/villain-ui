<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    position?: 'sticky' | 'fixed';
    height?: 'sm' | 'md' | 'lg';
    logo?: Snippet;
    children?: Snippet;
  }

  let {
    position = 'sticky',
    height = 'md',
    logo,
    children
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

  const baseClasses = 'z-40 glass-panel flex items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<nav class="{baseClasses} {positionClasses[position]} {heightClasses[height]}">
  {#if logo}
    <div class="flex-shrink-0">
      {@render logo()}
    </div>
  {/if}
  <div class="flex items-center gap-4 {logo ? 'flex-1' : ''}">
    {@render children?.()}
  </div>
</nav>
