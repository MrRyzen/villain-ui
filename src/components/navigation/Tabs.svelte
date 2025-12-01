<script lang="ts">

  interface Tab {
    id: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    orientation?: 'horizontal' | 'vertical';
    variant?: 'default' | 'pills';
    onTabChange?: (tabId: string) => void;
  }

  let {
    tabs,
    activeTab = $bindable(''),
    orientation = 'horizontal',
    variant = 'default',
    onTabChange
  }: Props = $props();

  function handleTabClick(tabId: string, disabled?: boolean) {
    if (disabled) return;
    activeTab = tabId;
    if (onTabChange) {
      onTabChange(tabId);
    }
  }

  const orientationClasses = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col'
  };

  const radiusClass = variant === 'pills' ? 'rounded-pill' : 'rounded-md';
</script>

<div role="tablist" class="{orientationClasses[orientation]} gap-1 p-1">
  {#each tabs as tab}
    <button
      role="tab"
      aria-selected={activeTab === tab.id}
      aria-disabled={tab.disabled}
      onclick={() => handleTabClick(tab.id, tab.disabled)}
      disabled={tab.disabled}
      class="px-4 py-2 {radiusClass} font-body text-sm transition-all duration-300 ease-luxe {activeTab === tab.id ? 'bg-accent text-text accent-glow' : 'text-text-soft hover:bg-base-3'} {tab.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}"
    >
      {tab.label}
    </button>
  {/each}
</div>
