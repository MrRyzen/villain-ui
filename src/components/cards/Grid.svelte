<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    cols?: 1 | 2 | 3 | 4 | 6 | 12;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    responsive?: boolean;
    children?: Snippet;
  }

  let {
    cols = 3,
    gap = 'md',
    responsive = true,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12'
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const responsiveClasses = responsive
    ? `grid-cols-1 ${cols >= 2 ? 'md:grid-cols-2' : ''} lg:${colsClasses[cols]}`
    : colsClasses[cols];

  const baseClasses = 'grid w-full';
</script>

<div class="{baseClasses} {responsiveClasses} {gapClasses[gap]} {className}" {...restProps}>
  {@render children?.()}
</div>
