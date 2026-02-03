<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'default' | 'accent' | 'gradient';
    title?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    glow?: boolean;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    children?: Snippet;
  }

  let {
    variant = 'default',
    title,
    level = 2,
    glow = true,
    subtitle,
    align = 'left',
    children
  }: Props = $props();

  const variantClasses = {
		default: '',
		accent: 'text-accent',
		gradient: 'text-gradient'
	};

  const headingTag = $derived(`h${level}`);
	const baseClasses = $derived(
		`transition-all duration-300 ${glow ? 'text-glow' : ''} ${variantClasses[variant]}`
	);
  const alignClasses = $derived(`text-${align}`);

  const headingClasses = $derived(`font-[var(--font-heading)] text-[length:var(--text-h${level}-size)] font-[number:var(--text-h${level}-weight)] leading-[var(--text-h${level}-line-height)] text-[var(--color-text)] ${baseClasses} ${alignClasses}`);
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
