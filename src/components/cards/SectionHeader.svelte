<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    glow?: boolean;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    children?: Snippet;
  }

  let {
    title,
    level = 2,
    glow = true,
    subtitle,
    align = 'left',
    children
  }: Props = $props();

  const headingTag = $derived(`h${level}`);
  const glowClasses = $derived(glow ? 'text-glow' : '');
  const alignClasses = $derived(`text-${align}`);

  const headingClasses = $derived(`font-[var(--font-heading)] text-[length:var(--text-h${level}-size)] font-[number:var(--text-h${level}-weight)] leading-[var(--text-h${level}-line-height)] text-[var(--color-text)] ${glowClasses} ${alignClasses}`);
  const subtitleClasses = $derived(`mt-2 font-[var(--font-body)] text-[length:var(--text-body-size)] text-[var(--color-text-soft)] ${alignClasses}`);
</script>

<div class="mb-8">
  <svelte:element this={headingTag} class={headingClasses}>
    {#if title}
      {title}
    {:else}
      {@render children?.()}
    {/if}
  </svelte:element>

  {#if subtitle}
    <p class={subtitleClasses}>
      {subtitle}
    </p>
  {/if}
</div>
