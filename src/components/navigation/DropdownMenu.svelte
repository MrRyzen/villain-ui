<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open?: boolean;
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    trigger?: Snippet;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    placement = 'bottom-start',
    trigger,
    children
  }: Props = $props();

  let menuElement: HTMLDivElement;
  let wrapperElement: HTMLDivElement;

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2'
  };

  function toggleMenu() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (menuElement && !wrapperElement.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  $effect(() => {
    if (open) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  });
</script>

<div bind:this={wrapperElement} class="relative">
  <button
    type="button"
    onclick={toggleMenu}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    }}
    class="bg-transparent border-none p-0 cursor-pointer"
  >
    {@render trigger?.()}
  </button>

  {#if open}
    <div
      bind:this={menuElement}
      class="absolute {placementClasses[placement]} z-50 glass-panel rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-up_0.2s_var(--ease-luxe)]"
    >
      {@render children?.()}
    </div>
  {/if}
</div>
