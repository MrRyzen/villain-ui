<script lang="ts">
	import '@mrintel/villain-ui/theme.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Navbar, Sidebar, IconButton, LinkButton } from '@mrintel/villain-ui';
	import { page } from '$app/state';
	import Icon from '@iconify/svelte';

	let { children } = $props();
	let sidebarOpen = $state(true);
	let currentPath = $derived(page.url.pathname);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar position="sticky" height="md" navigationAlign="center" {currentPath}>
	{#snippet toggleButton()}
		<IconButton
			variant="ghost"
			size="md"
			onclick={() => sidebarOpen = !sidebarOpen}
			ariaLabel="Toggle sidebar"
		>
			<Icon icon={sidebarOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'} width="20" height="20" />
		</IconButton>
	{/snippet}

	{#snippet logo()}
		<div class="navbar-logo">
			Villain UI
		</div>
	{/snippet}

	{#snippet navigation()}
		<LinkButton href="/" variant="ghost" size="sm">Home</LinkButton>
		<LinkButton href="/buttons" variant="ghost" size="sm">Buttons</LinkButton>
		<LinkButton href="/cards" variant="ghost" size="sm">Cards</LinkButton>
		<LinkButton href="/data" variant="ghost" size="sm">Data</LinkButton>
		<LinkButton href="/forms" variant="ghost" size="sm">Forms</LinkButton>
		<LinkButton href="/navigation" variant="ghost" size="sm">Navigation</LinkButton>
		<LinkButton href="/overlays" variant="ghost" size="sm">Overlays</LinkButton>
		<LinkButton href="/typography" variant="ghost" size="sm">Typography</LinkButton>
		<LinkButton href="/utilities" variant="ghost" size="sm">Utilities</LinkButton>
		<LinkButton href="/theme" variant="ghost" size="sm">Theme</LinkButton>
		<LinkButton href="/wizard" variant="ghost" size="sm">Wizard</LinkButton>
	{/snippet}

	{#snippet actions()}
		<IconButton
			variant="ghost"
			size="md"
			onclick={() => window.open('https://github.com/mrryzen/villain-ui', '_blank', 'noopener,noreferrer')}
			ariaLabel="GitHub repository"
		>
			<Icon icon="lucide:github" width="20" height="20" />
		</IconButton>
	{/snippet}
</Navbar>

<Sidebar side="left" width="md" bind:open={sidebarOpen} {currentPath}>
	{#snippet header()}
		<div class="sidebar-header">Components</div>
	{/snippet}

	<a href="/" class="sidebar-item">
		<Icon icon="lucide:home" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Home</span>
	</a>

	<a href="/buttons" class="sidebar-item">
		<Icon icon="mdi:gesture-tap-button" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Buttons</span>
	</a>

	<a href="/cards" class="sidebar-item">
		<Icon icon="mdi:credit-card-outline" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Cards</span>
	</a>

	<a href="/data" class="sidebar-item">
		<Icon icon="mdi:table" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Data Display</span>
	</a>

	<a href="/forms" class="sidebar-item">
		<Icon icon="mdi:form-select" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Forms</span>
	</a>

	<a href="/navigation" class="sidebar-item">
		<Icon icon="mdi:compass-outline" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Navigation</span>
	</a>

	<a href="/overlays" class="sidebar-item">
		<Icon icon="mdi:window-closed" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Overlays</span>
	</a>

	<a href="/typography" class="sidebar-item">
		<Icon icon="mdi:format-letter-case" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Typography</span>
	</a>

	<a href="/utilities" class="sidebar-item">
		<Icon icon="mdi:tools" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Utilities</span>
	</a>

	<a href="/theme" class="sidebar-item">
		<Icon icon="mdi:palette" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Theme</span>
	</a>

	<a href="/wizard" class="sidebar-item">
		<Icon icon="mdi:magic-wand" class="sidebar-item-icon" width="20" height="20" />
		<span class="sidebar-item-label">Wizard</span>
	</a>
</Sidebar>

<main class="main-content" class:sidebar-open={sidebarOpen}>
	{@render children()}
</main>
