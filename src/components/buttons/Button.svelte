<script lang="ts">
  import { variantClasses, sizeClasses } from './buttonClasses';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    href,
    target,
    onclick,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer no-underline';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`);
</script>

{#if href}
  <a
    {href}
    {target}
    onclick={onclick}
    class={classes}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    {type}
    {disabled}
    onclick={onclick}
    class={classes}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
