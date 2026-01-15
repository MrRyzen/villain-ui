<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		/**
		 * Array of numeric data points to plot
		 */
		data: number[];

		/**
		 * Line color (defaults to accent primary)
		 */
		color?: string;

		/**
		 * Chart height in pixels
		 * @default 40
		 */
		height?: number;

		/**
		 * Chart width in pixels
		 * @default 200
		 */
		width?: number;

		/**
		 * Show dots at each data point
		 * @default false
		 */
		showDots?: boolean;

		/**
		 * Show gradient fill below the line
		 * @default false
		 */
		showFill?: boolean;

		/**
		 * Line thickness in pixels
		 * @default 2
		 */
		strokeWidth?: number;

		/**
		 * Animation duration in milliseconds (set to 0 to disable)
		 * @default 500
		 */
		animationDuration?: number;
	}

	let {
		data,
		color = 'var(--color-accent-soft)',
		height = 40,
		width = 200,
		showDots = false,
		showFill = false,
		strokeWidth = 2,
		animationDuration = 500
	}: Props = $props();

	let pathElement: SVGPathElement | undefined = $state();
	let mounted = $state(false);

	// Calculate min/max for scaling
	const min = $derived(Math.min(...data));
	const max = $derived(Math.max(...data));
	const range = $derived(max - min || 1); // Avoid division by zero

	// Padding for dots and stroke
	const padding = $derived(showDots ? 4 : strokeWidth);

	// Calculate viewBox dimensions
	const viewBoxWidth = $derived(width);
	const viewBoxHeight = $derived(height);

	// Generate SVG path from data points
	const points = $derived(
		data.map((value, index) => {
			const x = padding + (index / (data.length - 1)) * (viewBoxWidth - padding * 2);
			const y =
				viewBoxHeight - padding - ((value - min) / range) * (viewBoxHeight - padding * 2);
			return { x, y, value };
		})
	);

	const pathData = $derived(
		points.length > 0
			? points.reduce((path, point, index) => {
					if (index === 0) {
						return `M ${point.x},${point.y}`;
					}
					return `${path} L ${point.x},${point.y}`;
				}, '')
			: ''
	);

	// Generate fill path (line + close to bottom)
	const fillPathData = $derived(
		points.length > 0
			? `${pathData} L ${viewBoxWidth - padding},${viewBoxHeight} L ${padding},${viewBoxHeight} Z`
			: ''
	);

	// Gradient ID for unique identification
	const gradientId = $derived(`sparkline-gradient-${Math.random().toString(36).slice(2, 9)}`);

	// Animation
	onMount(() => {
		if (animationDuration > 0 && pathElement) {
			const length = pathElement.getTotalLength();
			pathElement.style.strokeDasharray = `${length}`;
			pathElement.style.strokeDashoffset = `${length}`;

			// Check for reduced motion preference
			const prefersReducedMotion = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches;

			if (!prefersReducedMotion) {
				// Animate the stroke
				requestAnimationFrame(() => {
					if (pathElement) {
						pathElement.style.transition = `stroke-dashoffset ${animationDuration}ms var(--ease-luxe)`;
						pathElement.style.strokeDashoffset = '0';
					}
				});
			} else {
				// Skip animation if reduced motion is preferred
				pathElement.style.strokeDashoffset = '0';
			}
		}

		mounted = true;
	});
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
	class="sparkline"
	role="img"
	aria-label="Trend sparkline visualization"
	style="overflow: visible;"
>
	<!-- Gradient definition for fill -->
	{#if showFill}
		<defs>
			<linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" style="stop-color: {color}; stop-opacity: 0.3;" />
				<stop offset="100%" style="stop-color: {color}; stop-opacity: 0.05;" />
			</linearGradient>
		</defs>
	{/if}

	<!-- Gradient fill area -->
	{#if showFill && mounted}
		<path
			d={fillPathData}
			fill="url(#{gradientId})"
			style="opacity: 0; animation: fade-in {animationDuration}ms var(--ease-luxe) forwards;"
		/>
	{/if}

	<!-- Line path -->
	<path
		bind:this={pathElement}
		d={pathData}
		fill="none"
		stroke={color}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	/>

	<!-- Data point dots -->
	{#if showDots && mounted}
		{#each points as point, i}
			<circle
				cx={point.x}
				cy={point.y}
				r="3"
				fill={color}
				style="opacity: 0; animation: fade-in {animationDuration}ms var(--ease-luxe) {i *
					50}ms forwards;"
			/>
		{/each}
	{/if}
</svg>

<style>
	.sparkline {
		display: block;
	}
</style>
