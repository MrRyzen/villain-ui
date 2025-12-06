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
      onclick={() => handleTabClick(tab.id, tab.disabled)}
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
