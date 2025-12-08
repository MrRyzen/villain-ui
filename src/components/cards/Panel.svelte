<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: boolean;
    variant?: 'default' | 'glass'; // Primary styling selector. Use variant='glass' for enhanced glass morphism.
    class?: string;
    children?: Snippet;
  }

  let {
    padding = 'md',
    rounded = true,
    variant = 'default',
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-5',
    md: 'p-8',
    lg: 'p-10'
  };

  const glassClasses = $derived(
    variant === 'glass'
      ? 'glass-panel bg-[var(--color-accent-overlay-5)] border-[var(--color-border-glow)]'
      : 'glass-panel'
  );
  
  const roundedClasses = $derived(rounded ? 'rounded-[var(--radius-lg)]' : '');
  const baseClasses = 'transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<div class="{baseClasses} {glassClasses} {roundedClasses} {paddingClasses[padding]} {className}" {...restProps}>
  {@render children?.()}
</div>
