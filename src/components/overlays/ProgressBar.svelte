<script lang="ts">
  interface Props {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
  }

  let {
    value,
    max = 100,
    size = 'md',
    showLabel = false,
    label
  }: Props = $props();

  const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
</script>

<div
  class="relative bg-[var(--color-base-3)] border border-[var(--color-border)] rounded-[var(--radius-pill)] overflow-hidden shadow-[var(--shadow-deep)] {heightClasses[size]}"
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin="0"
  aria-valuemax={max}
  aria-label={label || `${percentage.toFixed(0)}% complete`}
>
  <div
    class="h-full bg-[var(--color-accent)] accent-glow transition-all duration-500 ease-[var(--ease-luxe)]"
    style="width: {percentage}%"
  />

  {#if showLabel}
    <div class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[var(--color-text)] text-glow">
      {label || `${percentage.toFixed(0)}%`}
    </div>
  {/if}
</div>
