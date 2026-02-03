<script lang="ts">
  import { createId } from '../../lib/internal/id.js';

  /**
   * FileUpload component props.
   *
   * The `onchange` callback receives an event object with the following shape:
   * `{ target: { files: FileList } }` for both drag-and-drop and click-based selection.
   */
  interface Props {
    files?: FileList | null;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    error?: boolean;
    label?: string;
    id?: string;
    name?: string;
    onchange?: (event: { target: { files: FileList } }) => void;
    icon?: import('svelte').Snippet;
    validationMessage?: string;
  }

  let {
    files = $bindable(null),
    accept,
    multiple = false,
    disabled = false,
    error = false,
    label,
    id = createId('file-upload'),
    name,
    onchange,
    icon,
    validationMessage
  }: Props = $props();

  const hasError = $derived(error || !!validationMessage);

  let isDragging = $state(false);
  let inputElement: HTMLInputElement;

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (!disabled) {
      isDragging = true;
    }
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    
    if (!disabled && event.dataTransfer?.files) {
      files = event.dataTransfer.files;
      if (onchange) {
        // Call onchange directly with synthetic event object
        onchange({ target: { files: event.dataTransfer.files } });
      }
    }
  }

  function handleClick() {
    if (!disabled) {
      inputElement?.click();
    }
  }

  function handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (onchange && input.files) {
      // Call onchange with consistent event shape
      onchange({ target: { files: input.files } });
    }
  }

  const fileList = $derived(files ? Array.from(files) : []);
</script>

<div>
  {#if label}
    <div class="text-text-soft text-sm mb-2 block">
      {label}
    </div>
  {/if}
  
  <input
    type="file"
    {id}
    name={name}
    {accept}
    {multiple}
    {disabled}
    bind:this={inputElement}
    bind:files
    onchange={handleInputChange}
    class="hidden"
  />
  
  <div
    role="button"
    tabindex={disabled ? -1 : 0}
    aria-label="Click or drag files to upload"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={handleClick}
    onkeydown={(e) => e.key === 'Enter' && handleClick()}
    class="panel-raised rounded-[var(--radius-lg)] p-8 text-center cursor-pointer transition-all duration-300 ease-luxe {isDragging ? 'border-2 border-accent accent-glow bg-base-2' : ''} {hasError && !isDragging ? 'border-2 border-error' : ''} {disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}"
  >
    <div class="flex flex-col items-center gap-2">
      {#if icon}
        <span class="inline-flex items-center justify-center text-text-soft">
          {@render icon()}
        </span>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-text-soft"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      {/if}
      
      <div>
        <p class="text-text text-sm font-medium">
          Click to upload or drag and drop
        </p>
        <p class="text-text-muted text-xs mt-1">
          {accept ? `Accepted formats: ${accept}` : 'Any file type'}
        </p>
      </div>
    </div>
  </div>

  {#if fileList.length > 0}
    <div class="mt-4">
      <p class="text-text-soft text-xs mb-2">
        Selected files:
      </p>
      <ul class="space-y-1">
        {#each fileList as file}
          <li class="text-text text-xs flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>{file.name}</span>
            <span class="text-text-muted">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if validationMessage}
    <p class="text-error text-xs mt-1.5">{validationMessage}</p>
  {/if}
</div>
