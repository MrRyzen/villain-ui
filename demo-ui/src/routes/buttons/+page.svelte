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
		IconButton,
		ButtonGroup,
		LinkButton,
		FloatingActionButton,
		Hero,
		Badge,
		Code
	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const basicButtonCode = `import { Button } from '@mrintel/villain-ui';

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="ghost">Ghost Button</Button>`;

	const buttonSizesCode = `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`;

	const buttonIconsCode = `<Button variant="primary">
  {#snippet iconBefore()}
    <Icon icon="lucide:rocket" />
  {/snippet}
  Launch
</Button>

<Button variant="secondary">
  Download
  {#snippet iconAfter()}
    <Icon icon="lucide:download" />
  {/snippet}
</Button>`;

	const iconButtonCode = `import { IconButton } from '@mrintel/villain-ui';

<IconButton ariaLabel="Settings" variant="primary">
  <Icon icon="lucide:settings" />
</IconButton>

<IconButton ariaLabel="Search" shape="square">
  <Icon icon="lucide:search" />
</IconButton>`;

	const buttonGroupCode = `import { ButtonGroup, Button } from '@mrintel/villain-ui';

<ButtonGroup>
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>

<ButtonGroup spacing>
  <Button variant="primary">Save</Button>
  <Button variant="ghost">Cancel</Button>
</ButtonGroup>`;

	const linkButtonCode = `import { LinkButton } from '@mrintel/villain-ui';

<LinkButton href="/docs" variant="primary">
  View Documentation
</LinkButton>

<LinkButton href="https://github.com" target="_blank">
  {#snippet iconBefore()}
    <Icon icon="lucide:github" />
  {/snippet}
  GitHub
</LinkButton>`;

	const fabCode = `import { FloatingActionButton } from '@mrintel/villain-ui';

<FloatingActionButton
  ariaLabel="Add item"
  position="bottom-right"
>
  <Icon icon="lucide:plus" width="24" height="24" />
</FloatingActionButton>`;

	// State for highlighted code
	let basicButtonHtml = $state('');
	let buttonSizesHtml = $state('');
	let buttonIconsHtml = $state('');
	let iconButtonHtml = $state('');
	let buttonGroupHtml = $state('');
	let linkButtonHtml = $state('');
	let fabHtml = $state('');

	let showFab = $state(false);

	onMount(async () => {
		basicButtonHtml = await codeToHtml(basicButtonCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		buttonSizesHtml = await codeToHtml(buttonSizesCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		buttonIconsHtml = await codeToHtml(buttonIconsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		iconButtonHtml = await codeToHtml(iconButtonCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		buttonGroupHtml = await codeToHtml(buttonGroupCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		linkButtonHtml = await codeToHtml(linkButtonCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		fabHtml = await codeToHtml(fabCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Button Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Explore the versatile button components in Villain UI, designed for seamless interaction and
				stylish interfaces.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:cursor-click" class="tag-icon" />
				Multiple Variants
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:arrows-expand" class="tag-icon" />
				Sizes & Icons
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layers" class="tag-icon" />
				Button Groups
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:flash" class="tag-icon" />
				Floating Action Button
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Basic Button Variants -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Button Variants</Heading>
				<Text variant="body" color="soft">Three distinct button styles for different use cases</Text
				>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary">Primary Button</Button>
				<Button variant="secondary">Secondary Button</Button>
				<Button variant="ghost">Ghost Button</Button>
				<Button variant="primary" disabled>Disabled Button</Button>
			</div>

			<CodeBlock
				filename="Button.svelte"
				showLineNumbers
				lineCount={basicButtonCode.split('\n').length}
				showCopy
				code={basicButtonCode}
			>
				{@html basicButtonHtml}
			</CodeBlock>
		</Card>

		<!-- Button Sizes -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Button Sizes</Heading>
				<Text variant="body" color="soft">Three sizes to fit any interface need</Text>
			{/snippet}

			<div class="demo-group items-center">
				<Button variant="primary" size="sm">Small</Button>
				<Button variant="primary" size="md">Medium</Button>
				<Button variant="primary" size="lg">Large</Button>
			</div>

			<CodeBlock
				filename="Button.svelte"
				showLineNumbers
				lineCount={buttonSizesCode.split('\n').length}
				showCopy
				code={buttonSizesCode}
			>
				{@html buttonSizesHtml}
			</CodeBlock>
		</Card>

		<!-- Buttons with Icons -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Buttons with Icons</Heading>
				<Text variant="body" color="soft">Add icons before or after button text</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary">
					{#snippet iconBefore()}
						<Icon icon="lucide:rocket" />
					{/snippet}
					Launch
				</Button>
				<Button variant="secondary">
					Download
					{#snippet iconAfter()}
						<Icon icon="lucide:download" />
					{/snippet}
				</Button>
				<Button variant="ghost">
					{#snippet iconBefore()}
						<Icon icon="lucide:sparkles" />
					{/snippet}
					Magic
					{#snippet iconAfter()}
						<Icon icon="lucide:sparkles" />
					{/snippet}
				</Button>
			</div>

			<CodeBlock
				filename="Button.svelte"
				showLineNumbers
				lineCount={buttonIconsCode.split('\n').length}
				showCopy
				code={buttonIconsCode}
			>
				{@html buttonIconsHtml}
			</CodeBlock>
		</Card>

		<!-- Icon Buttons -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Icon Buttons</Heading>
				<Text variant="body" color="soft">Compact icon-only buttons in circle or square shapes</Text
				>
			{/snippet}

			<div class="demo-group items-center">
				<div class="flex gap-2">
					<IconButton ariaLabel="Settings" variant="primary" shape="circle">
						<Icon icon="lucide:settings" />
					</IconButton>
					<IconButton ariaLabel="Search" variant="secondary" shape="circle">
						<Icon icon="lucide:search" />
					</IconButton>
					<IconButton ariaLabel="Menu" variant="ghost" shape="circle">
						<Icon icon="lucide:menu" />
					</IconButton>
				</div>
				<Divider orientation="vertical" />
				<div class="flex gap-2">
					<IconButton ariaLabel="Heart" variant="primary" shape="square">
						<Icon icon="lucide:heart" />
					</IconButton>
					<IconButton ariaLabel="Star" variant="secondary" shape="square">
						<Icon icon="lucide:star" />
					</IconButton>
					<IconButton ariaLabel="Bell" variant="ghost" shape="square">
						<Icon icon="lucide:bell" />
					</IconButton>
				</div>
			</div>

			<CodeBlock
				filename="IconButton.svelte"
				showLineNumbers
				lineCount={iconButtonCode.split('\n').length}
				showCopy
				code={iconButtonCode}
			>
				{@html iconButtonHtml}
			</CodeBlock>
		</Card>

		<!-- Button Groups -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Button Groups</Heading>
				<Text variant="body" color="soft"
					>Group related buttons together horizontally or vertically</Text
				>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Merged (Horizontal)</Text>
					<ButtonGroup>
						<Button variant="secondary">Left</Button>
						<Button variant="secondary">Center</Button>
						<Button variant="secondary">Right</Button>
					</ButtonGroup>
				</div>

				<div>
					<Text variant="caption" color="soft">Spaced (Horizontal)</Text>
					<ButtonGroup spacing>
						<Button variant="primary">Save</Button>
						<Button variant="secondary">Cancel</Button>
						<Button variant="ghost">Reset</Button>
					</ButtonGroup>
				</div>

				<div>
					<Text variant="caption" color="soft">Vertical</Text>
					<ButtonGroup orientation="vertical">
						<Button variant="secondary">Top</Button>
						<Button variant="secondary">Middle</Button>
						<Button variant="secondary">Bottom</Button>
					</ButtonGroup>
				</div>
			</div>

			<CodeBlock
				filename="ButtonGroup.svelte"
				showLineNumbers
				lineCount={buttonGroupCode.split('\n').length}
				showCopy
				code={buttonGroupCode}
			>
				{@html buttonGroupHtml}
			</CodeBlock>
		</Card>

		<!-- Link Buttons -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Link Buttons</Heading>
				<Text variant="body" color="soft">Styled links that look like buttons</Text>
			{/snippet}

			<div class="demo-group">
				<LinkButton href="/" variant="primary">Go Home</LinkButton>
				<LinkButton href="https://github.com" target="_blank" variant="secondary">
					{#snippet iconBefore()}
						<Icon icon="lucide:external-link" />
					{/snippet}
					External Link
				</LinkButton>
				<LinkButton href="/docs" variant="ghost">
					Documentation
					{#snippet iconAfter()}
						<Icon icon="lucide:arrow-right" />
					{/snippet}
				</LinkButton>
			</div>

			<CodeBlock
				filename="LinkButton.svelte"
				showLineNumbers
				lineCount={linkButtonCode.split('\n').length}
				showCopy
				code={linkButtonCode}
			>
				{@html linkButtonHtml}
			</CodeBlock>
		</Card>

		<!-- Floating Action Button -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Floating Action Button</Heading>
				<Text variant="body" color="soft">Fixed position button for primary actions</Text>
			{/snippet}

			<div class="demo-group">
				<Button variant="primary" onclick={() => (showFab = !showFab)}>
					{showFab ? 'Hide' : 'Show'} FAB Demo
				</Button>
				<Text variant="caption" color="soft">
					Toggle to see the floating action button in the bottom-right corner
				</Text>
			</div>

			<CodeBlock
				filename="FloatingActionButton.svelte"
				showLineNumbers
				lineCount={fabCode.split('\n').length}
				showCopy
				code={fabCode}
			>
				{@html fabHtml}
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
					<Heading level={4}>Variant Selection</Heading>
					<Text variant="body" color="soft">
						Use <Code>primary</Code> for main actions,
						<Code>secondary</Code> for supporting actions, and
						<Code>ghost</Code> for subtle interactions.
					</Text>
				</div>

				<div>
					<Heading level={4}>Accessibility</Heading>
					<Text variant="body" color="soft">
						Always provide <Code>ariaLabel</Code> for IconButton and FloatingActionButton
						to ensure screen reader compatibility.
					</Text>
				</div>

				<div>
					<Heading level={4}>Icon Integration</Heading>
					<Text variant="body" color="soft">
						Use the <Code>iconBefore</Code> and
						<Code>iconAfter</Code> snippets to add icons. Works great with @iconify/svelte
						or any icon library.
					</Text>
				</div>

				<div>
					<Heading level={4}>Button Groups</Heading>
					<Text variant="body" color="soft">
						Use merged ButtonGroups for toggle buttons or segmented controls. Use spaced groups for
						related actions that need visual separation.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

{#if showFab}
	<FloatingActionButton
		ariaLabel="Add new item"
		position="bottom-right"
		onclick={() => alert('FAB clicked!')}
	>
		<Icon icon="lucide:plus" width="24" height="24" />
	</FloatingActionButton>
{/if}

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
