<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    dismissible?: boolean;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    variant = 'info',
    title,
    dismissible = false,
    onclose,
    children
  }: Props = $props();

  let visible = $state(true);

  const variantClasses = {
    info: 'border-l-4 border-accent',
    success: 'border-l-4 border-success',
    warning: 'border-l-4 border-warning',
    error: 'border-l-4 border-error'
  };

  const variantTextClasses = {
    info: 'text-accent-soft',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error'
  };

  const variantIcons = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
  };

  const roleMap = {
    info: 'status',
    success: 'status',
    warning: 'alert',
    error: 'alert'
  };

  const ariaLiveMap = {
    info: 'polite',
    success: 'polite',
    warning: 'polite',
    error: 'assertive'
  } satisfies Record<'info' | 'success' | 'warning' | 'error', 'polite' | 'assertive'>;

  function handleClose() {
    visible = false;
    onclose?.();
  }
</script>

{#if visible}
  <div
    class="glass-panel rounded-lg p-4 flex gap-3 {variantClasses[variant]} animate-[fade-in_0.2s_var(--ease-luxe)]"
    role={roleMap[variant]}
    aria-live={ariaLiveMap[variant]}
  >
    <div class="shrink-0 {variantTextClasses[variant]}">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={variantIcons[variant]} />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      {#if title}
        <h4 class="font-semibold text-text mb-1">
          {title}
        </h4>
      {/if}
      <div class="text-sm text-text-soft">
        {@render children?.()}
      </div>
    </div>

    {#if dismissible}
      <button
        type="button"
        onclick={handleClose}
        class="shrink-0 text-text-soft hover:text-text transition-colors"
        aria-label="Dismiss alert"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
{/if}
