<script lang="ts">
  import { variantClasses, sizeClasses, disabledClasses } from './buttonClasses';

  export interface Props {
    href: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    target?: '_self' | '_blank' | '_parent' | '_top';
    rel?: string;
    children?: import('svelte').Snippet;
    iconBefore?: import('svelte').Snippet;
    iconAfter?: import('svelte').Snippet;
    class?: string;
  }

  let {
    href,
    variant = 'primary',
    size = 'md',
    disabled = false,
    target,
    rel,
    children,
    iconBefore,
    iconAfter,
    class: className = ''
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] no-underline gap-2';

  const computedRel = $derived(target === '_blank' ? (rel || 'noopener noreferrer') : rel);
</script>

<a
  href={disabled ? undefined : href}
  {target}
  rel={computedRel}
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled ? disabledClasses : ''} {className}"
>
  {#if iconBefore}
    <span class="inline-flex items-center justify-center">
      {@render iconBefore()}
    </span>
  {/if}
  {@render children?.()}
  {#if iconAfter}
    <span class="inline-flex items-center justify-center">
      {@render iconAfter()}
    </span>
  {/if}
</a>
