<script lang="ts">
  import { variantClasses, sizeClasses, disabledClasses } from './buttonClasses';

  export interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
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
    onclick,
    iconBefore,
    iconAfter,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer gap-2';
  const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? disabledClasses : ''} ${className}`);
</script>

<button
  {type}
  {disabled}
  onclick={onclick}
  class={classes}
  {...restProps}
>
  {#if iconBefore}
    <span class="inline-flex items-center justify-center">
      {@render iconBefore()}
    </span>
  {/if}
  {#if children}
    {@render children()}
  {/if}
  {#if iconAfter}
    <span class="inline-flex items-center justify-center">
      {@render iconAfter()}
    </span>
  {/if}
</button>
