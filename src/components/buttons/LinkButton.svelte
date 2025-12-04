<script lang="ts">
  import { variantClasses, sizeClasses } from './buttonClasses';

  interface Props {
    href: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    target?: '_self' | '_blank' | '_parent' | '_top';
    rel?: string;
    children?: import('svelte').Snippet;
    icon?: import('svelte').Snippet;
    iconPosition?: 'before' | 'after';
    iconBefore?: import('svelte').Snippet;
    iconAfter?: import('svelte').Snippet;
  }

  let {
    href,
    variant = 'primary',
    size = 'md',
    disabled = false,
    target,
    rel,
    children,
    icon,
    iconPosition = 'before',
    iconBefore,
    iconAfter
  }: Props = $props();

  // If icon is provided without iconBefore/iconAfter, use iconPosition
  const displayIconBefore = $derived(iconBefore || (icon && iconPosition === 'before' ? icon : undefined));
  const displayIconAfter = $derived(iconAfter || (icon && iconPosition === 'after' ? icon : undefined));

  const baseClasses = 'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] no-underline';
  const disabledClasses = 'opacity-50 pointer-events-none';

  const computedRel = $derived(target === '_blank' ? (rel || 'noopener noreferrer') : rel);
</script>

<a
  href={disabled ? undefined : href}
  {target}
  rel={computedRel}
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled ? disabledClasses : ''}"
>
  {#if displayIconBefore}
    <span class="inline-flex items-center justify-center">
      {@render displayIconBefore()}
    </span>
  {/if}
  {@render children?.()}
  {#if displayIconAfter}
    <span class="inline-flex items-center justify-center">
      {@render displayIconAfter()}
    </span>
  {/if}
</a>
