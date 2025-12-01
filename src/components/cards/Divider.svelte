<script lang="ts">
  interface Props {
    orientation?: 'horizontal' | 'vertical';
    spacing?: 'none' | 'sm' | 'md' | 'lg';
    thickness?: 'thin' | 'normal' | 'thick';
    variant?: 'default' | 'strong';
  }

  let {
    orientation = 'horizontal',
    spacing = 'md',
    thickness = 'normal',
    variant = 'default'
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

  const horizontalClasses = `w-full ${horizontalThicknessMap[thickness]} ${borderColor} ${horizontalSpacing[spacing]}`;
  const verticalClasses = `h-full ${verticalThicknessMap[thickness]} ${borderColor} ${verticalSpacing[spacing]}`;
</script>

{#if orientation === 'horizontal'}
  <hr class={horizontalClasses} />
{:else}
  <div class={verticalClasses}></div>
{/if}
