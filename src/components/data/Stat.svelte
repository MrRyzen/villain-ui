<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		change?: number;
		trend?: 'up' | 'down' | 'neutral';
		icon?: import('svelte').Snippet;
		description?: string;
	}

	let { label, value, change, trend, icon, description }: Props = $props();

	const trendColors = {
		up: 'var(--color-success)',
		down: 'var(--color-error)',
		neutral: 'var(--color-text-muted)'
	};

	const trendColor = $derived(trend ? trendColors[trend] : 'var(--color-text-muted)');
	const showGlow = $derived(trend === 'up');
</script>

<div class="panel-spectral rounded-[var(--radius-xl)] p-6">
	<!-- Top Row: Icon & Label -->
	<div class="flex items-start justify-between mb-4">
		<div class="flex-1">
			<div
				class="uppercase tracking-wider"
				style="color: var(--color-text-soft); font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;"
			>
				{label}
			</div>
		</div>

		{#if icon}
			<div class="w-10 h-10" style="color: var(--color-accent-soft);">
				{@render icon()}
			</div>
		{/if}
	</div>

	<!-- Value Display -->
	<div
		class="mb-2"
		class:text-glow={showGlow}
		style="color: var(--color-text); font-family: var(--font-heading); font-size: 2.5rem; font-weight: 700; line-height: 1.2;"
	>
		{value}
	</div>

	<!-- Change Indicator & Description -->
	{#if change !== undefined || description}
		<div class="flex items-center gap-2 flex-wrap">
			{#if change !== undefined}
				<div
					class="inline-flex items-center gap-1 font-semibold text-sm"
					style="color: {trendColor};"
				>
					{#if trend === 'up'}
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8 12V4M8 4L4 8M8 4L12 8"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else if trend === 'down'}
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8 4V12M8 12L4 8M8 12L12 8"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
					{change > 0 ? '+' : ''}{change}%
				</div>
			{/if}

			{#if description}
				<div class="text-xs" style="color: var(--color-text-muted);">
					{description}
				</div>
			{/if}
		</div>
	{/if}
</div>
