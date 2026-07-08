<script lang="ts">
	interface Props {
		title?: string;
		message?: string;
		/** Icon or illustration shown above the title. */
		icon?: import('svelte').Snippet;
		/** Call-to-action area (typically a Button or LinkButton). */
		action?: import('svelte').Snippet;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { title, message, icon, action, size = 'md', class: className = '' }: Props = $props();

	const sizeClasses = {
		sm: 'py-6 gap-2',
		md: 'py-12 gap-3',
		lg: 'py-20 gap-4'
	};

	const iconSizeClasses = {
		sm: 'text-3xl',
		md: 'text-5xl',
		lg: 'text-6xl'
	};
</script>

<div class="flex flex-col items-center justify-center text-center {sizeClasses[size]} {className}">
	{#if icon}
		<div class="{iconSizeClasses[size]} text-[var(--color-text-muted)]" aria-hidden="true">
			{@render icon()}
		</div>
	{/if}

	{#if title}
		<p
			class="font-semibold"
			style="color: var(--color-text); font-family: var(--font-heading); font-size: var(--text-h5-size);"
		>
			{title}
		</p>
	{/if}

	{#if message}
		<p class="max-w-sm text-sm" style="color: var(--color-text-muted); font-family: var(--font-body);">
			{message}
		</p>
	{/if}

	{#if action}
		<div class="mt-2">
			{@render action()}
		</div>
	{/if}
</div>
