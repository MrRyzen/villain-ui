<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    open: boolean;
    title: string;
    children?: Snippet;
    onToggle?: () => void;
  }

  let { open, title, children, onToggle }: Props = $props();

  let contentElement = $state<HTMLDivElement>();
  let openLocal = $state(open);

  const headerId = createId('collapse-header');
  const contentId = createId('collapse-content');

  function toggleLocal() {
    openLocal = !openLocal;
  }

  let effectiveOpen = $derived(onToggle ? open : openLocal);
  let maxHeight = $derived(effectiveOpen && contentElement ? `${contentElement.scrollHeight}px` : '0px');
</script>

<div class="border border-border rounded-md overflow-hidden {effectiveOpen ? 'panel-raised' : ''}">
  <button
    id={headerId}
    type="button"
    onclick={onToggle ?? toggleLocal}
    class="w-full flex items-center justify-between p-4 text-left text-text font-medium hover:bg-base-3 transition-colors"
    aria-expanded={effectiveOpen}
    aria-controls={contentId}
  >
    <span>{title}</span>
    <svg
      class="w-5 h-5 transition-transform duration-300 ease-luxe {effectiveOpen ? 'rotate-180' : ''}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <div
    bind:this={contentElement}
    id={contentId}
    class="overflow-hidden transition-[max-height] duration-300 ease-luxe"
    style="max-height: {maxHeight};"
    role="region"
    aria-labelledby={headerId}
  >
    <div class="p-4 text-text-soft border-t border-border">
      {@render children?.()}
    </div>
  </div>
</div>
