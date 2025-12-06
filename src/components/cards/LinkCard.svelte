<script lang="ts">
  import Card from './Card.svelte';

  interface Props {
    href: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    class?: string;
    children?: import('svelte').Snippet;
    header?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
    icon?: import('svelte').Snippet;
  }

  let {
    href,
    target,
    rel,
    padding = 'md',
    class: className = '',
    children,
    header,
    footer,
    icon,
    ...restProps
  }: Props = $props();
</script>

<Card 
  {href} 
  liftOnHover={true} 
  {target} 
  {rel} 
  {padding} 
  class={className}
  {header}
  {footer}
  {icon}
  {...restProps}
>
  {@render children?.()}
</Card>
