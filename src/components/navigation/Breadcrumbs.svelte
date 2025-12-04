<script lang="ts">
  import type { Snippet } from 'svelte';

  interface BreadcrumbItem {
    label: string;
    href?: string;
    onclick?: () => void;
    icon?: Snippet;
  }

  interface Props {
    items: BreadcrumbItem[];
    separator?: string;
    separatorIcon?: Snippet;
  }

  let {
    items,
    separator = '/',
    separatorIcon
  }: Props = $props();
</script>

<nav role="navigation" aria-label="Breadcrumb">
  <ol class="flex items-center gap-2">
    {#each items as item, index}
      <li class="flex items-center gap-2">
        {#if item.href}
          <a
            href={item.href}
            class="flex items-center gap-2 text-sm font-[var(--font-body)] text-[var(--color-text-soft)] hover:text-[var(--color-accent)] hover:underline transition-colors duration-200 ease-[var(--ease-luxe)]"
          >
            {#if item.icon}
              <span class="inline-flex items-center justify-center">
                {@render item.icon()}
              </span>
            {/if}
            {item.label}
          </a>
        {:else if item.onclick}
          <button
            onclick={item.onclick}
            class="flex items-center gap-2 text-sm font-[var(--font-body)] text-[var(--color-text-soft)] hover:text-[var(--color-accent)] hover:underline transition-colors duration-200 ease-[var(--ease-luxe)] cursor-pointer"
          >
            {#if item.icon}
              <span class="inline-flex items-center justify-center">
                {@render item.icon()}
              </span>
            {/if}
            {item.label}
          </button>
        {:else}
          <span class="flex items-center gap-2 text-sm font-[var(--font-body)] {index === items.length - 1 ? 'text-[var(--color-text)]' : 'text-[var(--color-text-soft)]'}">
            {#if item.icon}
              <span class="inline-flex items-center justify-center">
                {@render item.icon()}
              </span>
            {/if}
            {item.label}
          </span>
        {/if}

        {#if index < items.length - 1}
          <span class="text-[var(--color-text-muted)] text-sm" aria-hidden="true">
            {#if separatorIcon}
              {@render separatorIcon()}
            {:else}
              {separator}
            {/if}
          </span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
