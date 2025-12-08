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

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const baseClasses = 'grid w-full';

  // Build complete class string with all possible classes visible to Tailwind
  const gridClasses = $derived.by(() => {
    const classes = [];

    if (responsive) {
      // Mobile: always 1 column
      classes.push('grid-cols-1');
      // Tablet: 2 columns if cols >= 2
      if (cols >= 2) classes.push('md:grid-cols-2');
      // Desktop: use specified cols
      if (cols === 1) classes.push('lg:grid-cols-1');
      if (cols === 2) classes.push('lg:grid-cols-2');
      if (cols === 3) classes.push('lg:grid-cols-3');
      if (cols === 4) classes.push('lg:grid-cols-4');
      if (cols === 6) classes.push('lg:grid-cols-6');
      if (cols === 12) classes.push('lg:grid-cols-12');
    } else {
      // Non-responsive: use specified cols at all breakpoints
      if (cols === 1) classes.push('grid-cols-1');
      if (cols === 2) classes.push('grid-cols-2');
      if (cols === 3) classes.push('grid-cols-3');
      if (cols === 4) classes.push('grid-cols-4');
      if (cols === 6) classes.push('grid-cols-6');
      if (cols === 12) classes.push('grid-cols-12');
    }

    return classes.join(' ');
  });
</script>

<div class="{baseClasses} {gridClasses} {gapClasses[gap]} {className}" {...restProps}>
  {@render children?.()}
</div>
