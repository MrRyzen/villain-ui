<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
  }

  let {
    padding = 'md',
    hoverable = false,
    class: className = '',
    children,
    header,
    footer,
    ...restProps
  }: Props = $props();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = 'glass-panel rounded-[var(--radius-lg)] transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<div class="{baseClasses} {hoverable ? 'hover-lift' : ''} {paddingClasses[padding]} {className}" {...restProps}>
  {#if header}
    <div class="pb-3 mb-3 border-b border-[var(--color-border-strong)]">
      {@render header()}
    </div>
  {/if}

  <div>
    {@render children?.()}
  </div>

  {#if footer}
    <div class="pt-3 mt-3 border-t border-[var(--color-border-strong)]">
      {@render footer()}
    </div>
  {/if}
</div>
