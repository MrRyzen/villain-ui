<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    rounded?: boolean;
    variant?: 'default' | 'glass'; // Primary styling selector. Use variant='glass' for enhanced glass morphism.
    /** Mono uppercase title rendered in an integrated command bar. */
    title?: string;
    /** System status shown in the command bar (with a colored indicator). */
    status?: string;
    statusVariant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    /** Actions rendered on the right side of the command bar. */
    actions?: Snippet;
    class?: string;
    children?: Snippet;
  }

  let {
    padding = 'md',
    rounded = true,
    variant = 'default',
    title,
    status,
    statusVariant = 'neutral',
    actions,
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

  const statusColors = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
    neutral: 'var(--color-text-muted)'
  };

  const glassClasses = $derived(
    variant === 'glass'
      ? 'glass-panel bg-[var(--color-accent-overlay-5)] border-[var(--color-border-glow)]'
      : 'panel-raised'
  );

  const hasCommandBar = $derived(!!title || !!status || !!actions);

  const roundedClasses = $derived(rounded ? 'rounded-[var(--radius-sm)]' : '');
  const baseClasses = 'transition-all duration-300 ease-[var(--ease-luxe)]';
</script>

{#if hasCommandBar}
  <div class="{baseClasses} {glassClasses} {roundedClasses} overflow-hidden {className}" {...restProps}>
    <div class="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-neutral-overlay-2)]">
      {#if title}
        <span class="font-[var(--font-mono)] text-xs uppercase tracking-[0.08em] text-[var(--color-text)]">{title}</span>
      {:else}
        <span></span>
      {/if}
      <div class="flex items-center gap-4">
        {#if status}
          <span
            class="inline-flex items-center gap-2 font-[var(--font-mono)] text-xs uppercase tracking-[0.08em]"
            style="color: {statusColors[statusVariant]};"
          >
            <span class="w-2 h-2 inline-block" style="background: {statusColors[statusVariant]};"></span>
            {status}
          </span>
        {/if}
        {#if actions}
          <div class="flex items-center gap-2">
            {@render actions()}
          </div>
        {/if}
      </div>
    </div>
    <div class={paddingClasses[padding]}>
      {@render children?.()}
    </div>
  </div>
{:else}
  <div class="{baseClasses} {glassClasses} {roundedClasses} {paddingClasses[padding]} {className}" {...restProps}>
    {@render children?.()}
  </div>
{/if}
