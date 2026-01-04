<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface Props {
    open?: boolean;
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    closeOnClickOutside?: boolean;
    trigger?: Snippet;
    children?: Snippet;
  }

  let {
    open = $bindable(false),
    placement = 'bottom-start',
    closeOnClickOutside = true,
    trigger,
    children
  }: Props = $props();

  let dropdownElement = $state<HTMLDivElement>();
  let wrapperElement = $state<HTMLDivElement>();

  const dropdownId = createId('dropdown');

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top-end': 'bottom-full right-0 mb-2'
  };

  function toggleOpen() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (closeOnClickOutside && dropdownElement && wrapperElement && !wrapperElement.contains(event.target as Node)) {
      open = false;
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  $effect(() => {
    if (typeof document === 'undefined') return;
    
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

<div bind:this={wrapperElement} class="relative inline-block">
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={toggleOpen}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); } }}
    aria-haspopup="true"
    aria-expanded={open}
    aria-controls={open ? dropdownId : undefined}
    class="inline-block"
  >
    {@render trigger?.()}
  </div>

  {#if open}
    <div
      bind:this={dropdownElement}
      id={dropdownId}
      class="absolute {placementClasses[placement]} z-[var(--z-50)] panel-floating rounded-[var(--radius-lg)] shadow-[var(--shadow-deep)] min-w-[12rem] animate-[fade-up_0.2s_var(--ease-luxe)]"
      role="menu"
    >
      {@render children?.()}
    </div>
  {/if}
</div>
