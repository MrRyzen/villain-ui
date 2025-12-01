<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    side?: 'left' | 'right';
    width?: 'sm' | 'md' | 'lg';
    children?: Snippet;
  }

  let {
    open = $bindable(true),
    side = 'left',
    width = 'md',
    children
  }: Props = $props();

  const widthClasses = {
    sm: { open: 'w-56', collapsed: 'w-14' },
    md: { open: 'w-64', collapsed: 'w-16' },
    lg: { open: 'w-80', collapsed: 'w-20' }
  };

  const sideClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  const currentWidth = $derived(open ? widthClasses[width].open : widthClasses[width].collapsed);
  const baseClasses = 'fixed top-0 bottom-0 z-30 glass-panel overflow-y-auto overflow-x-hidden transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<aside class="{baseClasses} {sideClasses[side]} {currentWidth}">
  {@render children?.()}
</aside>
