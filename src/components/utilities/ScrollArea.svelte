<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    height?: string;
    children?: Snippet;
  }

  let { height = '400px', children }: Props = $props();
</script>

<div
  class="overflow-y-auto"
  style="
    height: {height};
    scrollbar-width: thin;
    scrollbar-color: var(--color-accent) var(--color-base-3);
  "
>
  {@render children?.()}
</div>

<style>
  div::-webkit-scrollbar {
    width: 8px;
  }

  div::-webkit-scrollbar-track {
    background: var(--color-base-3);
    border-radius: var(--radius-sm);
  }

  div::-webkit-scrollbar-thumb {
    background: var(--color-accent);
    border-radius: var(--radius-sm);
  }

  div::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-soft);
  }
</style>
