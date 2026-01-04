<script lang="ts">
	import {
		Text,
		Card,
		Grid,
		Container,
		Heading,
		Divider,
		CodeBlock,
		Button,
		Tabs,
		Breadcrumbs,
		Menu,
		DropdownMenu,
		ContextMenu,
		Hero,
		Badge,
		Code
	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const navbarCode = `import { Navbar, IconButton } from '@mrintel/villain-ui';
import { page } from '$app/stores';

<Navbar currentPath={$page.url.pathname}>
  {#snippet logo()}
    <a href="/" class="navbar-logo">MyApp</a>
  {/snippet}

  {#snippet navigation()}
    <a href="/dashboard">Dashboard</a>
    <a href="/projects">Projects</a>
    <a href="/team">Team</a>
  {/snippet}

  {#snippet actions()}
    <IconButton ariaLabel="Search" variant="ghost">
      <Icon icon="lucide:search" />
    </IconButton>
    <IconButton ariaLabel="Settings" variant="ghost">
      <Icon icon="lucide:settings" />
    </IconButton>
  {/snippet}
</Navbar>`;

	const navbarOptionsCode = `<!-- Sticky navbar (default) -->
<Navbar position="sticky" height="md" />

<!-- Fixed navbar -->
<Navbar position="fixed" height="lg" />

<!-- Left-aligned navigation -->
<Navbar navigationAlign="left" />

<!-- Center-aligned navigation (default) -->
<Navbar navigationAlign="center" />`;

	const sidebarCode = `import { Sidebar } from '@mrintel/villain-ui';
import { page } from '$app/stores';

let sidebarOpen = $state(true);

<Sidebar bind:open={sidebarOpen} currentPath={$page.url.pathname}>
  {#snippet header()}
    <div class="sidebar-header">Navigation</div>
  {/snippet}

  <a href="/dashboard">
    <span class="sidebar-item-icon">
      <Icon icon="lucide:layout-dashboard" />
    </span>
    <span class="sidebar-item-label">Dashboard</span>
  </a>

  <a href="/projects">
    <span class="sidebar-item-icon">
      <Icon icon="lucide:folder" />
    </span>
    <span class="sidebar-item-label">Projects</span>
  </a>

  <a href="/team">
    <span class="sidebar-item-icon">
      <Icon icon="lucide:users" />
    </span>
    <span class="sidebar-item-label">Team</span>
  </a>
</Sidebar>`;

	const sidebarOptionsCode = `<!-- Right-side sidebar -->
<Sidebar side="right" width="lg" />

<!-- Different widths -->
<Sidebar width="sm" />  <!-- Narrow -->
<Sidebar width="md" />  <!-- Default -->
<Sidebar width="lg" />  <!-- Wide -->

<!-- Collapsed by default -->
<Sidebar bind:open={sidebarOpen} />
<Button onclick={() => sidebarOpen = !sidebarOpen}>
  Toggle Sidebar
</Button>`;

	const tabsCode = `import { Tabs } from '@mrintel/villain-ui';

let activeTab = $state('home');

const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'settings', label: 'Settings' },
  { id: 'disabled', label: 'Disabled', disabled: true }
];

<Tabs {tabs} bind:activeTab />`;

	const tabsVariantsCode = `<!-- Default variant -->
<Tabs {tabs} bind:activeTab variant="default" />

<!-- Pills variant -->
<Tabs {tabs} bind:activeTab variant="pills" />

<!-- Vertical orientation -->
<Tabs {tabs} bind:activeTab orientation="vertical" />`;

	const breadcrumbsCode = `import { Breadcrumbs } from '@mrintel/villain-ui';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops' }
];

<Breadcrumbs {items} />`;

	const breadcrumbsSeparatorCode = `<!-- Custom separator -->
<Breadcrumbs {items} separator=">" />

<!-- Icon separator -->
<Breadcrumbs {items}>
  {#snippet separatorIcon()}
    <Icon icon="lucide:chevron-right" width="16" />
  {/snippet}
</Breadcrumbs>`;

	const menuCode = `import { Menu } from '@mrintel/villain-ui';

const menuItems = [
  { id: '1', label: 'Dashboard', onclick: () => console.log('Dashboard') },
  { id: '2', label: 'Projects', onclick: () => console.log('Projects') },
  { id: '3', label: 'Team', onclick: () => console.log('Team') },
  { id: '4', label: 'Settings', onclick: () => console.log('Settings') }
];

<Menu items={menuItems} />`;

	const dropdownMenuCode = `import { DropdownMenu, Button } from '@mrintel/villain-ui';

let dropdownOpen = $state(false);

const menuItems = [
  { id: '1', label: 'Edit', onclick: () => console.log('Edit') },
  { id: '2', label: 'Duplicate', onclick: () => console.log('Duplicate') },
  { id: '3', label: 'Archive', onclick: () => console.log('Archive') },
  { id: '4', label: 'Delete', onclick: () => console.log('Delete'), disabled: true }
];

<DropdownMenu items={menuItems} bind:open={dropdownOpen}>
  {#snippet trigger()}
    <Button variant="secondary">Actions</Button>
  {/snippet}
</DropdownMenu>`;

	const contextMenuCode = `import { ContextMenu, Card } from '@mrintel/villain-ui';

let contextOpen = $state(false);

const contextItems = [
  { id: '1', label: 'Copy', onclick: () => console.log('Copy') },
  { id: '2', label: 'Paste', onclick: () => console.log('Paste') },
  { id: '3', label: 'Delete', onclick: () => console.log('Delete') }
];

<ContextMenu items={contextItems} bind:open={contextOpen}>
  {#snippet trigger()}
    <div class="p-4 border">Right-click me!</div>
  {/snippet}
</ContextMenu>`;

	// State for highlighted code
	let navbarHtml = $state('');
	let navbarOptionsHtml = $state('');
	let sidebarHtml = $state('');
	let sidebarOptionsHtml = $state('');
	let tabsHtml = $state('');
	let tabsVariantsHtml = $state('');
	let breadcrumbsHtml = $state('');
	let breadcrumbsSeparatorHtml = $state('');
	let menuHtml = $state('');
	let dropdownMenuHtml = $state('');
	let contextMenuHtml = $state('');

	// Component state
	let activeTab = $state('home');
	let activeTab2 = $state('home');
	let activeTab3 = $state('home');
	let activeTabVertical = $state('home');
	let dropdownOpen = $state(false);
	let dropdownOpen2 = $state(false);
	let contextOpen = $state(false);

	const tabs = [
		{ id: 'home', label: 'Home' },
		{ id: 'profile', label: 'Profile' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'disabled', label: 'Disabled', disabled: true }
	];

	const tabsWithIcons = [
		{ id: 'home', label: 'Home', iconBefore: () => ({ }as any) },
		{ id: 'profile', label: 'Profile', iconBefore: () => ({} as any) },
		{ id: 'settings', label: 'Settings', iconBefore: () => ({} as any) }
	];

	const breadcrumbItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: 'Electronics', href: '/products/electronics' },
		{ label: 'Laptops' }
	];

	const menuItems = [
		{
			id: '1',
			label: 'Dashboard',
			onclick: () => console.log('Dashboard')
		},
		{
			id: '2',
			label: 'Projects',
			onclick: () => console.log('Projects')
		},
		{
			id: '3',
			label: 'Team',
			onclick: () => console.log('Team')
		},
		{
			id: '4',
			label: 'Settings',
			onclick: () => console.log('Settings')
		}
	];

	const dropdownItems = [
		{ id: '1', label: 'Edit', onclick: () => alert('Edit clicked') },
		{ id: '2', label: 'Duplicate', onclick: () => alert('Duplicate clicked') },
		{ id: '3', label: 'Archive', onclick: () => alert('Archive clicked') },
		{ id: '4', label: 'Delete', onclick: () => alert('Delete clicked'), disabled: true }
	];

	const dropdownItemsWithIcons = [
		{ id: '1', label: 'Edit' },
		{ id: '2', label: 'Duplicate' },
		{ id: '3', label: 'Archive' },
		{ id: 'divider', label: '---', disabled: true },
		{ id: '4', label: 'Delete' }
	];

	const contextItems = [
		{ id: '1', label: 'Copy', onclick: () => alert('Copy clicked') },
		{ id: '2', label: 'Paste', onclick: () => alert('Paste clicked') },
		{ id: '3', label: 'Cut', onclick: () => alert('Cut clicked') },
		{ id: 'divider', label: '---', disabled: true },
		{ id: '4', label: 'Delete', onclick: () => alert('Delete clicked') }
	];

	onMount(async () => {
		navbarHtml = await codeToHtml(navbarCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		navbarOptionsHtml = await codeToHtml(navbarOptionsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		sidebarHtml = await codeToHtml(sidebarCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		sidebarOptionsHtml = await codeToHtml(sidebarOptionsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		tabsHtml = await codeToHtml(tabsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		tabsVariantsHtml = await codeToHtml(tabsVariantsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		breadcrumbsHtml = await codeToHtml(breadcrumbsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		breadcrumbsSeparatorHtml = await codeToHtml(breadcrumbsSeparatorCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		menuHtml = await codeToHtml(menuCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		dropdownMenuHtml = await codeToHtml(dropdownMenuCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		contextMenuHtml = await codeToHtml(contextMenuCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Navigation Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Navigate your application with elegant tabs, breadcrumbs, menus, and dropdowns designed for
				intuitive user experiences.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layout-list" class="tag-icon" />
				Multiple Styles
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:keyboard" class="tag-icon" />
				Keyboard Navigation
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:accessibility" class="tag-icon" />
				Accessible
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:mouse-pointer-2" class="tag-icon" />
				Context Menus
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Navbar -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Navbar</Heading>
				<Text variant="body" color="soft"
					>Top navigation bar with logo, links, and actions (see above for live example)</Text
				>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft"
						>The navbar you see at the top of this page is a live example. It includes:</Text
					>
					<ul class="list-disc pl-6 space-y-2">
						<li>
							<Text variant="body" color="soft"
								><strong>Logo section</strong> - Brand name/logo with link to home</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Navigation links</strong> - Centered links with active state highlighting</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Action buttons</strong> - Right-aligned icons for theme toggle and sidebar control</Text
							>
						</li>
					</ul>
				</div>
			</div>

			<CodeBlock
				filename="Navbar.svelte"
				showLineNumbers
				lineCount={navbarCode.split('\n').length}
				showCopy
				code={navbarCode}
			>
				{@html navbarHtml}
			</CodeBlock>
		</Card>

		<!-- Navbar Options -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Navbar Options</Heading>
				<Text variant="body" color="soft">Position, height, and navigation alignment options</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Heading level={4}>Position</Heading>
					<Text variant="body" color="soft">
						<Code>sticky</Code> - Sticks to top while scrolling (default)
					</Text>
					<Text variant="body" color="soft">
						<Code>fixed</Code> - Always fixed to viewport top
					</Text>
				</div>

				<div>
					<Heading level={4}>Height</Heading>
					<Text variant="body" color="soft">
						<Code>sm</Code> - 4rem (64px)
					</Text>
					<Text variant="body" color="soft">
						<Code>md</Code> - 4.5rem (72px, default)
					</Text>
					<Text variant="body" color="soft">
						<Code>lg</Code> - 6rem (96px)
					</Text>
				</div>

				<div>
					<Heading level={4}>Navigation Alignment</Heading>
					<Text variant="body" color="soft">
						<Code>left</Code> - Navigation links aligned to the left
					</Text>
					<Text variant="body" color="soft">
						<Code>center</Code> - Navigation links centered (default)
					</Text>
				</div>

				<div>
					<Heading level={4}>Active State</Heading>
					<Text variant="body" color="soft">
						Pass <Code>currentPath</Code> prop to automatically highlight active links based on the current
						route. Links get an accent color and underline glow effect.
					</Text>
				</div>
			</div>

			<CodeBlock
				filename="Navbar.svelte"
				showLineNumbers
				lineCount={navbarOptionsCode.split('\n').length}
				showCopy
				code={navbarOptionsCode}
			>
				{@html navbarOptionsHtml}
			</CodeBlock>
		</Card>

		<!-- Sidebar -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Sidebar</Heading>
				<Text variant="body" color="soft"
					>Collapsible side navigation panel (see left side for live example)</Text
				>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">The sidebar you see on the left is a live example. It features:</Text
					>
					<ul class="list-disc pl-6 space-y-2">
						<li>
							<Text variant="body" color="soft"
								><strong>Collapsible design</strong> - Toggle between full width and icon-only mode</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Icon support</strong> - Use <Code>.sidebar-item-icon</Code> class for icons</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Label support</strong> - Use <Code>.sidebar-item-label</Code> class for text</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Smart fallback</strong> - Shows first letter in circle when collapsed without
								icons</Text
							>
						</li>
						<li>
							<Text variant="body" color="soft"
								><strong>Active state</strong> - Automatically highlights the current page with accent
								border and glow</Text
							>
						</li>
					</ul>
				</div>
			</div>

			<CodeBlock
				filename="Sidebar.svelte"
				showLineNumbers
				lineCount={sidebarCode.split('\n').length}
				showCopy
				code={sidebarCode}
			>
				{@html sidebarHtml}
			</CodeBlock>
		</Card>

		<!-- Sidebar Options -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Sidebar Options</Heading>
				<Text variant="body" color="soft">Side position, widths, and collapse behavior</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Heading level={4}>Side Position</Heading>
					<Text variant="body" color="soft">
						<Code>left</Code> - Positioned on the left (default)
					</Text>
					<Text variant="body" color="soft">
						<Code>right</Code> - Positioned on the right
					</Text>
				</div>

				<div>
					<Heading level={4}>Width Options</Heading>
					<Text variant="body" color="soft">
						<Code>sm</Code> - 14rem open, 3.5rem collapsed
					</Text>
					<Text variant="body" color="soft">
						<Code>md</Code> - 16rem open, 4rem collapsed (default)
					</Text>
					<Text variant="body" color="soft">
						<Code>lg</Code> - 20rem open, 5rem collapsed
					</Text>
				</div>

				<div>
					<Heading level={4}>Navbar Integration</Heading>
					<Text variant="body" color="soft">
						The sidebar automatically detects the navbar height and positions itself below it. This
						works with any navbar height setting.
					</Text>
				</div>

				<div>
					<Heading level={4}>CSS Classes</Heading>
					<Text variant="body" color="soft">
						Use <Code>.sidebar-header</Code> for section headers,
						<Code>.sidebar-item-icon</Code> for icons, and
						<Code>.sidebar-item-label</Code> for labels.
					</Text>
				</div>
			</div>

			<CodeBlock
				filename="Sidebar.svelte"
				showLineNumbers
				lineCount={sidebarOptionsCode.split('\n').length}
				showCopy
				code={sidebarOptionsCode}
			>
				{@html sidebarOptionsHtml}
			</CodeBlock>
		</Card>

		<Divider />

		<!-- Tabs -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Tabs</Heading>
				<Text variant="body" color="soft">Organize content into switchable panels</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Default variant</Text>
					<Tabs {tabs} bind:activeTab variant="default" />
					<Text variant="caption" color="soft">Active tab: {activeTab}</Text>
				</div>
			</div>

			<CodeBlock
				filename="Tabs.svelte"
				showLineNumbers
				lineCount={tabsCode.split('\n').length}
				showCopy
				code={tabsCode}
			>
				{@html tabsHtml}
			</CodeBlock>
		</Card>

		<!-- Tabs Variants -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Tabs Variants & Orientation</Heading>
				<Text variant="body" color="soft">Different styles and layouts for tabs</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Pills variant</Text>
					<Tabs {tabs} bind:activeTab={activeTab2} variant="pills" />
				</div>

				<div>
					<Text variant="caption" color="soft">Vertical orientation</Text>
					<Tabs {tabs} bind:activeTab={activeTabVertical} orientation="vertical" />
				</div>
			</div>

			<CodeBlock
				filename="Tabs.svelte"
				showLineNumbers
				lineCount={tabsVariantsCode.split('\n').length}
				showCopy
				code={tabsVariantsCode}
			>
				{@html tabsVariantsHtml}
			</CodeBlock>
		</Card>

		<!-- Breadcrumbs -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Breadcrumbs</Heading>
				<Text variant="body" color="soft">Show hierarchical navigation path</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Default separator (/)</Text>
					<Breadcrumbs items={breadcrumbItems} />
				</div>

				<div>
					<Text variant="caption" color="soft">Custom separator (>)</Text>
					<Breadcrumbs items={breadcrumbItems} separator=">" />
				</div>

				<div>
					<Text variant="caption" color="soft">Icon separator</Text>
					<Breadcrumbs items={breadcrumbItems}>
						{#snippet separatorIcon()}
							<Icon icon="lucide:chevron-right" width="16" />
						{/snippet}
					</Breadcrumbs>
				</div>
			</div>

			<CodeBlock
				filename="Breadcrumbs.svelte"
				showLineNumbers
				lineCount={breadcrumbsCode.split('\n').length}
				showCopy
				code={breadcrumbsCode}
			>
				{@html breadcrumbsHtml}
			</CodeBlock>
		</Card>

		<!-- Menu -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Menu</Heading>
				<Text variant="body" color="soft">Vertical list of clickable menu items</Text>
			{/snippet}

			<div class="demo-group">
				<div style="max-width: 250px;">
					<Menu items={menuItems} />
				</div>
			</div>

			<CodeBlock
				filename="Menu.svelte"
				showLineNumbers
				lineCount={menuCode.split('\n').length}
				showCopy
				code={menuCode}
			>
				{@html menuHtml}
			</CodeBlock>
		</Card>

		<!-- Dropdown Menu -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Dropdown Menu</Heading>
				<Text variant="body" color="soft">Contextual menu triggered by a button</Text>
			{/snippet}

			<div class="demo-group">
				<DropdownMenu items={dropdownItems} bind:open={dropdownOpen} placement="bottom-start">
					{#snippet trigger()}
						<Button variant="secondary">
							Actions
							{#snippet iconAfter()}
								<Icon icon="lucide:chevron-down" width="16" />
							{/snippet}
						</Button>
					{/snippet}
				</DropdownMenu>

				<DropdownMenu items={dropdownItems} bind:open={dropdownOpen2} placement="bottom-end">
					{#snippet trigger()}
						<Button variant="primary">
							{#snippet iconBefore()}
								<Icon icon="lucide:menu" width="16" />
							{/snippet}
							Menu
						</Button>
					{/snippet}
				</DropdownMenu>
			</div>

			<CodeBlock
				filename="DropdownMenu.svelte"
				showLineNumbers
				lineCount={dropdownMenuCode.split('\n').length}
				showCopy
				code={dropdownMenuCode}
			>
				{@html dropdownMenuHtml}
			</CodeBlock>
		</Card>

		<!-- Context Menu -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Context Menu</Heading>
				<Text variant="body" color="soft">Right-click menu for contextual actions</Text>
			{/snippet}

			<div class="demo-group">
				<ContextMenu items={contextItems} bind:open={contextOpen}>
					{#snippet trigger()}
						<div
							class="glass-panel p-8 rounded-[var(--radius-lg)] text-center cursor-pointer hover-lift transition-all duration-300"
						>
							<Icon icon="lucide:mouse-pointer-click" width="32" class="mx-auto mb-2 text-accent" />
							<Text variant="body" color="soft">Right-click this area</Text>
							<Text variant="caption" color="soft">Try the context menu!</Text>
						</div>
					{/snippet}
				</ContextMenu>
			</div>

			<CodeBlock
				filename="ContextMenu.svelte"
				showLineNumbers
				lineCount={contextMenuCode.split('\n').length}
				showCopy
				code={contextMenuCode}
			>
				{@html contextMenuHtml}
			</CodeBlock>
		</Card>

		<Divider />

		<!-- Usage Tips -->
		<Card padding="lg" class="accent-surface">
			{#snippet header()}
				<Heading level={2}>Usage Tips</Heading>
			{/snippet}

			<Grid cols={2} gap="lg">
				<div>
					<Heading level={4}>Layout Components</Heading>
					<Text variant="body" color="soft">
						Navbar and Sidebar work together seamlessly. The sidebar automatically positions itself
						below the navbar. Use <Code>currentPath</Code> prop on both to enable active state highlighting.
					</Text>
				</div>

				<div>
					<Heading level={4}>Sidebar Icons</Heading>
					<Text variant="body" color="soft">
						Always use <Code>.sidebar-item-icon</Code> and
						<Code>.sidebar-item-label</Code> classes for proper collapsed state behavior. Without icons,
						first letters are shown automatically.
					</Text>
				</div>

				<div>
					<Heading level={4}>Keyboard Navigation</Heading>
					<Text variant="body" color="soft">
						All navigation components support keyboard navigation. Use arrow keys to navigate,
						Enter/Space to select, and Escape to close dropdowns.
					</Text>
				</div>

				<div>
					<Heading level={4}>Accessibility</Heading>
					<Text variant="body" color="soft">
						Components follow ARIA best practices with proper roles, labels, and keyboard patterns
						for screen reader compatibility.
					</Text>
				</div>

				<div>
					<Heading level={4}>Tab Organization</Heading>
					<Text variant="body" color="soft">
						Use tabs for related content sections. Keep tab labels short and use icons to enhance
						clarity. Disable tabs that aren't currently available.
					</Text>
				</div>

				<div>
					<Heading level={4}>Menu Placement</Heading>
					<Text variant="body" color="soft">
						DropdownMenu supports multiple placement options (bottom-start, bottom-end, top-start,
						top-end). Choose based on available space and user flow.
					</Text>
				</div>

				<div>
					<Heading level={4}>Breadcrumb Navigation</Heading>
					<Text variant="body" color="soft">
						Use breadcrumbs for hierarchical navigation. The last item should not have a link as it
						represents the current page. Add icons for visual enhancement.
					</Text>
				</div>

				<div>
					<Heading level={4}>Context Menu UX</Heading>
					<Text variant="body" color="soft">
						Context menus are great for power users but should supplement, not replace, primary
						actions. Always provide an alternative way to access the same functionality.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	/* Demo layout utilities */
	.demo-group {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.demo-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
</style>
