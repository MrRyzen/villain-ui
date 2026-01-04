<script lang="ts">
	import { Text, Card, Grid, Hero, Container, Heading, Badge, Divider, CodeBlock, Panel } from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	const rawInstallCode = `npm install @mrintel/villain-ui`;
	const rawImportCode = `import { Button, Card, Modal } from '@mrintel/villain-ui';\nimport '@mrintel/villain-ui/theme.css';`;

	let installCodeHtml = $state('');
	let importCodeHtml = $state('');

	let installLineCount = $derived.by(() => installCodeHtml ? installCodeHtml.split('\n').length : 1);
	let importLineCount = $derived.by(() => importCodeHtml ? importCodeHtml.split('\n').length : 1);

	onMount(async () => {
		installCodeHtml = await codeToHtml('npm install @mrintel/villain-ui', {
			lang: 'bash',
			theme: 'github-dark'
		});

		importCodeHtml = await codeToHtml(
			`import { Button, Card, Modal } from '@mrintel/villain-ui';\nimport '@mrintel/villain-ui/theme.css';`,
			{
				lang: 'typescript',
				theme: 'github-dark'
			}
		);
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Villain UI</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				The open-source Svelte component library for building modern web applications
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:rocket" class="tag-icon" />
				Svelte 5 Runes
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:sparkles" class="tag-icon" />
				50+ Components
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:palette" class="tag-icon" />
				Glass Morphism
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:moon" class="tag-icon" />
				Dark Theme
			</Badge>
		{/snippet}
	</Hero>
	<Panel padding="sm" rounded variant="glass">
		<Grid cols={2} gap="lg" responsive>
			<Card padding="lg" href="buttons" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:gesture-tap-button" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Buttons</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Explore the versatile button components in Villain UI, designed for seamless interaction
					and stylish interfaces.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Buttons</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="cards" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:credit-card-outline" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Cards</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Dive into Villain UI's card components, perfect for showcasing content with elegance and
					clarity.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Cards</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="data" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:table" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Data Display</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Discover Villain UI's data display components, designed to present information clearly and
					effectively.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Data Display</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="forms" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:form-select" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Forms</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Uncover Villain UI's form components, crafted to enhance user input and streamline data
					collection.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Forms</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="navigation" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:compass-outline" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Navigation</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Explore Villain UI's navigation components, designed to create intuitive and engaging user
					journeys.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Navigation</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="overlays" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:window-closed" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Overlays</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Dive into Villain UI's overlay components, perfect for creating dynamic and interactive
					user experiences.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Overlays</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="typography" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:format-letter-case" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Typography</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Discover Villain UI's typography components, designed to enhance readability and aesthetic
					appeal.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Typography</Text>
				{/snippet}
			</Card>
			<Card padding="lg" href="utilities" target="_self" rel="noopener" class="hover-lift">
				{#snippet iconBefore()}
					<Icon icon="mdi:tools" width="32" height="32" />
				{/snippet}
				{#snippet header()}
					<div class="text-center">
						<Heading level={3}>Utilities</Heading>
					</div>
				{/snippet}
				<Text variant="body" as="p">
					Explore Villain UI's utility components, crafted to simplify development and enhance
					functionality.
				</Text>
				{#snippet footer()}
					<Text color="soft">Explore Utilities</Text>
				{/snippet}
			</Card>
			<div class="span-2">
				<Divider />
			</div>
			<Card padding="lg" class="span-2 accent-surface">
				<Heading level={2}>Getting Started</Heading>
				<CodeBlock
					filename="Terminal"
					showLineNumbers
					lineCount={installLineCount}
					showCopy
					code={rawInstallCode}
				>
					{@html installCodeHtml}
				</CodeBlock>
				<Divider />
				<CodeBlock
					filename="JavaScript"
					showLineNumbers
					lineCount={importLineCount}
					showCopy
					code={rawImportCode}
				>
					{@html importCodeHtml}
				</CodeBlock>
			</Card>
			<div class="span-2">
				<Divider />
			</div>
		</Grid>
	</Panel>
</Container>

<style>
</style>
