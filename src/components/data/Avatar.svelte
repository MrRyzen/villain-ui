<script lang="ts">
	interface Props {
		src?: string;
		alt: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		fallback?: string;
		glow?: boolean;
	}

	let { src, alt, size = 'md', fallback, glow = false }: Props = $props();

	let imageLoaded = $state(!!src);
	let imageError = $state(false);

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-16 h-16',
		xl: 'w-24 h-24'
	};

	const fontSizes = {
		sm: '0.75rem',
		md: '1rem',
		lg: '1.25rem',
		xl: '1.5rem'
	};

	const classes = $derived(
		`${sizeClasses[size]} rounded-full overflow-hidden inline-flex items-center justify-center transition-all duration-300 hover:scale-105 ${glow ? 'border-2 border-[var(--color-accent)] accent-glow' : ''}`
	);

	const fallbackText = $derived(
		fallback || alt.charAt(0).toUpperCase()
	);

	function handleImageError() {
		imageError = true;
		imageLoaded = false;
	}

	function handleImageLoad() {
		imageLoaded = true;
		imageError = false;
	}
</script>

{#if src && !imageError}
	<div class={classes}>
		<img
			{src}
			{alt}
			class="w-full h-full object-cover"
			onerror={handleImageError}
			onload={handleImageLoad}
		/>
	</div>
{:else}
	<div
		class={classes}
		style="background: linear-gradient(135deg, var(--color-accent) 0%, rgba(107, 33, 168, 0.7) 100%); color: var(--color-text); font-weight: 600; text-transform: uppercase; font-size: {fontSizes[size]};"
		role="img"
		aria-label={alt}
	>
		{fallbackText}
	</div>
{/if}
