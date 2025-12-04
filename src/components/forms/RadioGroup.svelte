<script lang="ts">
  interface Props {
    value?: string;
    options: Array<{ value: string; label: string; icon?: import('svelte').Snippet }>;
    name: string;
    disabled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    label?: string;
    onchange?: (event: Event) => void;
  }

  let {
    value = $bindable(''),
    options,
    name,
    disabled = false,
    orientation = 'vertical',
    label,
    onchange
  }: Props = $props();

  const containerClasses = $derived(orientation === 'vertical' ? 'flex flex-col gap-3' : 'flex flex-row gap-4');
</script>

{#if label}
  <fieldset class={disabled ? 'opacity-50' : ''}>
    <legend class="text-[var(--color-text-soft)] text-sm mb-3 block">
      {label}
    </legend>
    <div class={containerClasses}>
      {#each options as option}
        {@const radioId = `${name}-${option.value}`}
        <label for={radioId} class="flex items-center gap-2 cursor-pointer {disabled ? 'cursor-not-allowed' : ''}">
          <input
            type="radio"
            id={radioId}
            {name}
            value={option.value}
            {disabled}
            bind:group={value}
            onchange={onchange}
            class="w-6 h-6 rounded-[var(--radius-pill)] border-2 border-[var(--color-border-strong)] bg-transparent appearance-none transition-all duration-200 ease-[var(--ease-luxe)] cursor-pointer checked:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-base-1)] relative {disabled ? 'cursor-not-allowed' : ''}"
          />
          {#if option.icon}
            <span class="inline-flex items-center justify-center text-text-soft">
              {@render option.icon()}
            </span>
          {/if}
          <span class="text-[var(--color-text)] text-sm select-none">
            {option.label}
          </span>
        </label>
      {/each}
    </div>
  </fieldset>
{:else}
  <div class={containerClasses}>
    {#each options as option}
      {@const radioId = `${name}-${option.value}`}
      <label for={radioId} class="flex items-center gap-2 cursor-pointer {disabled ? 'opacity-50 cursor-not-allowed' : ''}">
        <input
          type="radio"
          id={radioId}
          {name}
          value={option.value}
          {disabled}
          bind:group={value}
          onchange={onchange}
          class="w-6 h-6 rounded-[var(--radius-pill)] border-2 border-[var(--color-border-strong)] bg-transparent appearance-none transition-all duration-200 ease-[var(--ease-luxe)] cursor-pointer checked:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-base-1)] relative {disabled ? 'cursor-not-allowed' : ''}"
        />
        {#if option.icon}
          <span class="inline-flex items-center justify-center text-text-soft">
            {@render option.icon()}
          </span>
        {/if}
        <span class="text-[var(--color-text)] text-sm select-none">
          {option.label}
        </span>
      </label>
    {/each}
  </div>
{/if}

<style>
  input[type="radio"]:checked::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-pill);
    background: var(--color-accent);
    box-shadow: var(--shadow-accent-glow);
  }
</style>
