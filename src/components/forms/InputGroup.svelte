<script lang="ts">
  // No props needed for standard slot usage
</script>

<div class="flex items-stretch rounded-[var(--radius-lg)] overflow-hidden glass-panel [&>*:not(:first-child)]:ml-[-1px] [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none">
  <slot />
</div>
