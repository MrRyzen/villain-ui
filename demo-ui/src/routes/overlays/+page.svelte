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
		Modal,
		Alert,
		Tooltip,
		Toast,
		Drawer,
		Spinner,
		ProgressBar,
		SkeletonLoader,
		Popover,
		Dropdown,
		CommandPalette,
		Hero,
		Badge,
		Code

	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onDestroy, onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const modalCode = `import { Modal, Button } from '@mrintel/villain-ui';

let modalOpen = $state(false);

<Button onclick={() => modalOpen = true}>Open Modal</Button>

<Modal bind:open={modalOpen} title="Example Modal" size="md">
  <p>This is the modal content.</p>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => modalOpen = false}>
      Cancel
    </Button>
    <Button variant="primary" onclick={() => modalOpen = false}>
      Confirm
    </Button>
  {/snippet}
</Modal>`;

	const alertCode = `import { Alert } from '@mrintel/villain-ui';

<Alert variant="info" title="Information">
  This is an informational alert message.
</Alert>

<Alert variant="success" title="Success" dismissible>
  Operation completed successfully!
</Alert>

<Alert variant="warning" title="Warning">
  Please review this warning.
</Alert>

<Alert variant="error" title="Error" dismissible>
  An error occurred during processing.
</Alert>`;

	const tooltipCode = `import { Tooltip, Button } from '@mrintel/villain-ui';

<Tooltip content="This is a tooltip" placement="top">
  <Button variant="secondary">Hover me</Button>
</Tooltip>`;

	const toastCode = `import { Toast } from '@mrintel/villain-ui';

let showToast = $state(false);

<Button onclick={() => showToast = true}>Show Toast</Button>

{#if showToast}
  <Toast
    message="This is a toast notification"
    variant="success"
    duration={3000}
    onclose={() => showToast = false}
  />
{/if}`;

	const drawerCode = `import { Drawer, Button } from '@mrintel/villain-ui';

let drawerOpen = $state(false);

<Button onclick={() => drawerOpen = true}>Open Drawer</Button>

<Drawer bind:open={drawerOpen} side="right" title="Drawer Title">
  <p>Drawer content goes here.</p>

  {#snippet footer()}
    <Button variant="primary" onclick={() => drawerOpen = false}>
      Close
    </Button>
  {/snippet}
</Drawer>`;

	const spinnerCode = `import { Spinner } from '@mrintel/villain-ui';

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" label="Loading data..." />`;

	const progressBarCode = `import { ProgressBar } from '@mrintel/villain-ui';

<ProgressBar value={45} max={100} size="md" />
<ProgressBar value={75} max={100} size="lg" showLabel />`;

	const skeletonCode = `import { SkeletonLoader } from '@mrintel/villain-ui';

<SkeletonLoader variant="text" count={3} />
<SkeletonLoader variant="circular" />
<SkeletonLoader variant="rectangular" />`;

	const popoverCode = `import { Popover, Button } from '@mrintel/villain-ui';

let popoverOpen = $state(false);

<Popover bind:open={popoverOpen} placement="bottom">
  {#snippet trigger()}
    <Button variant="secondary">Click me</Button>
  {/snippet}

  <div class="p-2">
    <p>Popover content goes here</p>
  </div>
</Popover>`;

	const dropdownCode = `import { Dropdown, Button } from '@mrintel/villain-ui';

let dropdownOpen = $state(false);

<Dropdown bind:open={dropdownOpen} placement="bottom-start">
  {#snippet trigger()}
    <Button variant="secondary">Open Menu</Button>
  {/snippet}

  <div class="p-2">
    <button class="dropdown-item">Option 1</button>
    <button class="dropdown-item">Option 2</button>
    <button class="dropdown-item">Option 3</button>
  </div>
</Dropdown>`;

	const commandPaletteCode = `import { CommandPalette } from '@mrintel/villain-ui';

let paletteOpen = $state(false);

const commands = [
  { id: '1', label: 'New File', onSelect: () => console.log('New') },
  { id: '2', label: 'Open File', onSelect: () => console.log('Open') },
  { id: '3', label: 'Save', onSelect: () => console.log('Save') }
];

<CommandPalette bind:open={paletteOpen} {commands} />`;

	// State for highlighted code
	let modalHtml = $state('');
	let alertHtml = $state('');
	let tooltipHtml = $state('');
	let toastHtml = $state('');
	let drawerHtml = $state('');
	let spinnerHtml = $state('');
	let progressBarHtml = $state('');
	let skeletonHtml = $state('');
	let popoverHtml = $state('');
	let dropdownHtml = $state('');
	let commandPaletteHtml = $state('');

	// Component state
	let modalOpen = $state(false);
	let modalSmOpen = $state(false);
	let modalLgOpen = $state(false);

	let drawerOpen = $state(false);
	let drawerLeftOpen = $state(false);
	let drawerTopOpen = $state(false);

	let showToast = $state(false);
	let showToastInfo = $state(false);
	let showToastWarning = $state(false);
	let showToastError = $state(false);

	let popoverOpen = $state(false);
	let dropdownOpen = $state(false);
	let paletteOpen = $state(false);

	let progressValue = $state(45);

	const commands = [
		{
			id: 'new',
			label: 'Create New File',
			keywords: ['new', 'create', 'file'],
			onSelect: () => alert('Create New File')
		},
		{
			id: 'open',
			label: 'Open File',
			keywords: ['open', 'load'],
			onSelect: () => alert('Open File')
		},
		{
			id: 'save',
			label: 'Save File',
			keywords: ['save', 'write'],
			onSelect: () => alert('Save File')
		},
		{
			id: 'settings',
			label: 'Settings',
			keywords: ['settings', 'preferences', 'config'],
			onSelect: () => alert('Settings')
		},
		{
			id: 'help',
			label: 'Help & Documentation',
			keywords: ['help', 'docs', 'documentation'],
			onSelect: () => alert('Help')
		}
	];

	let interval: ReturnType<typeof setInterval>;

	onMount(async () => {
		modalHtml = await codeToHtml(modalCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		alertHtml = await codeToHtml(alertCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		tooltipHtml = await codeToHtml(tooltipCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		toastHtml = await codeToHtml(toastCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		drawerHtml = await codeToHtml(drawerCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		spinnerHtml = await codeToHtml(spinnerCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		progressBarHtml = await codeToHtml(progressBarCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		skeletonHtml = await codeToHtml(skeletonCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		popoverHtml = await codeToHtml(popoverCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		dropdownHtml = await codeToHtml(dropdownCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		commandPaletteHtml = await codeToHtml(commandPaletteCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		// Simulate progress
		interval = setInterval(() => {
			progressValue = (progressValue + 1) % 101;
		}, 100);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Overlay Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Enhance user interactions with modals, toasts, tooltips, and other overlay components
				designed for seamless layering and elegant presentation.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layers" class="tag-icon" />
				Multiple Layers
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:focus" class="tag-icon" />
				Focus Management
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:animation" class="tag-icon" />
				Smooth Animations
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:accessibility" class="tag-icon" />
				Accessible
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Modal -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Modal</Heading>
				<Text variant="body" color="soft">Dialog overlays with backdrop and focus management</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary" onclick={() => (modalOpen = true)}>Open Modal</Button>
				<Button variant="secondary" onclick={() => (modalSmOpen = true)}>Small Modal</Button>
				<Button variant="ghost" onclick={() => (modalLgOpen = true)}>Large Modal</Button>
			</div>

			<CodeBlock
				filename="Modal.svelte"
				showLineNumbers
				lineCount={modalCode.split('\n').length}
				showCopy
				code={modalCode}
			>
				{@html modalHtml}
			</CodeBlock>
		</Card>

		<!-- Alert -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Alert</Heading>
				<Text variant="body" color="soft">Status messages with multiple variants</Text>
			{/snippet}

			<div class="demo-stack">
				<Alert variant="info" title="Information">
					This is an informational alert with helpful details.
				</Alert>

				<Alert variant="success" title="Success" dismissible>
					Your changes have been saved successfully!
				</Alert>

				<Alert variant="warning" title="Warning">
					Please review this warning before proceeding.
				</Alert>

				<Alert variant="error" title="Error" dismissible>
					An error occurred while processing your request.
				</Alert>
			</div>

			<CodeBlock
				filename="Alert.svelte"
				showLineNumbers
				lineCount={alertCode.split('\n').length}
				showCopy
				code={alertCode}
			>
				{@html alertHtml}
			</CodeBlock>
		</Card>

		<!-- Tooltip -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Tooltip</Heading>
				<Text variant="body" color="soft">Contextual help text on hover</Text>
			{/snippet}

			<div class="demo-group items-center">
				<Tooltip content="Tooltip on top" placement="top">
					<Button variant="secondary">Top</Button>
				</Tooltip>

				<Tooltip content="Tooltip on bottom" placement="bottom">
					<Button variant="secondary">Bottom</Button>
				</Tooltip>

				<Tooltip content="Tooltip on left" placement="left">
					<Button variant="secondary">Left</Button>
				</Tooltip>

				<Tooltip content="Tooltip on right" placement="right">
					<Button variant="secondary">Right</Button>
				</Tooltip>
			</div>

			<CodeBlock
				filename="Tooltip.svelte"
				showLineNumbers
				lineCount={tooltipCode.split('\n').length}
				showCopy
				code={tooltipCode}
			>
				{@html tooltipHtml}
			</CodeBlock>
		</Card>

		<!-- Toast -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Toast</Heading>
				<Text variant="body" color="soft">Temporary notifications with auto-dismiss</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary" onclick={() => (showToast = true)}>Show Success Toast</Button>
				<Button variant="secondary" onclick={() => (showToastInfo = true)}>Info Toast</Button>
				<Button variant="ghost" onclick={() => (showToastWarning = true)}>Warning Toast</Button>
				<Button variant="ghost" onclick={() => (showToastError = true)}>Error Toast</Button>
			</div>

			<CodeBlock
				filename="Toast.svelte"
				showLineNumbers
				lineCount={toastCode.split('\n').length}
				showCopy
				code={toastCode}
			>
				{@html toastHtml}
			</CodeBlock>
		</Card>

		<!-- Drawer -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Drawer</Heading>
				<Text variant="body" color="soft">Slide-in panels from any side</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary" onclick={() => (drawerOpen = true)}>Right Drawer</Button>
				<Button variant="secondary" onclick={() => (drawerLeftOpen = true)}>Left Drawer</Button>
				<Button variant="ghost" onclick={() => (drawerTopOpen = true)}>Top Drawer</Button>
			</div>

			<CodeBlock
				filename="Drawer.svelte"
				showLineNumbers
				lineCount={drawerCode.split('\n').length}
				showCopy
				code={drawerCode}
			>
				{@html drawerHtml}
			</CodeBlock>
		</Card>

		<Divider />

		<!-- Spinner -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Spinner</Heading>
				<Text variant="body" color="soft">Loading indicators in multiple sizes</Text>
			{/snippet}

			<div class="demo-group items-center">
				<div class="flex flex-col items-center gap-2">
					<Spinner size="sm" />
					<Text variant="caption" color="soft">Small</Text>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="md" />
					<Text variant="caption" color="soft">Medium</Text>
				</div>
				<div class="flex flex-col items-center gap-2">
					<Spinner size="lg" />
					<Text variant="caption" color="soft">Large</Text>
				</div>
			</div>

			<CodeBlock
				filename="Spinner.svelte"
				showLineNumbers
				lineCount={spinnerCode.split('\n').length}
				showCopy
				code={spinnerCode}
			>
				{@html spinnerHtml}
			</CodeBlock>
		</Card>

		<!-- ProgressBar -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Progress Bar</Heading>
				<Text variant="body" color="soft">Visual progress indicators with smooth transitions</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Animated progress</Text>
					<ProgressBar value={progressValue} max={100} size="md" />
				</div>

				<div>
					<Text variant="caption" color="soft">With label</Text>
					<ProgressBar value={75} max={100} size="lg" showLabel />
				</div>

				<div>
					<Text variant="caption" color="soft">Small size</Text>
					<ProgressBar value={60} max={100} size="sm" />
				</div>
			</div>

			<CodeBlock
				filename="ProgressBar.svelte"
				showLineNumbers
				lineCount={progressBarCode.split('\n').length}
				showCopy
				code={progressBarCode}
			>
				{@html progressBarHtml}
			</CodeBlock>
		</Card>

		<!-- SkeletonLoader -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Skeleton Loader</Heading>
				<Text variant="body" color="soft">Content placeholders with shimmer animation</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Text skeleton (3 lines)</Text>
					<SkeletonLoader variant="text" count={3} />
				</div>

				<div class="flex gap-4 items-start">
					<div>
						<Text variant="caption" color="soft">Circular</Text>
						<SkeletonLoader variant="circular" />
					</div>
					<div class="flex-1">
						<Text variant="caption" color="soft">Rectangular</Text>
						<SkeletonLoader variant="rectangular" />
					</div>
				</div>
			</div>

			<CodeBlock
				filename="SkeletonLoader.svelte"
				showLineNumbers
				lineCount={skeletonCode.split('\n').length}
				showCopy
				code={skeletonCode}
			>
				{@html skeletonHtml}
			</CodeBlock>
		</Card>

		<!-- Popover -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Popover</Heading>
				<Text variant="body" color="soft">Click-triggered content overlays</Text>
			{/snippet}

			<div class="demo-group">
				<Popover bind:open={popoverOpen} placement="bottom">
					{#snippet trigger()}
						<Button variant="primary">Click for Popover</Button>
					{/snippet}

					<div class="p-2 min-w-[200px]">
						<Heading level={4}>Popover Content</Heading>
						<Text variant="body" color="soft">
							This is a popover with custom content. Click outside to close.
						</Text>
					</div>
				</Popover>
			</div>

			<CodeBlock
				filename="Popover.svelte"
				showLineNumbers
				lineCount={popoverCode.split('\n').length}
				showCopy
				code={popoverCode}
			>
				{@html popoverHtml}
			</CodeBlock>
		</Card>

		<!-- Dropdown -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Dropdown</Heading>
				<Text variant="body" color="soft">Click-triggered dropdown menus with custom content</Text>
			{/snippet}

			<div class="demo-group">
				<Dropdown bind:open={dropdownOpen} placement="bottom-start">
					{#snippet trigger()}
						<Button variant="primary">Open Dropdown</Button>
					{/snippet}

					<div class="p-2 min-w-[180px] space-y-1">
						<Button variant="ghost">
							<Icon icon="lucide:file" width="16" height="16" class="inline mr-2" />
							New File
						</Button>
						<Button variant="ghost">
							<Icon icon="lucide:folder" width="16" height="16" class="inline mr-2" />
							Open Folder
						</Button>
						<Button variant="ghost">
							<Icon icon="lucide:save" width="16" height="16" class="inline mr-2" />
							Save
						</Button>
						<Divider />
						<Button variant="ghost" class="text-error">
							<Icon icon="lucide:trash-2" width="16" height="16" class="inline mr-2" />
							Delete
						</Button>
					</div>
				</Dropdown>
			</div>

			<CodeBlock
				filename="Dropdown.svelte"
				showLineNumbers
				lineCount={dropdownCode.split('\n').length}
				showCopy
				code={dropdownCode}
			>
				{@html dropdownHtml}
			</CodeBlock>
		</Card>

		<!-- Command Palette -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Command Palette</Heading>
				<Text variant="body" color="soft">Searchable command interface with keyboard navigation</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary" onclick={() => (paletteOpen = true)}>
					Open Command Palette
					<Text variant="caption" color="soft">Cmd+K</Text>
				</Button>
			</div>

			<CodeBlock
				filename="CommandPalette.svelte"
				showLineNumbers
				lineCount={commandPaletteCode.split('\n').length}
				showCopy
				code={commandPaletteCode}
			>
				{@html commandPaletteHtml}
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
					<Heading level={4}>Modal Best Practices</Heading>
					<Text variant="body" color="soft">
						Use modals sparingly for important decisions or forms. Always provide a clear way to
						close. Use <Code>closeOnEscape</Code> for better UX.
					</Text>
				</div>

				<div>
					<Heading level={4}>Toast Positioning</Heading>
					<Text variant="body" color="soft">
						Place toasts in corners to avoid blocking content. Use auto-dismiss for
						non-critical messages. Stack multiple toasts with the
						<Code>index</Code> prop.
					</Text>
				</div>

				<div>
					<Heading level={4}>Focus Management</Heading>
					<Text variant="body" color="soft">
						Modal and Drawer components handle focus trapping automatically. Previous focus is
						restored on close. Keyboard navigation works out of the box.
					</Text>
				</div>

				<div>
					<Heading level={4}>Loading States</Heading>
					<Text variant="body" color="soft">
						Use Spinner for indeterminate loading, ProgressBar for determinate progress, and
						SkeletonLoader for content placeholders during initial load.
					</Text>
				</div>

				<div>
					<Heading level={4}>Accessibility</Heading>
					<Text variant="body" color="soft">
						All overlays include proper ARIA attributes, keyboard support, and screen reader
						announcements. Alerts use appropriate
						<Code>aria-live</Code> regions.
					</Text>
				</div>

				<div>
					<Heading level={4}>Drawer vs Modal</Heading>
					<Text variant="body" color="soft">
						Use Drawer for contextual panels (filters, settings) and Modal for focused tasks
						requiring user decision. Drawers work well for multi-step workflows.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<!-- Modals -->
<Modal bind:open={modalOpen} title="Example Modal" size="md">
	<div class="space-y-4">
		<Text variant="body">This is a standard modal with customizable content and footer actions.</Text>
		<Text variant="body" color="soft">
			Modals support focus trapping, escape key handling, and backdrop clicks.
		</Text>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
		<Button variant="primary" onclick={() => (modalOpen = false)}>Confirm</Button>
	{/snippet}
</Modal>

<Modal bind:open={modalSmOpen} title="Small Modal" size="sm">
	<Text variant="body">This is a small modal, perfect for quick confirmations.</Text>

	{#snippet footer()}
		<Button variant="primary" onclick={() => (modalSmOpen = false)}>OK</Button>
	{/snippet}
</Modal>

<Modal bind:open={modalLgOpen} title="Large Modal" size="lg">
	<div class="space-y-4">
		<Text variant="body">This is a large modal with more space for detailed content.</Text>
		<Text variant="body" color="soft">
			Large modals are great for forms, detailed information, or complex interactions.
		</Text>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalLgOpen = false)}>Cancel</Button>
		<Button variant="primary" onclick={() => (modalLgOpen = false)}>Save Changes</Button>
	{/snippet}
</Modal>

<!-- Drawers -->
<Drawer bind:open={drawerOpen} side="right" title="Right Drawer" size="md">
	<div class="space-y-4">
		<Text variant="body">This drawer slides in from the right side of the screen.</Text>
		<Text variant="body" color="soft">
			Drawers are perfect for filters, settings panels, or navigation menus.
		</Text>
	</div>

	{#snippet footer()}
		<Button variant="primary" onclick={() => (drawerOpen = false)}>Close</Button>
	{/snippet}
</Drawer>

<Drawer bind:open={drawerLeftOpen} side="left" title="Left Drawer" size="md">
	<div class="space-y-4">
		<Text variant="body">This drawer slides in from the left side.</Text>
		<Text variant="body" color="soft">Great for navigation or contextual menus.</Text>
	</div>

	{#snippet footer()}
		<Button variant="primary" onclick={() => (drawerLeftOpen = false)}>Close</Button>
	{/snippet}
</Drawer>

<Drawer bind:open={drawerTopOpen} side="top" title="Top Drawer" size="md">
	<div class="space-y-4">
		<Text variant="body">This drawer slides in from the top.</Text>
		<Text variant="body" color="soft">Less common but useful for notifications or alerts.</Text>
	</div>

	{#snippet footer()}
		<Button variant="primary" onclick={() => (drawerTopOpen = false)}>Close</Button>
	{/snippet}
</Drawer>

<!-- Toasts -->
{#if showToast}
	<Toast
		message="Operation completed successfully!"
		variant="success"
		position="bottom-right"
		duration={3000}
		onclose={() => (showToast = false)}
	/>
{/if}

{#if showToastInfo}
	<Toast
		message="This is an informational message"
		variant="info"
		position="bottom-right"
		duration={3000}
		onclose={() => (showToastInfo = false)}
	/>
{/if}

{#if showToastWarning}
	<Toast
		message="Please review this warning"
		variant="warning"
		position="bottom-right"
		duration={3000}
		onclose={() => (showToastWarning = false)}
	/>
{/if}

{#if showToastError}
	<Toast
		message="An error occurred"
		variant="error"
		position="bottom-right"
		duration={3000}
		onclose={() => (showToastError = false)}
	/>
{/if}

<!-- Command Palette -->
<CommandPalette bind:open={paletteOpen} {commands} placeholder="Search commands..." />

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
