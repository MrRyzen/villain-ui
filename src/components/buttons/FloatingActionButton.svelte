<script lang="ts">
  interface Props {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size?: 'md' | 'lg';
    disabled?: boolean;
    ariaLabel: string;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    position = 'bottom-right',
    size = 'lg',
    disabled = false,
    ariaLabel,
    onclick,
    children
  }: Props = $props();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    md: 'w-16 h-16 text-base',
    lg: 'w-18 h-18 text-lg'
  };

  const baseClasses = 'fixed z-50 flex items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-accent)] text-[var(--color-text)] accent-glow hover-lift shadow-[var(--shadow-deep)] transition-all duration-300 ease-[var(--ease-luxe)] cursor-pointer animate-[glow-pulse_3s_ease-in-out_infinite] hover:scale-110';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
</script>

<button
  type="button"
  {disabled}
  aria-label={ariaLabel}
  onclick={onclick}
  class="{baseClasses} {positionClasses[position]} {sizeClasses[size]} {disabled ? disabledClasses : ''}"
>
  {@render children?.()}
</button>
