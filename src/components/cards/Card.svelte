<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    class?: string;
    children?: Snippet;
    header?: Snippet;
    footer?: Snippet;
    iconBefore?: Snippet;
  }

  let {
    padding = 'md',
    href,
    target = '_self',
    rel,
    class: className = '',
    children,
    header,
    footer,
    iconBefore,
    ...restProps
  }: Props = $props();

  // Compute rel attribute: use explicit rel if provided, otherwise default to 'noopener noreferrer' for target='_blank'
  const relValue = $derived(rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined));

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = $derived(
    `panel-raised rounded-[var(--radius-lg)] transition-all duration-300 ease-[var(--ease-luxe)] ${href ? 'no-underline' : ''}`
  );
</script>

{#if href}
  <a {href} {target} rel={relValue} class="{baseClasses} {paddingClasses[padding]} {className}" {...restProps}>
    {#if iconBefore}
      <div class="card-icon">
        {@render iconBefore()}
      </div>
    {/if}
    {#if header}
      <div class="pb-3 mb-3 border-b border-border-strong">
        {@render header()}
      </div>
    {/if}

    <div>
      {@render children?.()}
    </div>

    {#if footer}
      <div class="pt-3 mt-3 border-t border-border-strong">
        {@render footer()}
      </div>
    {/if}
  </a>
{:else}
  <div class="{baseClasses} {paddingClasses[padding]} {className}" {...restProps}>
    {#if iconBefore}
      <div class="card-icon">
        {@render iconBefore()}
      </div>
    {/if}
    {#if header}
      <div class="pb-3 mb-3 border-b border-border-strong">
        {@render header()}
      </div>
    {/if}

    <div>
      {@render children?.()}
    </div>

    {#if footer}
      <div class="pt-3 mt-3 border-t border-border-strong">
        {@render footer()}
      </div>
    {/if}
  </div>
{/if}
