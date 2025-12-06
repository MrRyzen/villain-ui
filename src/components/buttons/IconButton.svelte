<script lang="ts">
  import { variantClasses, disabledClasses } from './buttonClasses';

  export interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    shape?: 'circle' | 'square';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel: string;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
    class?: string;
  }

  let {
    variant = 'ghost',
    size = 'md',
    shape = 'circle',
    disabled = false,
    type = 'button',
    ariaLabel,
    onclick,
    children,
    class: className = ''
  }: Props = $props();

  const iconSizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg'
  };

  const shapeClasses = {
    circle: 'rounded-[var(--radius-pill)]',
    square: 'rounded-[var(--radius-lg)]'
  };

  const baseClasses = 'inline-flex items-center justify-center font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer hover-lift';
</script>

<button
  {type}
  {disabled}
  aria-label={ariaLabel}
  onclick={onclick}
  class="{baseClasses} {variantClasses[variant]} {iconSizeClasses[size]} {shapeClasses[shape]} {disabled ? disabledClasses : ''} {className}"
>
  {@render children?.()}
</button>
