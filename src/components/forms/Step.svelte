<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import { getStepperContext } from './StepContext';

	interface Props {
		id: string;
		label?: string;
		fields?: string[];
		optional?: boolean;
		order?: number;
		children?: Snippet;
	}

	let {
		id,
		label = id,
		fields = [],
		optional = false,
		order,
		children,
	}: Props = $props();

	const context = getStepperContext();

	onMount(() => {
		context?.registerStep({ id, label, fields, optional, order });
	});

	onDestroy(() => {
		context?.unregisterStep(id);
	});

	const isActive = $derived(context?.currentStepId === id);
	const state = $derived(context?.getStepState(id) ?? 'idle');
</script>

{#if isActive && children}
	<div
		class="step-content"
		data-step-id={id}
		data-step-state={state}
		role="tabpanel"
		aria-labelledby={`step-${id}`}
	>
		{@render children()}
	</div>
{/if}
