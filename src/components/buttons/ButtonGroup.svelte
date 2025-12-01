<script lang="ts">
  interface Props {
    orientation?: 'horizontal' | 'vertical';
    spacing?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    orientation = 'horizontal',
    spacing = false,
    children
  }: Props = $props();

  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const mergedBorderClasses = {
    horizontal: '[&>*:not(:first-child)]:ml-[-1px] [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none',
    vertical: '[&>*:not(:first-child)]:mt-[-1px] [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none'
  };

  const spacingClasses = 'gap-2';
  const baseClasses = 'flex bg-transparent';
</script>

<div class="{baseClasses} {orientationClasses[orientation]} {spacing ? spacingClasses : mergedBorderClasses[orientation]}">
  {@render children?.()}
</div>
