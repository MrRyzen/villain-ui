<script lang="ts">
  import type { Snippet } from 'svelte';

  export interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /**
     * Pattern variant:
     * - default: raised content card
     * - command: card with an integrated command bar (eyebrow + actions strip)
     * - metric: recessed instrument surface for numbers/readouts
     */
    variant?: 'default' | 'command' | 'metric';
    /** Mono uppercase system label. In command variant it lives in the command bar. */
    eyebrow?: string;
    /** Actions rendered in the command bar (command variant) or top-right of content. */
    actions?: Snippet;
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
    variant = 'default',
    eyebrow,
    actions,
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
    sm: 'p-5',
    md: 'p-8',
    lg: 'p-10'
  };

  const isInteractive = $derived(!!href || !!onclick);
  const hasCommandBar = $derived(variant === 'command' && (!!eyebrow || !!actions));

  const surfaceClasses = $derived(variant === 'metric' ? 'panel-spectral' : 'panel-raised');

  // Command bar is full-bleed: root loses padding, content area gets it back
  const rootPadding = $derived(hasCommandBar ? 'p-0' : paddingClasses[padding]);

  const baseClasses = $derived(
    `${surfaceClasses} rounded-[var(--radius-sm)] transition-all duration-300 ease-[var(--ease-luxe)]` +
    `${hasCommandBar ? ' overflow-hidden' : ''}` +
    `${href ? ' no-underline' : ''}` +
    `${isInteractive ? ' cursor-pointer hover-lift' : ''}` +
    `${selected ? ' ring-2 ring-accent ring-offset-2 ring-offset-base-0' : ''}` +
    `${disabled ? ' opacity-50 pointer-events-none' : ''}`
  );

  const eyebrowClasses = 'font-[var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--color-text-soft)]';
</script>

{#snippet cardBody()}
  {#if iconBefore}
    <div class="card-icon">
      {@render iconBefore()}
    </div>
  {/if}
  {#if !hasCommandBar && eyebrow}
    <div class="{eyebrowClasses} mb-3 flex items-center justify-between gap-4">
      {eyebrow}
      {#if actions}
        <span class="flex items-center gap-2 normal-case tracking-normal">{@render actions()}</span>
      {/if}
    </div>
  {/if}
  {#if header}
    <div class="mb-5">
      {@render header()}
    </div>
  {/if}

  <div>
    {@render children?.()}
  </div>

  {#if footer}
    <div class="mt-5">
      {@render footer()}
    </div>
  {/if}
{/snippet}

{#snippet cardContent()}
  {#if hasCommandBar}
    <div class="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-neutral-overlay-2)]">
      <span class={eyebrowClasses}>{eyebrow}</span>
      {#if actions}
        <div class="flex items-center gap-2">
          {@render actions()}
        </div>
      {/if}
    </div>
    <div class={paddingClasses[padding]}>
      {@render cardBody()}
    </div>
  {:else}
    {@render cardBody()}
  {/if}
{/snippet}

{#if href}
  <a {href} {target} rel={relValue} class="{baseClasses} {rootPadding} {className}" aria-disabled={disabled || undefined} {...restProps}>
    {@render cardContent()}
  </a>
{:else if onclick}
  <button type="button" {onclick} {disabled} aria-pressed={selected} class="{baseClasses} {rootPadding} {className} text-left w-full" {...restProps}>
    {@render cardContent()}
  </button>
{:else}
  <div class="{baseClasses} {rootPadding} {className}" {...restProps}>
    {@render cardContent()}
  </div>
{/if}
