<script lang="ts">
	import {
		Text,
		Card,
		Grid,
		Container,
		Heading,
		CodeBlock,
		Badge,
		Hero,
		List,
		Draggable,
		DragGrid,
		GridItem,
		DragReorderList,
		DropZone,
		createDragContext,
		DRAG_CONTEXT_KEY,
		Tag,
		Panel,
		Alert,
	} from '@mrintel/villain-ui';
	import type { DragEvent, DropEvent } from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount, setContext } from 'svelte';
	import Icon from '@iconify/svelte';

	// Provide DragContext for DropZone + coordinated drag state
	const dragContext = createDragContext();
	setContext(DRAG_CONTEXT_KEY, dragContext);

	// Demo state
	let lastDrop = $state<{ payload: unknown; type: string; velocity: { x: number; y: number } } | null>(null);
	let listItems = $state([
		{ id: 'alpha', label: 'Alpha Protocol' },
		{ id: 'bravo', label: 'Bravo Sequence' },
		{ id: 'charlie', label: 'Charlie Directive' },
		{ id: 'delta', label: 'Delta Override' }
	]);

	let lootItems = $state([
		{ id: 'data-shard', label: 'Data Shard', icon: 'lucide:database', type: 'item', rarity: 'common', payload: { id: 'data-shard' } },
		{ id: 'access-key', label: 'Access Key', icon: 'lucide:key', type: 'item', rarity: 'rare', payload: { id: 'access-key' } },
		{ id: 'cipher-core', label: 'Cipher Core', icon: 'lucide:cpu', type: 'item', rarity: 'legendary', payload: { id: 'cipher-core' } }
	]);

	let weaponItems = $state([
		{ id: 'plasma-rifle', label: 'Plasma Rifle', icon: 'lucide:zap', type: 'weapon', damage: 150, payload: { id: 'plasma-rifle' } },
		{ id: 'shock-blade', label: 'Shock Blade', icon: 'lucide:sword', type: 'weapon', damage: 120, payload: { id: 'shock-blade' } }
	]);

	let inventory = $state<any[]>([]);
	let weaponStash = $state<any[]>([]);

	// Code examples
	const dragContextCode = `import { createDragContext, DRAG_CONTEXT_KEY } from '@mrintel/villain-ui';
import { setContext } from 'svelte';

// Call inside a component
const dragContext = createDragContext();
setContext(DRAG_CONTEXT_KEY, dragContext);`;

	const draggableCode = `import { Draggable } from '@mrintel/villain-ui';

<Draggable mode="free" axis="both" class="w-fit">
  <div class="panel-raised drag-child rounded-[var(--radius-lg)] px-4 py-3">
    Drag me (glows & scales on drag)
  </div>
</Draggable>

<Draggable mode="constrained" bounds="parent" axis="x">
  <div class="panel-raised drag-child rounded-[var(--radius-lg)] px-4 py-3">
    Constrained to parent (X axis)
  </div>
</Draggable>`;

	const dropZoneCode = `import { Draggable, DropZone, createDragContext, DRAG_CONTEXT_KEY } from '@mrintel/villain-ui';
import { setContext } from 'svelte';

const dragContext = createDragContext();
setContext(DRAG_CONTEXT_KEY, dragContext);

// Draggable with type for filtering
<Draggable type="item" payload={{ name: 'Data Shard' }}>
  <Tag>Data Shard</Tag>
</Draggable>

<Draggable type="weapon" payload={{ name: 'Plasma Rifle' }}>
  <Tag>Plasma Rifle</Tag>
</Draggable>

// DropZone variants: 'default', 'glass', 'raised'
<DropZone
  variant="glass"
  padding="lg"
  accept="item"
  onDrop={(e) => console.log(e.payload, e.velocity)}
>
  {#snippet header()}
    <h3>Inventory</h3>
  {/snippet}

  {#snippet children(isOver, canDrop)}
    <div>{isOver ? 'Release to drop' : 'Drop items here'}</div>
  {/snippet}

  {#snippet footer()}
    <p class="text-sm text-muted">Items: {inventory.length}</p>
  {/snippet}
</DropZone>

// Type filtering - only accepts 'weapon' type
<DropZone accept="weapon" variant="raised">
  {#snippet empty()}
    <p>Weapon stash is empty</p>
  {/snippet}
</DropZone>`;

	const dragGridCode = `import { DragGrid, GridItem } from '@mrintel/villain-ui';

<DragGrid cellSize={24} showGrid snap snapResolution={1} class="h-[320px]">
  <GridItem x={1} y={1} w={6} h={3}>
    <div class="w-full h-full flex items-center justify-center">Item A</div>
  </GridItem>
  <GridItem x={8} y={2} w={5} h={4}>
    <div class="w-full h-full flex items-center justify-center">Item B</div>
  </GridItem>
</DragGrid>`;

	const reorderListCode = `import { DragReorderList } from '@mrintel/villain-ui';

let items = $state([
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Bravo' },
  { id: 'c', label: 'Charlie' }
]);

<DragReorderList bind:items={items} getKey={(item) => item.id}>
  {#snippet children(item, index)}
    <div class="panel-raised rounded-[var(--radius-md)] px-4 py-3">
      #{index + 1} — {item.label}
    </div>
  {/snippet}
</DragReorderList>`;

	// Highlighted code
	let dragContextHtml = $state('');
	let draggableHtml = $state('');
	let dropZoneHtml = $state('');
	let dragGridHtml = $state('');
	let reorderListHtml = $state('');

	onMount(async () => {
		dragContextHtml = await codeToHtml(dragContextCode, { lang: 'ts', theme: 'github-dark' });
		draggableHtml = await codeToHtml(draggableCode, { lang: 'svelte', theme: 'github-dark' });
		dropZoneHtml = await codeToHtml(dropZoneCode, { lang: 'svelte', theme: 'github-dark' });
		dragGridHtml = await codeToHtml(dragGridCode, { lang: 'svelte', theme: 'github-dark' });
		reorderListHtml = await codeToHtml(reorderListCode, { lang: 'svelte', theme: 'github-dark' });
	});

	const handleLootDrop = (e : DropEvent) => {
		console.log('Dropped item:', e);
		lastDrop = e;
		const item = lootItems.find((i) => i.id === e.payload.id);
		inventory = [...inventory, item];
		// Remove the dropped item from lootItems
		lootItems = lootItems.filter((item) => item.id !== e.payload.id);
	};

	const handleWeaponDrop = (e : DropEvent) => {
		console.log('Dropped weapon:', e);
		lastDrop = e;
		const weapon = weaponItems.find((w) => w.id === e.payload.id);
		weaponStash = [...weaponStash, weapon];
		// Remove the dropped weapon from weaponItems
		weaponItems = weaponItems.filter((item) => item.id !== e.payload.id);
	};

	const handleAnyDrop = (e : DropEvent) => {
		console.log('Dropped into trash:', e);
		lastDrop = e;
		// Remove from both lists
		lootItems = lootItems.filter((item) => item.payload !== e.payload);
		weaponItems = weaponItems.filter((item) => item.payload !== e.payload);
	};

	const handleDrag = (e: DragEvent) => {
		let type = dragContext.type;
	};
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Interactions</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Drag-and-drop primitives for building tactile, responsive interfaces.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:move" class="tag-icon" />
				Draggable
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:box" class="tag-icon" />
				Drop Zones
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:layout-grid" class="tag-icon" />
				Drag Grid
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:list-ordered" class="tag-icon" />
				Reorder List
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Drag Context</Heading>
				<Text variant="body" color="soft">
					Provide context once to enable drop zones and shared drag state.
				</Text>
			{/snippet}

			<CodeBlock
				filename="DragContext"
				showLineNumbers
				lineCount={dragContextCode.split('\n').length}
				showCopy
				code={dragContextCode}
			>
				{@html dragContextHtml}
			</CodeBlock>
		</Card>

		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Draggable</Heading>
				<Text variant="body" color="soft">Freeform drag and constrained drag</Text>
			{/snippet}

			<Grid cols={1} gap="lg">
				<Card padding="lg">
					{#snippet header()}
						<Heading level={3}>Free Drag</Heading>
						<Text variant="body" color="soft">Drag an item freely in any direction.</Text>
					{/snippet}
					<Grid cols={2} gap="sm">
						<Draggable mode="free" axis="both">
							<Card class="drag-child">Drag me</Card>
						</Draggable>
						<Draggable mode="constrained" axis="x">
							<Card class="drag-child">Drag me (X axis)</Card>
						</Draggable>
						<Draggable mode="constrained" axis="y" handle="corners">
							<Card class="drag-child">Drag me (Y axis)</Card>
						</Draggable>
					</Grid>
				</Card>

				<CodeBlock
					filename="Draggable.svelte"
					showLineNumbers
					lineCount={draggableCode.split('\n').length}
					showCopy
					code={draggableCode}
				>
					{@html draggableHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>DropZone</Heading>
				<Text variant="body" color="soft"
					>Drop targets with type filtering, variants, and slots</Text
				>
			{/snippet}

			<Grid cols={1} gap="lg">
				<!-- Demo Section -->
				<Card padding="lg">
					{#snippet header()}
						<Heading level={3}>Interactive Demo</Heading>
						<Text variant="body" color="soft"
							>Drag items from the palette to different drop zones</Text
						>
					{/snippet}

					<Grid cols={1} gap="md">
						<!-- Draggable Items Palette -->
						<Panel variant="glass" padding="md">
							<div class="space-y-3">
								<Heading level={4}>Item Palette</Heading>

								{#if lootItems.length > 0}
									<div>
										<Text variant="caption" color="soft">Items (drag to Inventory)</Text>
										<div class="flex flex-wrap gap-2 mt-2">
											{#each lootItems as item (item.id)}
												<Draggable type={item.type} payload={item.payload} onDrag={handleDrag}>
													<Tag variant="info" size="md">
														{#snippet icon()}
															<Icon icon={item.icon} class="tag-icon" />
														{/snippet}
														{item.label}
													</Tag>
												</Draggable>
											{/each}
										</div>
									</div>
								{/if}

								{#if weaponItems.length > 0}
									<div>
										<Text variant="caption" color="soft">Weapons (drag to Weapon Stash)</Text>
										<div class="flex flex-wrap gap-2 mt-2">
											{#each weaponItems as weapon (weapon.id)}
												<Draggable type={weapon.type} payload={weapon.payload} onDrag={handleDrag}>
													<Tag variant="accent" size="md">
														{#snippet icon()}
															<Icon icon={weapon.icon} class="tag-icon" />
														{/snippet}
														{weapon.label}
													</Tag>
												</Draggable>
											{/each}
										</div>
									</div>
								{/if}

								{#if lootItems.length === 0 && weaponItems.length === 0}
									<Text variant="body" color="muted">All items have been collected!</Text>
								{/if}
							</div>
						</Panel>

						<!-- Drop Zones Grid -->
						<Grid cols={3} gap="md">
							<!-- Type-Filtered Drop Zone: Items Only -->
							<DropZone
								variant="glass"
								padding="lg"
								accept="item"
								minHeight="250px"
								onDrop={handleLootDrop}
							>
								{#snippet header()}
									<div class="flex items-center gap-2">
										<Icon icon="lucide:package" class="text-accent" />
										<Heading level={4}>Inventory</Heading>
									</div>
								{/snippet}

								{#snippet children(isOver, canDrop)}
									{#if inventory.length > 0}
										<List variant="plain">
											{#each inventory as item (item.id)}
												<li
													class="flex items-center gap-2 text-sm text-text-sof rounded px-2 py-1"
												>
													{item.label}
													{item.rarity ? `(${item.rarity})` : ''}
												</li>
											{/each}
										</List>
									{:else if !isOver}
										<Text variant="caption" color="soft">Drop items here</Text>
									{:else if isOver && !canDrop}
										<Text variant="caption" color="error">This drop zone only accepts items</Text>
									{:else}
										<Text variant="caption" color="muted">Inventory is empty</Text>
									{/if}
								{/snippet}

								{#snippet footer()}
									<List variant="plain">
										<li class="flex items-center gap-2">
											<Text variant="caption" color="muted">
												Accepts: <span class="text-accent">item</span> type only
											</Text>
										</li>
										<li class="flex items-center gap-2">
											<Text variant="caption" color="muted">
												{inventory.length} item(s)
											</Text>
										</li>
									</List>
								{/snippet}
							</DropZone>

							<!-- Type-Filtered Drop Zone: Weapons Only -->
							<DropZone
								variant="raised"
								padding="lg"
								accept="weapon"
								minHeight="250px"
								onDrop={handleWeaponDrop}
							>
								{#snippet header()}
									<div class="flex items-center gap-2">
										<Icon icon="lucide:sword" class="text-crimson" />
										<Heading level={4}>Weapon Stash</Heading>
									</div>
								{/snippet}

								{#snippet children(isOver, canDrop)}
									<div class="space-y-2">
										{#if weaponStash.length > 0}
											<List variant="plain">
												{#each weaponStash as weapon (weapon.id)}
													<li
														class="flex items-center gap-2 text-sm text-text-soft px-2 py-1"
													>
														{weapon.label} ({weapon.damage} DMG)
													</li>
												{/each}
											</List>
										{:else if !isOver}
											<Text variant="caption" color="soft">Drop weapons here</Text>
										{:else if isOver && !canDrop}
											<Text variant="caption" color="error"
												>This drop zone only accepts weapons</Text>
										{:else}
											<Text variant="caption" color="muted">Weapon stash is empty</Text>
										{/if}
									</div>
								{/snippet}

								{#snippet footer()}
									<List variant="plain">
										<li class="flex items-center gap-2">
											<Text variant="caption" color="muted">
												Accepts: <span class="text-crimson">weapon</span> type only
											</Text>
										</li>
										<li class="flex items-center gap-2">
											<Text variant="caption" color="muted">
												{weaponStash.length} weapon(s)
											</Text>
										</li>
									</List>
								{/snippet}
							</DropZone>

							<!-- Accept All Drop Zone -->
							<DropZone variant="default" padding="lg" minHeight="250px" onDrop={handleAnyDrop}>
								{#snippet header()}
									<div class="flex items-center gap-2">
										<Icon icon="lucide:trash-2" class="text-error" />
										<Heading level={4}>Trash</Heading>
									</div>
								{/snippet}

								{#snippet empty()}
									<div class="space-y-2 opacity-50">
										<Icon
											icon="lucide:trash-2"
											width="32"
											height="32"
											class="text-text-muted mx-auto"
										/>
										<Text variant="caption" color="muted">Drop anything here to delete</Text>
									</div>
								{/snippet}

								{#snippet footer()}
									<Text variant="caption" color="muted">
										Accepts: <span class="text-text-soft">all types</span>
									</Text>
								{/snippet}
							</DropZone>
						</Grid>

						<!-- Last Drop Info -->
						{#if lastDrop}
							<Alert variant="info" title="Last Drop Event">
								<div class="space-y-1">
									<Text variant="body" as="p">
										<strong>Type:</strong>
										{lastDrop.type}
									</Text>
									<Text variant="body" as="p">
										<strong>Payload:</strong>
										<code class="text-xs">{JSON.stringify(lastDrop.payload)}</code>
									</Text>
									<Text variant="body" as="p">
										<strong>Velocity:</strong> X: {lastDrop.velocity.x.toFixed(2)}px/ms, Y: {lastDrop.velocity.y.toFixed(
											2
										)}px/ms
									</Text>
								</div>
							</Alert>
						{/if}
					</Grid>
				</Card>

				<!-- Variant Examples -->
				<Card padding="lg">
					{#snippet header()}
						<Heading level={3}>Variants & States</Heading>
						<Text variant="body" color="soft">Different visual styles and configurations</Text>
					{/snippet}

					<Grid cols={3} gap="md">
						<DropZone variant="default" padding="md" minHeight="150px">
							{#snippet children(isOver, canDrop)}
								<Text variant="body">Default Variant</Text>
							{/snippet}
						</DropZone>

						<DropZone variant="glass" padding="md" minHeight="150px">
							{#snippet children(isOver, canDrop)}
								<Text variant="body">Glass Variant</Text>
							{/snippet}
						</DropZone>

						<DropZone variant="raised" padding="md" minHeight="150px">
							{#snippet children(isOver, canDrop)}
								<Text variant="body">Raised Variant</Text>
							{/snippet}
						</DropZone>
					</Grid>
				</Card>

				<CodeBlock
					filename="DropZone.svelte"
					showLineNumbers
					lineCount={dropZoneCode.split('\n').length}
					showCopy
					code={dropZoneCode}
				>
					{@html dropZoneHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>DragGrid</Heading>
				<Text variant="body" color="soft">Grid items snap and prevent collisions</Text>
			{/snippet}

			<DragGrid cellSize={24} showGrid snap snapResolution={1} class="h-[320px]">
				<GridItem x={1} y={1} w={6} h={3}><Text variant="body">Item B</Text></GridItem>

				<GridItem x={8} y={2} w={5} h={4}>
					<div class="w-full h-full flex items-center justify-center">
						<Text variant="body">Item B</Text>
					</div>
				</GridItem>

				<GridItem x={3} y={6} w={7} h={3}>
					<div class="w-full h-full flex items-center justify-center">
						<Text variant="body">Item C</Text>
					</div>
				</GridItem>
			</DragGrid>

			<CodeBlock
				filename="DragGrid.svelte"
				showLineNumbers
				lineCount={dragGridCode.split('\n').length}
				showCopy
				code={dragGridCode}
			>
				{@html dragGridHtml}
			</CodeBlock>
		</Card>

		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>DragReorderList</Heading>
				<Text variant="body" color="soft">Reorder items via drag</Text>
			{/snippet}

			<div class="grid gap-4">
				<DragReorderList
					bind:items={listItems}
					getKey={(item) => (item as { id: string }).id}
					onReorder={() => {
						// listItems is already updated via bind:items
					}}
				>
					{#snippet children(item, index)}
						<div
							class="panel-raised rounded-[var(--radius-md)] px-4 py-3 flex items-center justify-between"
						>
							<Text variant="body">#{index + 1} — {(item as { label: string }).label}</Text>
							<Text variant="caption" color="soft">drag</Text>
						</div>
					{/snippet}
				</DragReorderList>

				<Text variant="caption" color="soft">
					Current order: {listItems.map((x) => x.id).join(' → ')}
				</Text>
			</div>

			<CodeBlock
				filename="DragReorderList.svelte"
				showLineNumbers
				lineCount={reorderListCode.split('\n').length}
				showCopy
				code={reorderListCode}
			>
				{@html reorderListHtml}
			</CodeBlock>
		</Card>
	</Grid>
</Container>
