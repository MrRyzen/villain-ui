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
    children,
    header,
    footer
  }: Props = $props();

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = 'glass-panel rounded-xl transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

<div class="{baseClasses} {hoverable ? 'hover-lift' : ''} {paddingClasses[padding]}">
  {#if header}
    <div class="pb-4 mb-4 border-b border-border">
      {@render header()}
    </div>
  {/if}

  <div>
    {@render children?.()}
  </div>

  {#if footer}
    <div class="pt-4 mt-4 border-t border-border">
      {@render footer()}
    </div>
  {/if}
</div>
