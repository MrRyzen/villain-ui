<script lang="ts">
	import {
		Button,
		IconButton,
		ButtonGroup,
		LinkButton,
		FloatingActionButton,
		Card,
		Grid,
		Container,
		Heading,
		Text,
		Table,
		type TableColumn,
		type SortDirection,
		Divider,
		Checkbox,
	} from '@mrintel/villain-ui';
	import Icon from '@iconify/svelte';

	// State for interactive controls
	let disabledState = $state(false);
	let loadingState = $state(false);
	let selectedVariant = $state<'primary' | 'secondary' | 'ghost'>('primary');
	let selectedSize = $state<'sm' | 'md' | 'lg'>('md');
	let fabVisible = $state(true);
	let fabPosition = $state<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
	let fabSize = $state<'md' | 'lg'>('md');

	// Props table columns
	const propsColumns: TableColumn[] = [
		{ key: 'prop', label: 'Prop', sortable: true },
		{ key: 'type', label: 'Type', sortable: true },
		{ key: 'default', label: 'Default' },
		{ key: 'description', label: 'Description' }
	];

	// Button component props
	const buttonPropsData = [
		{ prop: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Visual style variant' },
		{ prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
		{ prop: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
		{ prop: 'href', type: 'string', default: 'undefined', description: 'Renders as link if provided' },
		{ prop: 'target', type: 'string', default: 'undefined', description: 'Link target attribute' },
		{ prop: 'onclick', type: 'function', default: 'undefined', description: 'Click event handler' },
		{ prop: 'iconBefore', type: 'Snippet', default: 'undefined', description: 'Icon before text' },
		{ prop: 'iconAfter', type: 'Snippet', default: 'undefined', description: 'Icon after text' },
		{ prop: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
	];

	// IconButton component props
	const iconButtonPropsData = [
		{ prop: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'ghost'", description: 'Visual style variant' },
		{ prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
		{ prop: 'shape', type: "'circle' | 'square'", default: "'circle'", description: 'Button shape' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
		{ prop: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
		{ prop: 'ariaLabel', type: 'string', default: 'required', description: 'Accessible label (required for screen readers)' },
		{ prop: 'onclick', type: 'function', default: 'undefined', description: 'Click event handler' },
		{ prop: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
	];

	// ButtonGroup component props
	const buttonGroupPropsData = [
		{ prop: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Button arrangement direction' },
		{ prop: 'spacing', type: 'boolean', default: 'false', description: 'Add spacing between buttons (instead of merged borders)' },
		{ prop: 'children', type: 'Snippet', default: 'required', description: 'Button components to group' }
	];

	// LinkButton component props
	const linkButtonPropsData = [
		{ prop: 'href', type: 'string', default: 'required', description: 'Link destination URL' },
		{ prop: 'variant', type: "'primary' | 'secondary' | 'ghost'", default: "'primary'", description: 'Visual style variant' },
		{ prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
		{ prop: 'target', type: 'string', default: 'undefined', description: 'Link target (_blank, _self, etc.)' },
		{ prop: 'rel', type: 'string', default: 'undefined', description: 'Link relationship' },
		{ prop: 'iconBefore', type: 'Snippet', default: 'undefined', description: 'Icon before text' },
		{ prop: 'iconAfter', type: 'Snippet', default: 'undefined', description: 'Icon after text' },
		{ prop: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
	];

	// FloatingActionButton component props
	const fabPropsData = [
		{ prop: 'position', type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'", default: "'bottom-right'", description: 'FAB position on screen' },
		{ prop: 'size', type: "'md' | 'lg'", default: "'lg'", description: 'Button size' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
		{ prop: 'ariaLabel', type: 'string', default: 'required', description: 'Accessible label (required for screen readers)' },
		{ prop: 'onclick', type: 'function', default: 'undefined', description: 'Click event handler' },
		{ prop: 'class', type: 'string', default: "''", description: 'Additional CSS classes' }
	];
</script>

<!-- Hero Section -->
<Container>
	<div class="demo-section">
		<Heading glow={true} level={1} variant="gradient">Button Components</Heading>
		<Text>
			5 interactive button components with icon support, variants, and accessibility features
		</Text>
		<div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
			<span class="feature-tag">5 Components</span>
			<span class="feature-tag">Icon Support</span>
			<span class="feature-tag">Accessible</span>
			<span class="feature-tag">Responsive</span>
		</div>
	</div>

	<!-- Button Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Button</Heading>
			<Text>Primary interactive element with variants, sizes, and icon support</Text>

			<Divider />

			<!-- Interactive Controls -->
			<div class="controls-section">
				<Grid cols={2} gap="md">
					<div>
						<Checkbox bind:checked={disabledState} label="Disabled" />
					</div>
					<div>
						<Checkbox bind:checked={loadingState} label="Loading" />
					</div>
					<div>
						<div style="margin-bottom: 0.5rem;"><Text variant="caption">Variant:</Text></div>
						<div style="display: flex; gap: 0.5rem;">
							<Button
								size="sm"
								variant={selectedVariant === 'primary' ? 'primary' : 'ghost'}
								onclick={() => (selectedVariant = 'primary')}
							>
								Primary
							</Button>
							<Button
								size="sm"
								variant={selectedVariant === 'secondary' ? 'primary' : 'ghost'}
								onclick={() => (selectedVariant = 'secondary')}
							>
								Secondary
							</Button>
							<Button
								size="sm"
								variant={selectedVariant === 'ghost' ? 'primary' : 'ghost'}
								onclick={() => (selectedVariant = 'ghost')}
							>
								Ghost
							</Button>
						</div>
					</div>
					<div>
						<div style="margin-bottom: 0.5rem;">
							<Text variant="caption">Size:</Text>
						</div>
						<div style="display: flex; gap: 0.5rem;">
							<Button
								size="sm"
								variant={selectedSize === 'sm' ? 'primary' : 'ghost'}
								onclick={() => (selectedSize = 'sm')}
							>
								SM
							</Button>
							<Button
								size="sm"
								variant={selectedSize === 'md' ? 'primary' : 'ghost'}
								onclick={() => (selectedSize = 'md')}
							>
								MD
							</Button>
							<Button
								size="sm"
								variant={selectedSize === 'lg' ? 'primary' : 'ghost'}
								onclick={() => (selectedSize = 'lg')}
							>
								LG
							</Button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Live Examples -->
			<div class="examples-grid">
				<Heading level={4}>Variants</Heading>
				<Grid cols={3} gap="md">
					<Button variant="primary" size={selectedSize} disabled={disabledState}>
						Primary Button
					</Button>
					<Button variant="secondary" size={selectedSize} disabled={disabledState}>
						Secondary Button
					</Button>
					<Button variant="ghost" size={selectedSize} disabled={disabledState}>Ghost Button</Button>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Sizes</Heading>
				</div>
				<Grid cols={3} gap="md">
					<Button variant={selectedVariant} size="sm">Small Button</Button>
					<Button variant={selectedVariant} size="md">Medium Button</Button>
					<Button variant={selectedVariant} size="lg">Large Button</Button>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>With Icons</Heading>
				</div>
				<Grid cols={3} gap="md">
					<Button variant={selectedVariant} size={selectedSize}>
						{#snippet iconBefore()}
							<Icon icon="lucide:plus" />
						{/snippet}
						Icon Before
					</Button>
					<Button variant={selectedVariant} size={selectedSize}>
						{#snippet iconAfter()}
							<Icon icon="lucide:arrow-right" />
						{/snippet}
						Icon After
					</Button>
					<Button variant={selectedVariant} size={selectedSize}>
						{#snippet iconBefore()}
							<Icon icon="lucide:upload" />
						{/snippet}
						{#snippet iconAfter()}
							<Icon icon="lucide:check" />
						{/snippet}
						Both Icons
					</Button>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Loading State</Heading>
				</div>
				<Grid cols={3} gap="md">
					<Button variant="primary" disabled={loadingState}>
						{#snippet iconBefore()}
							{#if loadingState}
								<Icon icon="lucide:loader-2" class="animate-spin" />
							{:else}
								<Icon icon="lucide:save" />
							{/if}
						{/snippet}
						{loadingState ? 'Saving...' : 'Save'}
					</Button>
					<Button variant="secondary" disabled={loadingState}>
						{#snippet iconBefore()}
							{#if loadingState}
								<Icon icon="lucide:loader-2" class="animate-spin" />
							{/if}
						{/snippet}
						{loadingState ? 'Loading...' : 'Load Data'}
					</Button>
					<Button variant="ghost" disabled={loadingState}>
						{#snippet iconBefore()}
							{#if loadingState}
								<Icon icon="lucide:loader-2" class="animate-spin" />
							{/if}
						{/snippet}
						{loadingState ? 'Processing...' : 'Process'}
					</Button>
				</Grid>
			</div>

			<Divider />

			<!-- Props Table -->
			<Heading level={4}>Props Reference</Heading>
			<Table columns={propsColumns} data={buttonPropsData} compact striped />
		</Card>
	</div>

	<!-- IconButton Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>IconButton</Heading>
			<Text>Compact icon-only button with shape variants</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Variants</Heading>
				<Grid cols={4} gap="md">
					<IconButton variant="primary" ariaLabel="Settings">
						<Icon icon="lucide:settings" />
					</IconButton>
					<IconButton variant="secondary" ariaLabel="Settings">
						<Icon icon="lucide:settings" />
					</IconButton>
					<IconButton variant="ghost" ariaLabel="Settings">
						<Icon icon="lucide:settings" />
					</IconButton>
					<IconButton variant="primary" disabled ariaLabel="Settings">
						<Icon icon="lucide:settings" />
					</IconButton>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Sizes</Heading>
				</div>
				<Grid cols={4} gap="md">
					<IconButton size="sm" ariaLabel="Like">
						<Icon icon="lucide:heart" />
					</IconButton>
					<IconButton size="md" ariaLabel="Like">
						<Icon icon="lucide:heart" />
					</IconButton>
					<IconButton size="lg" ariaLabel="Like">
						<Icon icon="lucide:heart" />
					</IconButton>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Shapes</Heading>
				</div>
				<Grid cols={4} gap="md">
					<IconButton shape="circle" ariaLabel="Favorite">
						<Icon icon="lucide:star" />
					</IconButton>
					<IconButton shape="square" ariaLabel="Favorite">
						<Icon icon="lucide:star" />
					</IconButton>
					<IconButton shape="circle" variant="secondary" ariaLabel="Bookmark">
						<Icon icon="lucide:bookmark" />
					</IconButton>
					<IconButton shape="square" variant="ghost" ariaLabel="Share">
						<Icon icon="lucide:share-2" />
					</IconButton>
				</Grid>

				<div style="margin-top: 2rem;">
					<Heading level={4}>Action Examples</Heading>
				</div>
				<Grid cols={4} gap="md">
					<IconButton variant="primary" ariaLabel="Edit">
						<Icon icon="lucide:edit" />
					</IconButton>
					<IconButton variant="secondary" ariaLabel="Delete">
						<Icon icon="lucide:trash" />
					</IconButton>
					<IconButton variant="ghost" ariaLabel="More options">
						<Icon icon="lucide:more-vertical" />
					</IconButton>
					<IconButton variant="primary" disabled ariaLabel="Delete (disabled)">
						<Icon icon="lucide:trash" />
					</IconButton>
				</Grid>
			</div>

			<Divider />

			<Heading level={4}>Props Reference</Heading>
			<Table columns={propsColumns} data={iconButtonPropsData} compact striped />
		</Card>
	</div>

	<!-- ButtonGroup Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>ButtonGroup</Heading>
			<Text>Group related buttons with merged borders or spacing</Text>

			<Divider />

			<div class="examples-grid">
				<Heading level={4}>Horizontal (Merged Borders)</Heading>
				<div style="margin-bottom: 2rem;">
					<ButtonGroup orientation="horizontal" spacing={false}>
						<Button variant="secondary">Left</Button>
						<Button variant="secondary">Center</Button>
						<Button variant="secondary">Right</Button>
					</ButtonGroup>
				</div>

				<Heading level={4}>Horizontal (With Spacing)</Heading>
				<div style="margin-bottom: 2rem;">
					<ButtonGroup orientation="horizontal" spacing={true}>
						<Button variant="secondary">
							{#snippet iconBefore()}
								<Icon icon="lucide:align-left" />
							{/snippet}
							Left
						</Button>
						<Button variant="secondary">
							{#snippet iconBefore()}
								<Icon icon="lucide:align-center" />
							{/snippet}
							Center
						</Button>
						<Button variant="secondary">
							{#snippet iconBefore()}
								<Icon icon="lucide:align-right" />
							{/snippet}
							Right
						</Button>
					</ButtonGroup>
				</div>

				<Heading level={4}>Vertical</Heading>
				<div style="margin-bottom: 2rem;">
					<ButtonGroup orientation="vertical">
						<Button variant="ghost">Option 1</Button>
						<Button variant="ghost">Option 2</Button>
						<Button variant="ghost">Option 3</Button>
					</ButtonGroup>
				</div>

				<Heading level={4}>Mixed Variants</Heading>
				<div style="margin-bottom: 2rem;">
					<ButtonGroup orientation="horizontal" spacing={true}>
						<Button variant="primary">
							{#snippet iconBefore()}
								<Icon icon="lucide:save" />
							{/snippet}
							Save
						</Button>
						<Button variant="secondary">Cancel</Button>
						<Button variant="ghost">
							{#snippet iconBefore()}
								<Icon icon="lucide:trash" />
							{/snippet}
							Delete
						</Button>
					</ButtonGroup>
				</div>

				<Heading level={4}>Icon Button Groups</Heading>
				<div style="margin-bottom: 2rem;">
					<ButtonGroup orientation="horizontal" spacing={false}>
						<IconButton variant="secondary" ariaLabel="Bold">
							<Icon icon="lucide:bold" />
						</IconButton>
						<IconButton variant="secondary" ariaLabel="Italic">
							<Icon icon="lucide:italic" />
						</IconButton>
						<IconButton variant="secondary" ariaLabel="Underline">
							<Icon icon="lucide:underline" />
						</IconButton>
					</ButtonGroup>
				</div>
			</div>

			<Divider />

			<Heading level={4}>Props Reference</Heading>
			<Table columns={propsColumns} data={buttonGroupPropsData} compact striped />
		</Card>
	</div>

	<!-- LinkButton Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>LinkButton</Heading>
			<Text>Button styled as navigation link with href support</Text>

			<Divider />

			<div class="examples-grid">
				<Grid cols={2} gap="md">
					<LinkButton href="/docs" variant="primary">View Documentation</LinkButton>
					<LinkButton href="https://github.com" target="_blank" variant="secondary">
						{#snippet iconAfter()}
							<Icon icon="lucide:external-link" />
						{/snippet}
						GitHub Repository
					</LinkButton>
					<LinkButton href="/download" variant="primary">
						{#snippet iconBefore()}
							<Icon icon="lucide:download" />
						{/snippet}
						Download
					</LinkButton>
					<LinkButton href="/about" variant="ghost">
						{#snippet iconBefore()}
							<Icon icon="lucide:info" />
						{/snippet}
						Learn More
					</LinkButton>
					<LinkButton href="/api" variant="secondary">
						{#snippet iconBefore()}
							<Icon icon="lucide:code" />
						{/snippet}
						API Reference
					</LinkButton>
					<LinkButton href="/community" variant="ghost">
						{#snippet iconBefore()}
							<Icon icon="lucide:users" />
						{/snippet}
						{#snippet iconAfter()}
							<Icon icon="lucide:arrow-right" />
						{/snippet}
						Join Community
					</LinkButton>
				</Grid>
			</div>

			<Divider />

			<Heading level={4}>Props Reference</Heading>
			<Table columns={propsColumns} data={linkButtonPropsData} compact striped />
		</Card>
	</div>

	<!-- FloatingActionButton Component Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>FloatingActionButton</Heading>
			<Text>Prominent floating action button with position control</Text>

			<Divider />

			<!-- Interactive Controls -->
			<div class="controls-section">
				<Grid cols={3} gap="md">
					<div>
						<Checkbox bind:checked={fabVisible} label="Show FAB" />
					</div>
					<div>
						<div style="margin-bottom: 0.5rem;">
							<Text variant="caption">Position:</Text>
						</div>
						<div style="display: flex; flex-direction: column; gap: 0.5rem;">
							<Button
								size="sm"
								variant={fabPosition === 'bottom-right' ? 'primary' : 'ghost'}
								onclick={() => (fabPosition = 'bottom-right')}
							>
								Bottom Right
							</Button>
							<Button
								size="sm"
								variant={fabPosition === 'bottom-left' ? 'primary' : 'ghost'}
								onclick={() => (fabPosition = 'bottom-left')}
							>
								Bottom Left
							</Button>
							<Button
								size="sm"
								variant={fabPosition === 'top-right' ? 'primary' : 'ghost'}
								onclick={() => (fabPosition = 'top-right')}
							>
								Top Right
							</Button>
							<Button
								size="sm"
								variant={fabPosition === 'top-left' ? 'primary' : 'ghost'}
								onclick={() => (fabPosition = 'top-left')}
							>
								Top Left
							</Button>
						</div>
					</div>
					<div>
						<div style="margin-bottom: 0.5rem;"><Text variant="caption">Size:</Text></div>
						<div style="display: flex; gap: 0.5rem;">
							<Button
								size="sm"
								variant={fabSize === 'md' ? 'primary' : 'ghost'}
								onclick={() => (fabSize = 'md')}
							>
								MD
							</Button>
							<Button
								size="sm"
								variant={fabSize === 'lg' ? 'primary' : 'ghost'}
								onclick={() => (fabSize = 'lg')}
							>
								LG
							</Button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Preview Container -->
			<div class="fab-preview-container">
				<div style="text-align: center; padding: 2rem;">
					<div style="margin-bottom: 0.5rem;">
						<Text color="muted">
							The FloatingActionButton is fixed to the viewport, not this container.
						</Text>
					</div>
					<Text color="muted">
						Use the controls above to adjust its position, size, and visibility.
					</Text>
					<div style="margin-top: 0.5rem;">
						<Text color="muted">
							{fabVisible
								? '👉 Look for the FAB at the viewport edge!'
								: '(Currently hidden - toggle visibility above)'}
						</Text>
					</div>
				</div>
			</div>

			<Divider />

			<Heading level={4}>Props Reference</Heading>
			<Table columns={propsColumns} data={fabPropsData} compact striped />
		</Card>
	</div>

	<!-- Best Practices Section -->
	<div class="demo-section">
		<Card>
			<Heading level={2}>Best Practices</Heading>

			<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
				<Text>
					<strong>Variant Selection:</strong> Use primary variant for main actions, secondary for alternatives,
					and ghost for tertiary actions or subtle interactions.
				</Text>
				<Text>
					<strong>Accessibility:</strong> Always provide ariaLabel for IconButton and FloatingActionButton
					to ensure screen reader compatibility.
				</Text>
				<Text>
					<strong>Icon Placement:</strong> Use iconBefore for actions (add, upload, save) and iconAfter
					for navigation (arrow-right, external-link).
				</Text>
				<Text>
					<strong>Loading States:</strong> Disable buttons during async operations and show a loading
					spinner to provide visual feedback.
				</Text>
				<Text>
					<strong>Button Groups:</strong> Group related actions with ButtonGroup to create cohesive action
					sets with merged borders or consistent spacing.
				</Text>
				<Text>
					<strong>Navigation vs Actions:</strong> Use LinkButton for navigation, Button for actions that
					don't change routes.
				</Text>
				<Text>
					<strong>Consistent Sizing:</strong> Maintain consistent sizing within button groups and related
					UI sections for visual harmony.
				</Text>
			</div>
		</Card>
	</div>
</Container>

<!-- Controlled FAB (outside Container, positioned by interactive controls) -->
{#if fabVisible}
	<FloatingActionButton
		position={fabPosition}
		size={fabSize}
		ariaLabel="Add item"
		onclick={() => alert('FAB clicked!')}
	>
		<Icon icon="lucide:plus" />
	</FloatingActionButton>
{/if}

<style>
	.demo-section {
		margin-bottom: 3rem;
	}

	.controls-section {
		padding: 1.5rem;
		background: var(--color-base-2);
		border-radius: var(--radius-lg);
		margin-bottom: 2rem;
	}

	.examples-grid {
		margin-top: 2rem;
	}

	.fab-preview-container {
		position: relative;
		height: 16rem;
		background: var(--color-base-2);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-muted);
	}

	.feature-tag {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		background: var(--color-base-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	:global(.animate-spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
