<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    position?: 'sticky' | 'fixed';
    height?: 'sm' | 'md' | 'lg';
    children?: Snippet;
  }

  let {
    position = 'sticky',
    height = 'md',
    children
  }: Props = $props();

  const positionClasses = {
    sticky: 'sticky top-0',
    fixed: 'fixed top-0 left-0 right-0'
  };

  const heightClasses = {
    sm: 'h-14',
    md: 'h-16',
    lg: 'h-20'
  };

  const baseClasses = 'z-40 glass-panel flex items-center justify-between px-4 md:px-6 lg:px-8 transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<nav class="{baseClasses} {positionClasses[position]} {heightClasses[height]}">
  {@render children?.()}
</nav>
