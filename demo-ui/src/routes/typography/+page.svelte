<script lang="ts">
	import {
		Text,
		Card,
		Grid,
		Container,
		Heading,
		Divider,
		CodeBlock,
		Code,
		Hero,
		Badge
	} from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const headingCode = `import { Heading } from '@mrintel/villain-ui';

<Heading level={1}>Heading Level 1</Heading>
<Heading level={2}>Heading Level 2</Heading>
<Heading level={3}>Heading Level 3</Heading>
<Heading level={4}>Heading Level 4</Heading>
<Heading level={5}>Heading Level 5</Heading>
<Heading level={6}>Heading Level 6</Heading>`;

	const headingVariantsCode = `<!-- Default variant -->
<Heading level={1} variant="default">Default Heading</Heading>

<!-- Accent variant -->
<Heading level={1} variant="accent">Accent Heading</Heading>

<!-- Gradient variant -->
<Heading level={1} variant="gradient">Gradient Heading</Heading>

<!-- With glow effect -->
<Heading level={1} variant="accent" glow>Glowing Heading</Heading>`;

	const textCode = `import { Text } from '@mrintel/villain-ui';

<!-- Body text (default) -->
<Text variant="body">This is body text.</Text>

<!-- Caption text -->
<Text variant="caption">This is caption text.</Text>`;

	const textColorsCode = `<!-- Default color -->
<Text color="default">Default text color</Text>

<!-- Soft color -->
<Text color="soft">Soft text color</Text>

<!-- Muted color -->
<Text color="muted">Muted text color</Text>

<!-- Status colors -->
<Text color="success">Success text</Text>
<Text color="warning">Warning text</Text>
<Text color="error">Error text</Text>`;

	const textWeightsCode = `<Text weight="normal">Normal weight text</Text>
<Text weight="semibold">Semibold weight text</Text>
<Text weight="bold">Bold weight text</Text>`;

	const codeCode = `import { Code } from '@mrintel/villain-ui';

<p>Use the <Code>npm install</Code> command to install packages.</p>
<p>The <Code>useState</Code> hook is a React feature.</p>`;

	const combinationCode = `<Heading level={2} variant="accent" glow>
  Feature Highlights
</Heading>
<Text variant="body" color="soft">
  Our platform uses <Code>cutting-edge</Code> technology to deliver
  exceptional performance and reliability.
</Text>

<Heading level={3}>Technical Details</Heading>
<Text variant="body">
  Built with modern frameworks including <Code>React</Code>,
  <Code>TypeScript</Code>, and <Code>Tailwind CSS</Code>.
</Text>`;

	// State for highlighted code
	let headingHtml = $state('');
	let headingVariantsHtml = $state('');
	let textHtml = $state('');
	let textColorsHtml = $state('');
	let textWeightsHtml = $state('');
	let codeHtml = $state('');
	let combinationHtml = $state('');

	onMount(async () => {
		headingHtml = await codeToHtml(headingCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		headingVariantsHtml = await codeToHtml(headingVariantsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		textHtml = await codeToHtml(textCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		textColorsHtml = await codeToHtml(textColorsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		textWeightsHtml = await codeToHtml(textWeightsCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		codeHtml = await codeToHtml(codeCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});

		combinationHtml = await codeToHtml(combinationCode, {
			lang: 'svelte',
			theme: 'github-dark'
		});
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Typography</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Beautiful, scalable typography components with variants, colors, and semantic HTML elements
				for perfect text hierarchy.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:type" class="tag-icon" />
				Type Scale
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:palette" class="tag-icon" />
				Color Variants
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:sparkles" class="tag-icon" />
				Glow Effects
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:code" class="tag-icon" />
				Inline Code
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Headings -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Headings</Heading>
				<Text variant="body" color="soft">Six levels of headings with semantic HTML</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Heading level={1}>Heading Level 1</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 2.5rem (40px)</Text>
				</div>

				<div>
					<Heading level={2}>Heading Level 2</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 2rem (32px)</Text>
				</div>

				<div>
					<Heading level={3}>Heading Level 3</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 1.75rem (28px)</Text>
				</div>

				<div>
					<Heading level={4}>Heading Level 4</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 1.5rem (24px)</Text>
				</div>

				<div>
					<Heading level={5}>Heading Level 5</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 1.25rem (20px)</Text>
				</div>

				<div>
					<Heading level={6}>Heading Level 6</Heading>
					<Text variant="caption" color="muted">Font: Poppins, 1rem (16px)</Text>
				</div>
			</div>

			<CodeBlock
				filename="Heading.svelte"
				showLineNumbers
				lineCount={headingCode.split('\n').length}
				showCopy
				code={headingCode}
			>
				{@html headingHtml}
			</CodeBlock>
		</Card>

		<!-- Heading Variants -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Heading Variants</Heading>
				<Text variant="body" color="soft">Different styles and effects for headings</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Default variant</Text>
					<Heading level={2} variant="default">Default Heading Style</Heading>
				</div>

				<div>
					<Text variant="caption" color="soft">Accent variant</Text>
					<Heading level={2} variant="accent">Accent Heading Style</Heading>
				</div>

				<div>
					<Text variant="caption" color="soft">Gradient variant</Text>
					<Heading level={2} variant="gradient">Gradient Heading Style</Heading>
				</div>

				<div>
					<Text variant="caption" color="soft">With glow effect</Text>
					<Heading level={2} variant="accent" glow>Glowing Accent Heading</Heading>
				</div>
			</div>

			<CodeBlock
				filename="Heading.svelte"
				showLineNumbers
				lineCount={headingVariantsCode.split('\n').length}
				showCopy
				code={headingVariantsCode}
			>
				{@html headingVariantsHtml}
			</CodeBlock>
		</Card>

		<!-- Text Variants -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Text Variants</Heading>
				<Text variant="body" color="soft">Body and caption text sizes</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Body text (default)</Text>
					<Text variant="body">
						This is body text. It's perfect for paragraphs, descriptions, and general content. The
						font is Inter with a comfortable reading size and line height.
					</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Caption text</Text>
					<Text variant="caption">
						This is caption text. It's smaller and great for labels, hints, metadata, and
						supplementary information.
					</Text>
				</div>
			</div>

			<CodeBlock
				filename="Text.svelte"
				showLineNumbers
				lineCount={textCode.split('\n').length}
				showCopy
				code={textCode}
			>
				{@html textHtml}
			</CodeBlock>
		</Card>

		<!-- Text Colors -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Text Colors</Heading>
				<Text variant="body" color="soft">Semantic color options for text</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Default color (high contrast)</Text>
					<Text variant="body" color="default">
						This text uses the default color for high readability.
					</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Soft color (medium contrast)</Text>
					<Text variant="body" color="soft">
						This text uses soft color for secondary content and descriptions.
					</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Muted color (low contrast)</Text>
					<Text variant="body" color="muted">
						This text uses muted color for tertiary information and placeholders.
					</Text>
				</div>

				<Divider />

				<div>
					<Text variant="caption" color="soft">Status colors</Text>
					<div class="flex flex-col gap-2">
						<Text variant="body" color="success">Success: Operation completed successfully</Text>
						<Text variant="body" color="warning">Warning: Please review this action</Text>
						<Text variant="body" color="error">Error: Something went wrong</Text>
					</div>
				</div>
			</div>

			<CodeBlock
				filename="Text.svelte"
				showLineNumbers
				lineCount={textColorsCode.split('\n').length}
				showCopy
				code={textColorsCode}
			>
				{@html textColorsHtml}
			</CodeBlock>
		</Card>

		<!-- Text Weights -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Text Weights</Heading>
				<Text variant="body" color="soft">Font weight options for emphasis</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Text variant="caption" color="soft">Normal weight (400)</Text>
					<Text variant="body" weight="normal">
						This is normal weight text, perfect for regular body content.
					</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Semibold weight (600)</Text>
					<Text variant="body" weight="semibold">
						This is semibold text, great for subtle emphasis and subheadings.
					</Text>
				</div>

				<div>
					<Text variant="caption" color="soft">Bold weight (700)</Text>
					<Text variant="body" weight="bold">
						This is bold text, ideal for strong emphasis and important information.
					</Text>
				</div>
			</div>

			<CodeBlock
				filename="Text.svelte"
				showLineNumbers
				lineCount={textWeightsCode.split('\n').length}
				showCopy
				code={textWeightsCode}
			>
				{@html textWeightsHtml}
			</CodeBlock>
		</Card>

		<!-- Code -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Inline Code</Heading>
				<Text variant="body" color="soft">Styled code snippets within text</Text>
			{/snippet}

			<div class="demo-stack">
				<Text variant="body">
					Use the <Code>npm install</Code> command to install packages from npm.
				</Text>

				<Text variant="body">
					The <Code>useState</Code> hook is a fundamental React feature for managing state.
				</Text>

				<Text variant="body">
					Set the environment variable using <Code>export NODE_ENV=production</Code> in your
					terminal.
				</Text>

				<Text variant="body" color="soft">
					The inline code component uses <Code>IBM Plex Mono</Code> font with accent highlighting
					and hover effects.
				</Text>
			</div>

			<CodeBlock
				filename="Code.svelte"
				showLineNumbers
				lineCount={codeCode.split('\n').length}
				showCopy
				code={codeCode}
			>
				{@html codeHtml}
			</CodeBlock>
		</Card>

		<!-- Combinations -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Typography Combinations</Heading>
				<Text variant="body" color="soft">Mixing headings, text, and code effectively</Text>
			{/snippet}

			<div class="demo-stack">
				<div class="space-y-4">
					<Heading level={2} variant="accent" glow>Feature Highlights</Heading>
					<Text variant="body" color="soft">
						Our platform uses <Code>cutting-edge</Code> technology to deliver exceptional
						performance and reliability. Built for developers who demand the best.
					</Text>

					<Heading level={3}>Technical Stack</Heading>
					<Text variant="body">
						The architecture is powered by <Code>React</Code>, <Code>TypeScript</Code>, and
						<Code>Tailwind CSS</Code>, ensuring type safety and rapid development.
					</Text>

					<Heading level={4}>Getting Started</Heading>
					<Text variant="body" color="soft">
						Install the package with <Code>npm install @mrintel/villain-ui</Code> and import
						components as needed.
					</Text>
				</div>
			</div>

			<CodeBlock
				filename="Example.svelte"
				showLineNumbers
				lineCount={combinationCode.split('\n').length}
				showCopy
				code={combinationCode}
			>
				{@html combinationHtml}
			</CodeBlock>
		</Card>

		<Divider />

		<!-- Type Scale Reference -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Type Scale Reference</Heading>
				<Text variant="body" color="soft">Complete typography system specifications</Text>
			{/snippet}

			<div class="demo-stack">
				<div>
					<Heading level={3}>Headings</Heading>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<div class="glass-panel p-4 rounded-lg">
							<Code>H1</Code>
							<Text variant="caption" color="soft">
								Size: 2.5rem (40px)<br />
								Weight: 700<br />
								Line Height: 1.2<br />
								Font: Poppins
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>H2</Code>
							<Text variant="caption" color="soft">
								Size: 2rem (32px)<br />
								Weight: 700<br />
								Line Height: 1.3<br />
								Font: Poppins
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>H3</Code>
							<Text variant="caption" color="soft">
								Size: 1.75rem (28px)<br />
								Weight: 600<br />
								Line Height: 1.4<br />
								Font: Poppins
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>H4</Code>
							<Text variant="caption" color="soft">
								Size: 1.5rem (24px)<br />
								Weight: 600<br />
								Line Height: 1.4<br />
								Font: Poppins
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>H5</Code>
							<Text variant="caption" color="soft">
								Size: 1.25rem (20px)<br />
								Weight: 600<br />
								Line Height: 1.5<br />
								Font: Poppins
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>H6</Code>
							<Text variant="caption" color="soft">
								Size: 1rem (16px)<br />
								Weight: 600<br />
								Line Height: 1.5<br />
								Font: Poppins
							</Text>
						</div>
					</div>
				</div>

				<div>
					<Heading level={3}>Body Text</Heading>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<div class="glass-panel p-4 rounded-lg">
							<Code>Body</Code>
							<Text variant="caption" color="soft">
								Size: 1rem (16px)<br />
								Weight: 400<br />
								Line Height: 1.6<br />
								Font: Inter
							</Text>
						</div>

						<div class="glass-panel p-4 rounded-lg">
							<Code>Caption</Code>
							<Text variant="caption" color="soft">
								Size: 0.875rem (14px)<br />
								Weight: 400<br />
								Line Height: 1.5<br />
								Font: Inter
							</Text>
						</div>
					</div>
				</div>

				<div>
					<Heading level={3}>Monospace</Heading>
					<div class="grid grid-cols-1 gap-4 mt-4">
						<div class="glass-panel p-4 rounded-lg">
							<Code>Code</Code>
							<Text variant="caption" color="soft">
								Size: 0.9em (relative to parent)<br />
								Weight: 400<br />
								Font: IBM Plex Mono
							</Text>
						</div>
					</div>
				</div>
			</div>
		</Card>

		<!-- Usage Tips -->
		<Card padding="lg" class="accent-surface">
			{#snippet header()}
				<Heading level={2}>Usage Tips</Heading>
			{/snippet}

			<Grid cols={2} gap="lg">
				<div>
					<Heading level={4}>Hierarchy</Heading>
					<Text variant="body" color="soft">
						Use heading levels semantically (H1 for page title, H2 for sections, etc.). Don't skip
						levels for styling - use the <Code>as</Code> prop to change the HTML element while
						maintaining visual hierarchy.
					</Text>
				</div>

				<div>
					<Heading level={4}>Color Contrast</Heading>
					<Text variant="body" color="soft">
						Default color provides highest contrast for body text. Use soft for secondary content
						and muted for labels. Status colors should be used sparingly for meaningful information.
					</Text>
				</div>

				<div>
					<Heading level={4}>Visual Effects</Heading>
					<Text variant="body" color="soft">
						The <Code>glow</Code> effect adds emphasis to headings. Gradient variant creates
						eye-catching titles. Use these effects strategically to draw attention to key content.
					</Text>
				</div>

				<div>
					<Heading level={4}>Inline Code</Heading>
					<Text variant="body" color="soft">
						Use <Code>Code</Code> for variable names, commands, file names, and short code snippets
						within text. For multi-line code, use the CodeBlock component instead.
					</Text>
				</div>

				<div>
					<Heading level={4}>Accessibility</Heading>
					<Text variant="body" color="soft">
						All typography components render semantic HTML elements with proper heading structure.
						Color contrast meets WCAG AA standards. Use the <Code>as</Code> prop to maintain
						semantic HTML.
					</Text>
				</div>

				<div>
					<Heading level={4}>Responsive Text</Heading>
					<Text variant="body" color="soft">
						The type scale is designed to work across all screen sizes. Font sizes use rem units for
						better scalability. Line heights are optimized for readability.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	/* Demo layout utilities */
	.demo-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
</style>
