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
  }

  let {
    href,
    variant = 'primary',
    size = 'md',
    disabled = false,
    target,
    rel,
    children
  }: Props = $props();

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
  {@render children?.()}
</a>
