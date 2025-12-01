<script lang="ts">
  import type { Snippet } from 'svelte';
  import { createId } from '../../lib/internal/id.js';

  interface Command {
    id: string;
    label: string;
    icon?: Snippet;
    onSelect: () => void;
    keywords?: string[];
  }

  interface Props {
    open?: boolean;
    commands: Command[];
    placeholder?: string;
  }

  let {
    open = $bindable(false),
    commands,
    placeholder = 'Search commands...'
  }: Props = $props();

  let query = $state('');
  let selectedIndex = $state(0);
  let inputElement = $state<HTMLInputElement>();
  let previousFocus = $state<HTMLElement | null>(null);

  const paletteId = createId('command-palette');

  // Inline fuzzy matching function
  function fuzzyMatch(text: string, search: string): boolean {
    const searchChars = search.toLowerCase().split('');
    const textLower = text.toLowerCase();
    let searchIndex = 0;

    for (let i = 0; i < textLower.length && searchIndex < searchChars.length; i++) {
      if (textLower[i] === searchChars[searchIndex]) {
        searchIndex++;
      }
    }

    return searchIndex === searchChars.length;
  }

  let filteredCommands = $derived(
    query.trim() === ''
      ? commands
      : commands.filter(cmd => {
          // Match against label
          if (fuzzyMatch(cmd.label, query)) return true;

          // Match against keywords
          if (cmd.keywords) {
            return cmd.keywords.some(keyword => fuzzyMatch(keyword, query));
          }

          return false;
        })
  );

  function handleClose() {
    open = false;
    query = '';
    selectedIndex = 0;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function handleSelectCommand(command: Command) {
    command.onSelect();
    handleClose();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      if (!filteredCommands.length) return;
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
    } else if (event.key === 'ArrowUp') {
      if (!filteredCommands.length) return;
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelectCommand(filteredCommands[selectedIndex]);
      } else if (filteredCommands.length) {
        selectedIndex = 0;
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
    }
  }

  // Reset and clamp selected index when filtered commands change
  $effect(() => {
    if (filteredCommands.length === 0) {
      selectedIndex = -1;
    } else if (selectedIndex >= filteredCommands.length || selectedIndex < 0) {
      selectedIndex = 0;
    }
  });

  $effect(() => {
    if (typeof document === 'undefined') return;
    
    if (open) {
      // Store previous focus
      previousFocus = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Focus input element
      requestAnimationFrame(() => {
        inputElement?.focus();
      });

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';

        // Restore previous focus
        previousFocus?.focus();
      };
    }
  });
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 bg-overlay backdrop-blur-md animate-[fade-in_0.2s_var(--ease-luxe)]"
    onclick={handleBackdropClick}
    role="presentation"
  >
    <div
      class="glass-panel rounded-xl shadow-deep w-full max-w-[36rem] animate-[fade-up_0.3s_var(--ease-luxe)]"
      role="combobox"
      aria-expanded="true"
      aria-haspopup="listbox"
      aria-controls={paletteId}
      aria-activedescendant={selectedIndex >= 0 && selectedIndex < filteredCommands.length && filteredCommands[selectedIndex] ? `cmd-${filteredCommands[selectedIndex].id}` : undefined}
      tabindex="0"
    >
      <div class="p-4 border-b border-border">
        <input
          bind:this={inputElement}
          bind:value={query}
          type="text"
          placeholder={placeholder}
          onkeydown={handleKeyDown}
          class="w-full bg-transparent border-none outline-none text-text text-lg placeholder:text-text-muted"
          aria-autocomplete="list"
        />
      </div>

      <div
        id={paletteId}
        role="listbox"
        class="max-h-[400px] overflow-y-auto"
        style="scrollbar-width: thin; scrollbar-color: var(--color-accent) var(--color-base-3);"
      >
        {#if filteredCommands.length === 0}
          <div class="p-8 text-center text-text-muted">
            No commands found
          </div>
        {:else}
          {#each filteredCommands as command, index (command.id)}
            <button
              id="cmd-{command.id}"
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              tabindex={index === selectedIndex ? 0 : -1}
              onclick={() => handleSelectCommand(command)}
              class="w-full flex items-center gap-3 p-4 text-left text-text hover:bg-base-3 transition-colors {index === selectedIndex ? 'accent-glow bg-base-3' : ''}"
            >
              {#if command.icon}
                <div class="shrink-0">
                  {@render command.icon()}
                </div>
              {/if}
              <span>{command.label}</span>
            </button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  div[role="listbox"]::-webkit-scrollbar {
    width: 8px;
  }

  div[role="listbox"]::-webkit-scrollbar-track {
    background: var(--color-base-3);
    border-radius: var(--radius-sm);
  }

  div[role="listbox"]::-webkit-scrollbar-thumb {
    background: var(--color-accent);
    border-radius: var(--radius-sm);
  }

  div[role="listbox"]::-webkit-scrollbar-thumb:hover {
    background: var(--color-accent-soft);
  }
</style>
