<script lang="ts">
  import type { Snippet } from 'svelte';

  interface CarouselItem {
    id: string;
    content: Snippet | string;
  }

  interface Props {
    items: CarouselItem[];
    currentIndex?: number;
    autoplay?: boolean;
    autoplayInterval?: number;
    showDots?: boolean;
    showArrows?: boolean;
  }

  let {
    items,
    currentIndex = $bindable(0),
    autoplay = false,
    autoplayInterval = 3000,
    showDots = true,
    showArrows = true
  }: Props = $props();

  let startX = $state(0);
  let currentX = $state(0);
  let isDragging = $state(false);

  function goToNext() {
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % items.length;
  }

  function goToPrev() {
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
  }

  function goToIndex(index: number) {
    if (items.length === 0 || index < 0 || index >= items.length) return;
    currentIndex = index;
  }

  function handleTouchStart(event: TouchEvent) {
    isDragging = true;
    startX = event.touches[0].clientX;
    currentX = startX;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDragging) return;
    currentX = event.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    if (!items.length) {
      isDragging = false;
      return;
    }
    isDragging = false;

    const diff = startX - currentX;
    const threshold = 50;

    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrev();
    }

    startX = 0;
    currentX = 0;
  }

  $effect(() => {
    if (!autoplay || items.length < 2) return;

    const interval = setInterval(goToNext, autoplayInterval);

    return () => {
      clearInterval(interval);
    };
  });

  // Clamp currentIndex when items change
  $effect(() => {
    if (items.length && (currentIndex < 0 || currentIndex >= items.length)) {
      currentIndex = 0;
    }
  });
</script>

<div class="relative">
  <div class="panel-raised rounded-[var(--radius-lg)] overflow-hidden">
    <div
      class="flex transition-transform duration-300 ease-luxe"
      style="transform: translateX(-{currentIndex * 100}%);"
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
    >
    {#each items as item (item.id)}
      <div class="min-w-full flex items-center justify-center p-8">
        {#if typeof item.content === 'string'}
          <div class="text-text">{item.content}</div>
        {:else}
          {@render item.content()}
        {/if}
      </div>
    {/each}
    </div>
  </div>

  {#if showArrows && items.length}
    <button
      type="button"
      onclick={goToPrev}
      class="absolute left-2 top-1/2 -translate-y-1/2 obsidian-surface metal-edge rounded-full p-2 text-text hover:accent-glow transition-all"
      aria-label="Previous item"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <button
      type="button"
      onclick={goToNext}
      class="absolute right-2 top-1/2 -translate-y-1/2 obsidian-surface metal-edge rounded-full p-2 text-text hover:accent-glow transition-all"
      aria-label="Next item"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  {/if}

  {#if showDots && items.length}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {#each items as item, index (item.id)}
        <button
          type="button"
          onclick={() => goToIndex(index)}
          class="w-2 h-2 rounded-full transition-all {index === currentIndex ? 'accent-glow bg-accent w-8' : 'bg-text-muted'}"
          aria-label="Go to item {index + 1}"
        >
        </button>
      {/each}
    </div>
  {/if}
</div>
