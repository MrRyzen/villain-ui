<script lang="ts">
  interface Props {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string;
    height?: string;
    count?: number;
  }

  let {
    variant = 'rectangular',
    width,
    height,
    count = 1
  }: Props = $props();

  const defaultDimensions = {
    text: { width: '100%', height: '1rem' },
    circular: { width: '3rem', height: '3rem' },
    rectangular: { width: '100%', height: '8rem' }
  };

  const roundingClasses = {
    text: 'rounded-[var(--radius-sm)]',
    circular: 'rounded-[var(--radius-pill)]',
    rectangular: 'rounded-[var(--radius-lg)]'
  };

  const finalWidth = width || defaultDimensions[variant].width;
  const finalHeight = height || defaultDimensions[variant].height;
</script>

<div
  aria-busy="true"
  aria-live="polite"
  aria-label="Loading content"
>
  {#if variant === 'text'}
    {#each Array(count) as _, i}
      <div
        class="bg-[var(--color-base-3)] border border-[var(--color-border)] {roundingClasses[variant]} mb-2 skeleton-shimmer"
        style="width: {i === count - 1 ? '80%' : finalWidth}; height: {finalHeight};"
      />
    {/each}
  {:else}
    <div
      class="bg-[var(--color-base-3)] border border-[var(--color-border)] {roundingClasses[variant]} skeleton-shimmer"
      style="width: {finalWidth}; height: {finalHeight};"
    />
  {/if}
</div>

<style>
  .skeleton-shimmer {
    position: relative;
    overflow: hidden;
  }

  .skeleton-shimmer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(107, 33, 168, 0.1),
      transparent
    );
    animation: shimmer 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
