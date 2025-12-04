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
    icon?: import('svelte').Snippet;
    iconPosition?: 'before' | 'after';
    iconBefore?: import('svelte').Snippet;
    iconAfter?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    class?: string;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    href,
    target,
    onclick,
    icon,
    iconPosition = 'before',
    iconBefore,
    iconAfter,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  // If icon is provided without iconBefore/iconAfter, use iconPosition
  const displayIconBefore = $derived(iconBefore || (icon && iconPosition === 'before' ? icon : undefined));
  const displayIconAfter = $derived(iconAfter || (icon && iconPosition === 'after' ? icon : undefined));

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
    {#if displayIconBefore}
      <span class="inline-flex items-center justify-center">
        {@render displayIconBefore()}
      </span>
    {/if}
    {#if children}
      {@render children()}
    {/if}
    {#if displayIconAfter}
      <span class="inline-flex items-center justify-center">
        {@render displayIconAfter()}
      </span>
    {/if}
  </a>
{:else}
  <button
    {type}
    {disabled}
    onclick={onclick}
    class={classes}
    {...restProps}
  >
    {#if displayIconBefore}
      <span class="inline-flex items-center justify-center">
        {@render displayIconBefore()}
      </span>
    {/if}
    {#if children}
      {@render children()}
    {/if}
    {#if displayIconAfter}
      <span class="inline-flex items-center justify-center">
        {@render displayIconAfter()}
      </span>
    {/if}
  </button>
{/if}
