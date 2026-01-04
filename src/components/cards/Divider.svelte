<script lang="ts">
  interface Props {
    orientation?: 'horizontal' | 'vertical';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    thickness?: 'thin' | 'normal' | 'thick';
    variant?: 'default' | 'strong';
    height?: string; // Custom height for vertical dividers (e.g., '100px', '2rem')
    class?: string;
  }

  let {
    orientation = 'horizontal',
    spacing = 'md',
    thickness = 'normal',
    variant = 'default',
    height,
    class: className = '',
    ...restProps
  }: Props = $props();

  const horizontalThicknessMap = {
    thin: 'border-t-[1px]',
    normal: 'border-t-[1px]',
    thick: 'border-t-[2px]'
  };

  const verticalThicknessMap = {
    thin: 'border-l-[1px]',
    normal: 'border-l-[1px]',
    thick: 'border-l-[2px]'
  };

  const horizontalSpacing = {
    none: 'my-0',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6'
  };

  const verticalSpacing = {
    none: 'mx-0',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6'
  };

  const borderColor = variant === 'strong' ? 'border-[var(--color-border-strong)]' : 'border-[var(--color-border)]';

  const horizontalClasses = `w-full ${horizontalThicknessMap[thickness]} ${borderColor} ${horizontalSpacing[spacing]} ${className}`;
  const verticalClasses = `self-stretch ${verticalThicknessMap[thickness]} ${borderColor} ${verticalSpacing[spacing]} ${className}`;

  // For vertical dividers, use custom height or default min-height
  const verticalStyle = height ? `height: ${height}` : 'min-height: 2rem';
</script>

{#if orientation === 'horizontal'}
  <hr class={horizontalClasses} {...restProps} />
{:else}
  <div class={verticalClasses} style={verticalStyle} {...restProps}></div>
{/if}
