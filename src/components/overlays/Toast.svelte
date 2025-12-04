<script lang="ts">
  interface Props {
    message: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    dismissible?: boolean;
    onclose?: () => void;
    /** Index in toast stack for vertical offset. Pass the toast's position in a list to enable stacking. */
    index?: number;
    icon?: import('svelte').Snippet;
  }

  let {
    message,
    variant = 'info',
    duration = 3000,
    position = 'bottom-right',
    dismissible = true,
    onclose,
    index = 0,
    icon
  }: Props = $props();

  let visible = $state(true);
  let isExiting = $state(false);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };

  const variantBorderClasses = {
    info: 'border-l-4 border-[var(--color-accent)]',
    success: 'border-l-4 border-[var(--color-success)]',
    warning: 'border-l-4 border-[var(--color-warning)]',
    error: 'border-l-4 border-[var(--color-error)]'
  };

  const variantIconClasses = {
    info: 'text-[var(--color-accent-soft)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    error: 'text-[var(--color-error)]'
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

  const animationClasses = $derived(
    position.startsWith('bottom')
      ? 'animate-[fade-up_0.3s_var(--ease-luxe)]'
      : 'animate-[fade-in_0.3s_var(--ease-luxe)]'
  );

  const stackOffset = $derived(
    position.startsWith('bottom')
      ? `translateY(-${index * 5}rem)`
      : `translateY(${index * 5}rem)`
  );

  function handleClose() {
    if (isExiting || !visible) return; // Prevent double-close
    isExiting = true;
    setTimeout(() => {
      visible = false;
      onclose?.();
    }, 200); // Match fade-out animation duration
  }

  $effect(() => {
    // Only auto-dismiss if toast is visible and duration is set
    if (visible && !isExiting && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  });
</script>

{#if visible}
  <div
    class="fixed z-[100] {positionClasses[position]} {isExiting ? 'animate-[fade-out_0.2s_var(--ease-sharp)]' : animationClasses}"
    style="transform: {stackOffset}"
  >
    <div
      class="glass-panel rounded-[var(--radius-lg)] p-4 min-w-[20rem] max-w-md flex gap-3 items-start {variantBorderClasses[variant]}"
      role={roleMap[variant]}
      aria-live={ariaLiveMap[variant]}
      aria-atomic="true"
    >
      <div class="flex-shrink-0 {variantIconClasses[variant]}">
        {#if icon}
          {@render icon()}
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={variantIcons[variant]} />
          </svg>
        {/if}
      </div>

      <div class="flex-1 text-sm text-[var(--color-text)]">
        {message}
      </div>

      {#if dismissible}
        <button
          type="button"
          onclick={handleClose}
          class="flex-shrink-0 text-[var(--color-text-soft)] hover:text-[var(--color-text)] transition-colors"
          aria-label="Dismiss notification"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
{/if}
