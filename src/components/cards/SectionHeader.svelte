<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    glow?: boolean;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    children?: Snippet;
  }

  let {
    level = 2,
    glow = true,
    subtitle,
    align = 'left',
    children
  }: Props = $props();

  const headingTag = `h${level}`;
  const glowClasses = glow ? 'text-glow' : '';
  const alignClasses = `text-${align}`;
  
  const headingClasses = `font-[var(--font-heading)] text-[length:var(--text-h${level}-size)] font-[number:var(--text-h${level}-weight)] leading-[var(--text-h${level}-line-height)] text-[var(--color-text)] ${glowClasses} ${alignClasses}`;
  const subtitleClasses = `mt-2 font-[var(--font-body)] text-[length:var(--text-body-size)] text-[var(--color-text-soft)] ${alignClasses}`;
</script>

<div class="mb-8">
  <svelte:element this={headingTag} class={headingClasses}>
    {@render children?.()}
  </svelte:element>

  {#if subtitle}
    <p class={subtitleClasses}>
      {subtitle}
    </p>
  {/if}
</div>
