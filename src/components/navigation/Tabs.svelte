/**
 * Tabs Component
 * 
 * Accessibility:
 * - Keyboard: Arrow Left/Right to navigate tabs, Home/End for first/last
 * - ARIA: role="tablist", role="tab", aria-selected, aria-disabled
 * - Focus: Roving tabindex pattern (only active tab is focusable)
 * - Screen readers: Tab labels announced with selection state
 */
<script lang="ts">

  interface Tab {
    id: string;
    label: string;
    iconBefore?: import('svelte').Snippet;
    disabled?: boolean;
  }

  export interface Props {
    tabs: Tab[];
    activeTab?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'pills';
    ontabchange?: (tabId: string) => void;
    class?: string;
  }

  let {
    tabs,
    activeTab = $bindable(''),
    orientation = 'horizontal',
    variant = 'default',
    ontabchange,
    class: className = ''
  }: Props = $props();

  function handleTabClick(tabId: string, disabled?: boolean) {
    if (disabled) return;
    activeTab = tabId;
    if (ontabchange) {
      ontabchange(tabId);
    }
  }

  function handleKeyDown(event: KeyboardEvent, currentTabId: string) {
    const enabledTabs = tabs.filter(tab => !tab.disabled);
    const currentIndex = enabledTabs.findIndex(tab => tab.id === currentTabId);
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        if (orientation !== 'horizontal') return;
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        break;
      case 'ArrowRight':
        if (orientation !== 'horizontal') return;
        event.preventDefault();
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        if (orientation !== 'vertical') return;
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        break;
      case 'ArrowDown':
        if (orientation !== 'vertical') return;
        event.preventDefault();
        nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = enabledTabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      handleTabClick(nextTab.id);
      requestAnimationFrame(() => {
        const button = document.querySelector(`[role="tab"][aria-selected="true"]`) as HTMLElement;
        button?.focus();
      });
    }
  }

  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const radiusClass = variant === 'pills' ? 'rounded-pill' : 'rounded-[var(--radius-md)]';
</script>

<div role="tablist" class="{orientationClasses[orientation]} gap-1 p-1 {className}">
  {#each tabs as tab}
    <button
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-disabled={tab.disabled}
      tabindex={activeTab === tab.id ? 0 : -1}
      onclick={() => handleTabClick(tab.id, tab.disabled)}
      onkeydown={(e) => handleKeyDown(e, tab.id)}
      disabled={tab.disabled}
      class="flex items-center gap-2 px-6 py-3 {radiusClass} font-body text-sm transition-all duration-300 ease-luxe {activeTab === tab.id ? 'bg-accent text-text accent-glow' : 'text-text-soft hover:bg-base-3'} {tab.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}"
    >
      {#if tab.iconBefore}
        <span class="inline-flex items-center justify-center">
          {@render tab.iconBefore()}
        </span>
      {/if}
      {tab.label}
    </button>
  {/each}
</div>
