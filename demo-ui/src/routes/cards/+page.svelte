<script lang="ts">
	import {
		Text,
		Card,
		Grid,
		Container,
		Heading,
		Divider,
		CodeBlock,
		Panel,
		SectionHeader,
		Hero,
		Badge,
		Button,
		Code
	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const basicCardCode = `import { Card } from '@mrintel/villain-ui';

<Card padding="lg">
  <p>This is a basic card with default styling</p>
</Card>`;

	const cardPaddingCode = `<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>`;

	const cardHeaderFooterCode = `<Card padding="lg">
  {#snippet header()}
    <Heading level={3}>Card Title</Heading>
  {/snippet}

  <Text variant="body">
    Card content goes here
  </Text>

  {#snippet footer()}
    <Button variant="primary" size="sm">Action</Button>
  {/snippet}
</Card>`;

	const clickableCardCode = `<Card
  href="/destination"
  padding="lg"
  class="hover-lift"
>
  {#snippet iconBefore()}
    <Icon icon="lucide:rocket" width="32" />
  {/snippet}

  {#snippet header()}
    <Heading level={3}>Clickable Card</Heading>
  {/snippet}

  <Text variant="body">
    This entire card is a link
  </Text>
</Card>`;

	const panelCode = `import { Panel } from '@mrintel/villain-ui';

<!-- Default variant -->
<Panel padding="lg" rounded>
  <p>Standard panel with raised styling</p>
</Panel>

<!-- Glass variant -->
<Panel padding="lg" rounded variant="glass">
  <p>Glass morphism panel</p>
</Panel>`;

	const gridCode = `import { Grid, Card } from '@mrintel/villain-ui';

<!-- Responsive grid (1 col mobile, 2 tablet, 3 desktop) -->
<Grid cols={3} gap="lg" responsive>
  <Card padding="md">Item 1</Card>
  <Card padding="md">Item 2</Card>
  <Card padding="md">Item 3</Card>
</Grid>

<!-- Fixed 2-column grid -->
<Grid cols={2} gap="md" responsive={false}>
  <Card padding="md">Item 1</Card>
  <Card padding="md">Item 2</Card>
</Grid>`;

	const sectionHeaderCode = `import { SectionHeader } from '@mrintel/villain-ui';

<SectionHeader
  title="Section Title"
  subtitle="Optional subtitle text"
  level={2}
  glow
  align="left"
/>`;

	const dividerCode = `import { Divider } from '@mrintel/villain-ui';

<!-- Horizontal divider -->
<Divider spacing="md" thickness="normal" />

<!-- Vertical divider -->
<Divider orientation="vertical" spacing="sm" />`;

	// State for highlighted code
	let basicCardHtml = $state('');
	let cardPaddingHtml = $state('');
	let cardHeaderFooterHtml = $state('');
	let clickableCardHtml = $state('');
	let panelHtml = $state('');
	let gridHtml = $state('');
	let sectionHeaderHtml = $state('');
	let dividerHtml = $state('');

	onMount(async () => {
		basicCardHtml = await codeToHtml(basicCardCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		cardPaddingHtml = await codeToHtml(cardPaddingCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		cardHeaderFooterHtml = await codeToHtml(cardHeaderFooterCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		clickableCardHtml = await codeToHtml(clickableCardCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		panelHtml = await codeToHtml(panelCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		gridHtml = await codeToHtml(gridCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		sectionHeaderHtml = await codeToHtml(sectionHeaderCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		dividerHtml = await codeToHtml(dividerCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Card Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Dive into Villain UI's card components, perfect for showcasing content with elegance and
				clarity.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layout" class="tag-icon" />
				Card & Panel
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:grid" class="tag-icon" />
				Grid System
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:separator" class="tag-icon" />
				Divider
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:header" class="tag-icon" />
				Section Header
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Basic Card -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Basic Card</Heading>
				<Text variant="body" color="soft">Simple card container with raised styling</Text>
			{/snippet}

			<div class="demo-group">
				<Card padding="lg" class="sample-card">
					<Text variant="body">This is a basic card with default styling and large padding.</Text>
				</Card>
			</div>

			<CodeBlock filename="Card.svelte" showLineNumbers lineCount={3} showCopy code={basicCardCode}>
				{@html basicCardHtml}
			</CodeBlock>
		</Card>

		<!-- Card Padding -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Card Padding</Heading>
				<Text variant="body" color="soft">Four padding sizes to control card spacing</Text>
			{/snippet}

			<div class="demo-stack">
				<Card padding="none" class="sample-card">
					<div class="p-2">
						<Text variant="caption" color="soft">None - No padding</Text>
					</div>
				</Card>
				<Card padding="sm" class="sample-card">
					<Text variant="caption" color="soft">Small - 1rem padding</Text>
				</Card>
				<Card padding="md" class="sample-card">
					<Text variant="caption" color="soft">Medium - 1.5rem padding (default)</Text>
				</Card>
				<Card padding="lg" class="sample-card">
					<Text variant="caption" color="soft">Large - 2rem padding</Text>
				</Card>
			</div>

			<CodeBlock
				filename="Card.svelte"
				showLineNumbers
				lineCount={4}
				showCopy
				code={cardPaddingCode}
			>
				{@html cardPaddingHtml}
			</CodeBlock>
		</Card>

		<!-- Card with Header and Footer -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Card with Header & Footer</Heading>
				<Text variant="body" color="soft">Use snippets to add structured content areas</Text>
			{/snippet}

			<div class="demo-group">
				<Card padding="lg" class="sample-card">
					{#snippet header()}
						<Heading level={3}>Featured Article</Heading>
					{/snippet}

					<Text variant="body">
						The header and footer sections are automatically separated with borders, creating clear
						visual hierarchy within your cards.
					</Text>

					{#snippet footer()}
						<div class="flex gap-2">
							<Button variant="primary" size="sm">Read More</Button>
							<Button variant="ghost" size="sm">Share</Button>
						</div>
					{/snippet}
				</Card>
			</div>

			<CodeBlock
				filename="Card.svelte"
				showLineNumbers
				lineCount={14}
				showCopy
				code={cardHeaderFooterCode}
			>
				{@html cardHeaderFooterHtml}
			</CodeBlock>
		</Card>

		<!-- Clickable Cards -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Clickable Cards</Heading>
				<Text variant="body" color="soft">Make entire cards interactive with href prop</Text>
			{/snippet}

			<Grid cols={3} gap="md" responsive>
				<Card href="/" padding="lg" class="hover-lift">
					{#snippet iconBefore()}
						<Icon icon="lucide:rocket" width="32" height="32" />
					{/snippet}

					{#snippet header()}
						<Heading level={4}>Features</Heading>
					{/snippet}

					<Text variant="body" color="soft">Explore all the amazing features</Text>
				</Card>

				<Card href="/" padding="lg" class="hover-lift">
					{#snippet iconBefore()}
						<Icon icon="lucide:book-open" width="32" height="32" />
					{/snippet}

					{#snippet header()}
						<Heading level={4}>Documentation</Heading>
					{/snippet}

					<Text variant="body" color="soft">Read the complete guide</Text>
				</Card>

				<Card href="/" padding="lg" class="hover-lift">
					{#snippet iconBefore()}
						<Icon icon="lucide:github" width="32" height="32" />
					{/snippet}

					{#snippet header()}
						<Heading level={4}>GitHub</Heading>
					{/snippet}

					<Text variant="body" color="soft">View the source code</Text>
				</Card>
			</Grid>

			<CodeBlock
				filename="Card.svelte"
				showLineNumbers
				lineCount={16}
				showCopy
				code={clickableCardCode}
			>
				{@html clickableCardHtml}
			</CodeBlock>
		</Card>

		<!-- Panel Component -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Panel Component</Heading>
				<Text variant="body" color="soft">Container component with two variants</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Default Variant</Text>
					<Panel padding="lg" rounded>
						<Text variant="body">
							Standard panel with raised styling, perfect for content sections.
						</Text>
					</Panel>
				</div>

				<div>
					<Text variant="caption" color="soft">Glass Variant</Text>
					<Panel padding="lg" rounded variant="glass">
						<Text variant="body">
							Glass morphism panel with enhanced transparency and glow effects.
						</Text>
					</Panel>
				</div>
			</div>

			<CodeBlock filename="Panel.svelte" showLineNumbers lineCount={10} showCopy code={panelCode}>
				{@html panelHtml}
			</CodeBlock>
		</Card>

		<!-- Grid Layout -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Grid Layout</Heading>
				<Text variant="body" color="soft">Responsive grid system for organizing content</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">3-Column Responsive Grid</Text>
					<Grid cols={3} gap="md" responsive>
						<Card padding="md">
							<Text variant="body" color="soft">Item 1</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">Item 2</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">Item 3</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">Item 4</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">Item 5</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">Item 6</Text>
						</Card>
					</Grid>
				</div>

				<div>
					<Text variant="caption" color="soft">2-Column Fixed Grid</Text>
					<Grid cols={2} gap="lg" responsive={false}>
						<Card padding="md">
							<Text variant="body" color="soft">Always 2 columns</Text>
						</Card>
						<Card padding="md">
							<Text variant="body" color="soft">At all breakpoints</Text>
						</Card>
					</Grid>
				</div>

				<div>
					<Text variant="caption" color="soft">Different Gap Sizes</Text>
					<Grid cols={4} gap="sm" responsive>
						<Card padding="sm">
							<Text variant="caption" color="soft">Small gap</Text>
						</Card>
						<Card padding="sm">
							<Text variant="caption" color="soft">Small gap</Text>
						</Card>
						<Card padding="sm">
							<Text variant="caption" color="soft">Small gap</Text>
						</Card>
						<Card padding="sm">
							<Text variant="caption" color="soft">Small gap</Text>
						</Card>
					</Grid>
				</div>
			</div>

			<CodeBlock filename="Grid.svelte" showLineNumbers lineCount={13} showCopy code={gridCode}>
				{@html gridHtml}
			</CodeBlock>
		</Card>

		<!-- Section Header -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Section Header</Heading>
				<Text variant="body" color="soft">
					Semantic header component for organizing page sections
				</Text>
			{/snippet}

			<div class="demo-stack">
				<SectionHeader title="Default Section" subtitle="With glow effect enabled" level={2} />

				<SectionHeader
					title="Centered Section"
					subtitle="Title aligned to center"
					level={3}
					align="center"
				/>

				<SectionHeader title="Without Glow" subtitle="Clean minimal style" level={3} glow={false} />
			</div>

			<CodeBlock
				filename="SectionHeader.svelte"
				showLineNumbers
				lineCount={7}
				showCopy
				code={sectionHeaderCode}
			>
				{@html sectionHeaderHtml}
			</CodeBlock>
		</Card>

		<!-- Divider -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Divider</Heading>
				<Text variant="body" color="soft">Visual separator for content sections</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Horizontal Dividers</Text>
					<Panel padding="md" rounded>
						<Text variant="body">Content above</Text>
						<Divider spacing="sm" />
						<Text variant="body">Content below (small spacing)</Text>
						<Divider spacing="md" />
						<Text variant="body">Content below (medium spacing)</Text>
						<Divider spacing="lg" />
						<Text variant="body">Content below (large spacing)</Text>
					</Panel>
				</div>

				<div>
					<Text variant="caption" color="soft">Vertical Divider</Text>
					<Panel padding="md" rounded>
						<div class="flex items-center gap-4">
							<Text variant="body">Left content</Text>
							<Divider orientation="vertical" />
							<Text variant="body">Right content</Text>
						</div>
					</Panel>
				</div>

				<div>
					<Text variant="caption" color="soft">Strong Variant</Text>
					<Panel padding="md" rounded>
						<Text variant="body">Content above</Text>
						<Divider spacing="md" variant="strong" thickness="thick" />
						<Text variant="body">Content below with stronger border</Text>
					</Panel>
				</div>
			</div>

			<CodeBlock
				filename="Divider.svelte"
				showLineNumbers
				lineCount={6}
				showCopy
				code={dividerCode}
			>
				{@html dividerHtml}
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
					<Heading level={4}>Card vs Panel</Heading>
					<Text variant="body" color="soft">
						Use <Code>Card</Code> for content items with headers, footers, and
						actions. Use <Code>Panel</Code> for larger container sections or backgrounds.
					</Text>
				</div>

				<div>
					<Heading level={4}>Responsive Grids</Heading>
					<Text variant="body" color="soft">
						Enable <Code>responsive</Code> for mobile-first layouts (1 col → 2 col
						→ full). Disable for fixed column counts across all screens.
					</Text>
				</div>

				<div>
					<Heading level={4}>Interactive Cards</Heading>
					<Text variant="body" color="soft">
						Add <Code>href</Code> to make cards clickable links. Combine with
						<Code>hover-lift</Code> class for enhanced interaction feedback.
					</Text>
				</div>

				<div>
					<Heading level={4}>Visual Hierarchy</Heading>
					<Text variant="body" color="soft">
						Use <Code>SectionHeader</Code> to organize pages,
						<Code>Divider</Code> to separate content, and varying card padding to
						create depth.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	/* Demo utilities */
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
