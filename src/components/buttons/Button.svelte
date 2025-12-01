<script lang="ts">
  import { variantClasses, sizeClasses } from './buttonClasses';

  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    onclick,
    children
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center rounded-[var(--radius-lg)] font-[var(--font-body)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
</script>

<button
  {type}
  {disabled}
  onclick={onclick}
  class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {disabled ? disabledClasses : ''}"
>
  {@render children?.()}
</button>
