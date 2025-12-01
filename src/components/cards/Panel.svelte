<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: boolean;
    glass?: boolean;
    children?: Snippet;
  }

  let {
    padding = 'md',
    rounded = true,
    glass = true,
    children
  }: Props = $props();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const glassClasses = glass ? 'glass-panel' : 'bg-[var(--color-panel)]';
  const roundedClasses = rounded ? 'rounded-[var(--radius-lg)]' : '';
  const baseClasses = 'transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<div class="{baseClasses} {glassClasses} {roundedClasses} {paddingClasses[padding]}">
  {@render children?.()}
</div>
