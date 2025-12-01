<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    shape?: 'circle' | 'square';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    ariaLabel: string;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'ghost',
    size = 'md',
    shape = 'circle',
    disabled = false,
    type = 'button',
    ariaLabel,
    onclick,
    children
  }: Props = $props();

  const variantClasses = {
    primary: 'bg-[var(--color-accent)] text-[var(--color-text)] accent-glow',
    secondary: 'bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-base-2)]'
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const shapeClasses = {
    circle: 'rounded-[var(--radius-pill)]',
    square: 'rounded-[var(--radius-lg)]'
  };

  const baseClasses = 'inline-flex items-center justify-center font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer hover-lift';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
</script>

<button
  {type}
  {disabled}
  aria-label={ariaLabel}
  onclick={onclick}
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {shapeClasses[shape]} {disabled ? disabledClasses : ''}"
>
  {@render children?.()}
</button>
