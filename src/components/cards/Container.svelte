<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    centered?: boolean;
    padding?: boolean;
    children?: Snippet;
  }

  let {
    size = 'lg',
    centered = true,
    padding = true,
    children
  }: Props = $props();

  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  };

  const centeredClasses = centered ? 'mx-auto' : '';
  const paddingClasses = padding ? 'px-4 md:px-6 lg:px-8' : '';
  const baseClasses = 'w-full';
</script>

<div class="{baseClasses} {sizeClasses[size]} {centeredClasses} {paddingClasses}">
  {@render children?.()}
</div>
