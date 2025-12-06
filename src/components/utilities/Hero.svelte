<script lang="ts">
  interface Props {
    title?: import('svelte').Snippet;
    text?: import('svelte').Snippet;
    features?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    class?: string;
  }

  let {
    title,
    text,
    features,
    children,
    class: className = '',
    ...restProps
  }: Props = $props();
</script>

<div class="hero-section {className}" {...restProps}>
  {#if title}
    <div class="mb-4">
      {@render title()}
    </div>
  {/if}

  {#if text}
    <div class="mb-8 mx-auto max-w-3xl">
      {@render text()}
    </div>
  {/if}

  {#if features}
    <div class="feature-tags">
      {@render features()}
    </div>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>
