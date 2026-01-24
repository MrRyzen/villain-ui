<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }

  let {
    size = 'md',
    label
  }: Props = $props();

  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };
</script>

<div
  class="inline-flex items-center justify-center"
  role="status"
  aria-live="polite"
  aria-label={label || 'Loading'}
>
  <div
    class="{sizeClasses[size]} border-[var(--color-base-3)] border-t-[var(--color-accent)] rounded-[var(--radius-pill)] accent-glow animate-spin"
  ></div>
  <span class="sr-only">{label || 'Loading'}</span>
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
