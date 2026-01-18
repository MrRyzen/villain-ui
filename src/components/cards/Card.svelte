<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    onclick?: (event: MouseEvent) => void;
    selected?: boolean;
    disabled?: boolean;
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
    onclick,
    selected = false,
    disabled = false,
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

  const isInteractive = $derived(!!href || !!onclick);

  const baseClasses = $derived(
    `panel-raised rounded-[var(--radius-lg)] transition-all duration-300 ease-[var(--ease-luxe)]` +
    `${href ? ' no-underline' : ''}` +
    `${isInteractive ? ' cursor-pointer hover-lift' : ''}` +
    `${selected ? ' ring-2 ring-accent ring-offset-2 ring-offset-base-0' : ''}` +
    `${disabled ? ' opacity-50 pointer-events-none' : ''}`
  );
</script>

{#snippet cardContent()}
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
{/snippet}

{#if href}
  <a {href} {target} rel={relValue} class="{baseClasses} {paddingClasses[padding]} {className}" aria-disabled={disabled || undefined} {...restProps}>
    {@render cardContent()}
  </a>
{:else if onclick}
  <button type="button" {onclick} {disabled} aria-pressed={selected} class="{baseClasses} {paddingClasses[padding]} {className} text-left w-full" {...restProps}>
    {@render cardContent()}
  </button>
{:else}
  <div class="{baseClasses} {paddingClasses[padding]} {className}" {...restProps}>
    {@render cardContent()}
  </div>
{/if}
