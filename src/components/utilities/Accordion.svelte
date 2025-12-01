<script lang="ts">
  import type { Snippet } from 'svelte';
  import Collapse from './Collapse.svelte';

  interface AccordionItem {
    id: string;
    title: string;
    content: string | Snippet;
  }

  interface Props {
    items: AccordionItem[];
    openItems?: string | string[];
    mode?: 'single' | 'multiple';
  }

  let { items, openItems = $bindable([]), mode = 'single' }: Props = $props();

  // Normalize openItems to array
  let openItemsArray = $derived(
    mode === 'single'
      ? typeof openItems === 'string'
        ? [openItems]
        : []
      : Array.isArray(openItems)
        ? openItems
        : []
  );

  function isItemOpen(id: string): boolean {
    return openItemsArray.includes(id);
  }

  function toggleItem(id: string) {
    if (mode === 'single') {
      // Single mode: only one item open at a time
      if (isItemOpen(id)) {
        openItems = '';
      } else {
        openItems = id;
      }
    } else {
      // Multiple mode: toggle independently
      if (isItemOpen(id)) {
        openItems = openItemsArray.filter(itemId => itemId !== id);
      } else {
        openItems = [...openItemsArray, id];
      }
    }
  }
</script>

<div class="space-y-2">
  {#each items as item (item.id)}
    <Collapse
      title={item.title}
      open={isItemOpen(item.id)}
      onToggle={() => toggleItem(item.id)}
    >
      {#if typeof item.content === 'string'}
        {item.content}
      {:else}
        {@render item.content()}
      {/if}
    </Collapse>
  {/each}
</div>
