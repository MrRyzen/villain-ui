<script lang="ts">
	import Toast from './Toast.svelte';
	import { toasts, dismissToast, type ToastItem } from './toast.store';

	interface Props {
		position?:
			| 'top-left'
			| 'top-center'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-center'
			| 'bottom-right';
		/** Newest toasts beyond this count are queued until older ones dismiss. */
		maxVisible?: number;
	}

	let { position = 'bottom-right', maxVisible = 4 }: Props = $props();

	let items = $state<ToastItem[]>(toasts.get());

	$effect(() => toasts.subscribe((value) => (items = value)));

	const visible = $derived(items.slice(0, maxVisible));
</script>

{#each visible as item, index (item.id)}
	<Toast
		message={item.message}
		variant={item.variant}
		duration={item.duration}
		dismissible={item.dismissible}
		{position}
		{index}
		onClose={() => dismissToast(item.id)}
	/>
{/each}
