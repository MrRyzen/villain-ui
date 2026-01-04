<script lang="ts">
	import {
		Text,
		Card,
		Grid,
		Container,
		Heading,
		Divider,
		CodeBlock,
		Table,
		Badge,
		Tag,
		List,
		Avatar,
		Stat,
		Pagination,
		Button,
		Input,
		Hero,
		Code

	} from '@mrintel/villain-ui';
	import type { TableColumn, SortDirection } from '@mrintel/villain-ui';
	import { codeToHtml } from 'shiki';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	// Code examples
	const tableCode = `import { Table } from '@mrintel/villain-ui';
import type { SortDirection } from '@mrintel/villain-ui';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', align: 'center' }
];

const data = [
  { name: 'Alice Johnson', role: 'Developer', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', status: 'Active' },
  { name: 'Carol White', role: 'Manager', status: 'Away' }
];

let searchQuery = $state('');

function handleSort(key: string, direction: SortDirection) {
  console.log('Sort:', key, direction);
  // Implement your sorting logic here
}

function handleRowClick(row: any) {
  console.log('Row clicked:', row);
}

function filterData(row: any): boolean {
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  return Object.values(row).some(val =>
    String(val).toLowerCase().includes(query)
  );
}

<Table
  {columns}
  {data}
  striped
  hoverable
  onSort={handleSort}
  onRowClick={handleRowClick}
  filterFn={filterData}
/>`;

	const badgeCode = `import { Badge } from '@mrintel/villain-ui';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="accent" glow>Premium</Badge>

<!-- Status indicators with glowing dot -->
<Badge variant="success" statusDot uppercase>Active</Badge>
<Badge variant="warning" statusDot uppercase>Pending</Badge>
<Badge variant="error" statusDot uppercase>Inactive</Badge>`;

	const tagCode = `import { Tag } from '@mrintel/villain-ui';

<Tag variant="default">Design</Tag>
<Tag variant="accent">Featured</Tag>
<Tag dismissible ondismiss={() => console.log('Tag dismissed')}>
  Removable
</Tag>`;

	const listCode = `import { List } from '@mrintel/villain-ui';

const items = [
  { id: '1', content: 'First item' },
  { id: '2', content: 'Second item' },
  { id: '3', content: 'Third item' }
];

<List {items} variant="bordered" hoverable />`;

	const avatarCode = `import { Avatar } from '@mrintel/villain-ui';

<Avatar src="/path/to/image.jpg" alt="User" size="md" />
<Avatar alt="John Doe" fallback="JD" size="lg" />
<Avatar alt="Admin" size="xl" glow />`;

	const statCode = `import { Stat } from '@mrintel/villain-ui';

<Stat
  label="Total Users"
  value="12,345"
  change={12.5}
  trend="up"
  description="vs last month"
/>`;

	const paginationCode = `import { Pagination } from '@mrintel/villain-ui';

let currentPage = $state(1);

<Pagination
  bind:currentPage
  totalPages={10}
  onpagechange={(page) => console.log('Page:', page)}
/>`;

	const codeBlockCode = `import { CodeBlock } from '@mrintel/villain-ui';

const code = \`function hello() {
  console.log("Hello, world!");
}\`;

<CodeBlock
  filename="example.js"
  showLineNumbers
  lineCount={3}
  showCopy
  {code}
>
  {@html highlightedCode}
</CodeBlock>`;

	const customTableCode = `import { Table } from '@mrintel/villain-ui';
import type { TableColumn } from '@mrintel/villain-ui';

// Custom columns with render functions
const columns: TableColumn[] = [
  {
    key: 'name',
    label: 'User',
    render: (value, row) => \`
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <img src="\${row.avatarUrl}" alt="\${value}"
          style="width: 2rem; height: 2rem; border-radius: 9999px;" />
        <div>
          <div style="font-weight: 600;">\${value}</div>
          <div style="font-size: 0.75rem; opacity: 0.7;">\${row.email}</div>
        </div>
      </div>
    \`
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
    render: (value) => {
      const colors = {
        active: { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' },
        pending: { bg: 'rgba(234, 179, 8, 0.1)', text: 'rgb(234, 179, 8)' },
        inactive: { bg: 'rgba(239, 68, 68, 0.1)', text: 'rgb(239, 68, 68)' }
      };
      const color = colors[value];
      return \`
        <span style="
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background: \${color.bg};
          color: \${color.text};
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        ">\${value}</span>
      \`;
    }
  },
  {
    key: 'actions',
    label: '', // Empty header for action column
    align: 'right',
    render: (value, row) => \`
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button onclick="handleEdit('\${row.id}')">Edit</button>
        <button onclick="handleDelete('\${row.id}')">Delete</button>
      </div>
    \`
  }
];

<Table {columns} data={users} hoverable striped />`;

	const hybridTableCode = `import { Table, Badge, Button } from '@mrintel/villain-ui';
import Icon from '@iconify/svelte';

// Hybrid mode: Define columns + data, override specific columns with snippets!
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', align: 'center' },
    { key: 'actions', label: '', align: 'right' }
  ]}
  data={users}
  hoverable
  striped
>
  {#snippet cell_status({ value, row })}
    {#if value === 'active'}
      <Badge variant="success" statusDot uppercase>Active</Badge>
    {:else if value === 'pending'}
      <Badge variant="warning" statusDot uppercase>Pending</Badge>
    {:else}
      <Badge variant="error" statusDot uppercase>Inactive</Badge>
    {/if}
  {/snippet}

  {#snippet cell_actions({ value, row })}
    <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
      <Button variant="ghost" size="sm" onclick={() => handleEdit(row.id)}>
        <Icon icon="lucide:pencil" width="14" />
      </Button>
      <Button variant="ghost" size="sm" onclick={() => handleDelete(row.id)}>
        <Icon icon="lucide:trash-2" width="14" />
      </Button>
    </div>
  {/snippet}
</Table>

<!-- Note: name, email, and role use default rendering automatically! -->`;

	// State for highlighted code
	let tableHtml = $state('');
	let badgeHtml = $state('');
	let tagHtml = $state('');
	let listHtml = $state('');
	let avatarHtml = $state('');
	let statHtml = $state('');
	let paginationHtml = $state('');
	let codeBlockHtml = $state('');
	let exampleCodeHtml = $state('');
	let customTableHtml = $state('');
	let hybridTableHtml = $state('');

	// Demo data
	interface UserData {
		name: string;
		role: string;
		status: string;
		email: string;
	}

	const tableColumns: TableColumn[] = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'role', label: 'Role', sortable: true },
		{ key: 'status', label: 'Status' },
		{ key: 'email', label: 'Email' }
	];

	const tableData: UserData[] = [
		{ name: 'Alice Johnson', role: 'Developer', status: 'Active', email: 'alice@example.com' },
		{ name: 'Bob Smith', role: 'Designer', status: 'Active', email: 'bob@example.com' },
		{ name: 'Carol White', role: 'Manager', status: 'Away', email: 'carol@example.com' },
		{ name: 'David Brown', role: 'Developer', status: 'Active', email: 'david@example.com' },
		{ name: 'Eve Davis', role: 'QA Engineer', status: 'Offline', email: 'eve@example.com' }
	];

	let currentPage = $state(1);
	let tags = $state(['JavaScript', 'TypeScript', 'Svelte', 'React']);
	let tableLoading = $state(false);
	let sortedData = $state([...tableData]);
	let sortedCustomData = $state<CustomUserData[]>([]);
	let lastClickedRow = $state<string | null>(null);
	let searchQuery = $state('');
	let actionMessage = $state<string | null>(null);

	// Custom table data with more fields
	interface CustomUserData {
		id: string;
		name: string;
		email: string;
		role: string;
		status: 'active' | 'pending' | 'inactive';
		avatarUrl?: string;
	}

	const customTableData: CustomUserData[] = [
		{ id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
		{ id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Designer', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?img=2' },
		{ id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Manager', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?img=3' },
		{ id: '4', name: 'David Brown', email: 'david@example.com', role: 'Developer', status: 'inactive', avatarUrl: 'https://i.pravatar.cc/150?img=4' },
		{ id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'QA Engineer', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
	];

	// Initialize sortedCustomData
	sortedCustomData = [...customTableData];

	// Custom columns with render functions
	const customColumns: TableColumn[] = [
		{
			key: 'user',
			label: 'User',
		},
		{
			key: 'role',
			label: 'Role',
			sortable: true
		},
		{
			key: 'status',
			label: 'Status',
			sortable: true,
		},
		{
			key: 'actions',
			label: '', // Empty header for action column
		}
	];

	// Special sort function for custom table
	function specialSortStatus(columnKey: string, direction: SortDirection) {
		if (!direction) {
			sortedCustomData = [...customTableData];
			return;
		}

		sortedCustomData = [...customTableData].sort((a, b) => {
			if (columnKey === 'status') {
				// Sort by predefined order: active > pending > inactive
				const statusOrder = { active: 1, pending: 2, inactive: 3 };
				if (direction === 'asc') {
					return statusOrder[a.status] - statusOrder[b.status];
				} else {
					return statusOrder[b.status] - statusOrder[a.status];
				}
			} else if (columnKey === 'role') {
				// Alphabetical sort for role
				const aVal = a[columnKey as keyof CustomUserData];
				const bVal = b[columnKey as keyof CustomUserData];
				if (aVal && bVal) {
					if (direction === 'asc') {
						return aVal > bVal ? 1 : -1;
					} else {
						return aVal < bVal ? 1 : -1;
					}
				}
			}
			return 0;
		});
	}

	function removeTag(index: number) {
		tags = tags.filter((_, i) => i !== index);
	}

	function handleTableSort(columnKey: string, direction: SortDirection) {
		if (!direction) {
			sortedData = [...tableData];
			return;
		}

		sortedData = [...sortedData].sort((a, b) => {
			const aVal = a[columnKey as keyof UserData];
			const bVal = b[columnKey as keyof UserData];

			if (direction === 'asc') {
				return aVal > bVal ? 1 : -1;
			} else {
				return aVal < bVal ? 1 : -1;
			}
		});
	}

	function handleRowClick(row: UserData) {
		lastClickedRow = row.name;
		setTimeout(() => lastClickedRow = null, 2000);
	}

	function toggleLoading() {
		tableLoading = !tableLoading;
	}

	function filterData(row: UserData): boolean {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			row.name.toLowerCase().includes(query) ||
			row.role.toLowerCase().includes(query) ||
			row.status.toLowerCase().includes(query) ||
			row.email.toLowerCase().includes(query)
		);
	}

	// Action handlers for custom table
	function handleEdit(id: string, name: string) {
		actionMessage = `Edit action triggered for: ${name} (ID: ${id})`;
		setTimeout(() => actionMessage = null, 3000);
	}

	function handleDelete(id: string, name: string) {
		actionMessage = `Delete action triggered for: ${name} (ID: ${id})`;
		setTimeout(() => actionMessage = null, 3000);
	}

	onMount(async () => {
		// Set up global handlers for table actions
		(window as any).handleEdit = handleEdit;
		(window as any).handleDelete = handleDelete;

		tableHtml = await codeToHtml(tableCode, { lang: 'svelte', theme: 'github-dark' });
		badgeHtml = await codeToHtml(badgeCode, { lang: 'svelte', theme: 'github-dark' });
		tagHtml = await codeToHtml(tagCode, { lang: 'svelte', theme: 'github-dark' });
		listHtml = await codeToHtml(listCode, { lang: 'svelte', theme: 'github-dark' });
		avatarHtml = await codeToHtml(avatarCode, { lang: 'svelte', theme: 'github-dark' });
		statHtml = await codeToHtml(statCode, { lang: 'svelte', theme: 'github-dark' });
		paginationHtml = await codeToHtml(paginationCode, { lang: 'svelte', theme: 'github-dark' });
		codeBlockHtml = await codeToHtml(codeBlockCode, { lang: 'svelte', theme: 'github-dark' });
		customTableHtml = await codeToHtml(customTableCode, { lang: 'svelte', theme: 'github-dark' });
		hybridTableHtml = await codeToHtml(hybridTableCode, { lang: 'svelte', theme: 'github-dark' });

		exampleCodeHtml = await codeToHtml(
			`function greet(name: string): void {\n  console.log(\`Hello, \${name}!\`);\n}`,
			{ lang: 'typescript', theme: 'github-dark' }
		);
	});
</script>

<Container centered padding>
	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Data Display Components</Heading>
		{/snippet}
		{#snippet text()}
			<Text variant="body" as="p" color="soft">
				Discover Villain UI's data display components, designed to present information clearly and
				effectively.
			</Text>
		{/snippet}
		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:table" class="tag-icon" />
				Tables
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:tag" class="tag-icon" />
				Tags & Badges
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:list" class="tag-icon" />
				Lists
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:user-circle" class="tag-icon" />
				Avatars
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:bar-chart-2" class="tag-icon" />
				Stats
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:chevrons-right-left" class="tag-icon" />
				Pagination
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- Table -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Table</Heading>
				<Text variant="body" color="soft">
					Flexible table component with sorting, filtering, and various styles
				</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Interactive Table with Sorting & Row Click</Text>
					</div>
					{#if lastClickedRow}
						<div class="mb-2 p-3 rounded-lg bg-accent-overlay-10 border border-accent">
							<Text variant="caption">Clicked: {lastClickedRow}</Text>
						</div>
					{/if}
					<Table
						columns={tableColumns}
						data={sortedData}
						striped
						hoverable
						onSort={handleTableSort}
						onRowClick={handleRowClick}
					/>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Search/Filter with Custom Function</Text>
					</div>
					<div class="mb-4">
						<Input
							type="text"
							bind:value={searchQuery}
							placeholder="Search by name, role, status, or email..."
						>
							{#snippet iconAfter()}
								<Icon icon="lucide:search" width="16" height="16" class="input-icon" />
							{/snippet}
						</Input>
					</div>
					<Table
						columns={tableColumns}
						data={tableData}
						hoverable
						filterFn={filterData}
						emptyMessage="No matching results found"
					/>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Loading & Empty States</Text>
					</div>
					<div class="flex gap-2 mb-4">
						<Button variant="secondary" size="sm" onclick={toggleLoading}>Toggle Loading</Button>
					</div>
					<Table
						columns={tableColumns}
						data={tableLoading ? [] : tableData.slice(0, 3)}
						hoverable
						loading={tableLoading}
						loadingMessage="Fetching data..."
						emptyMessage="No users found"
					/>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft"
							>Hybrid Mode: Default + Custom Columns with Package Components</Text
						>
					</div>
					{#if actionMessage}
						<div class="mb-3 p-3 rounded-lg bg-accent-overlay-10 border border-accent">
							<Text variant="caption">{actionMessage}</Text>
						</div>
					{/if}
					<Table
						columns={customColumns}
						data={sortedCustomData}
						hoverable
						striped
						compact
						onSort={specialSortStatus}
					>
						{#snippet cell_user({ value, row })}
							<div style="display: flex; align-items: center; gap: 0.75rem;">
								<Avatar src={row.avatarUrl} alt={row.name} size="md" />
								<Grid cols={1} gap="none">
									<Text variant="body" color="default" weight="semibold" as="div">{row.name}</Text>
									<Text variant="caption" color="muted" as="div">{row.email}</Text>
								</Grid>
							</div>
						{/snippet}
						{#snippet cell_status({ value, row })}
							{#if value === 'active'}
								<Badge variant="success" statusDot uppercase>Active</Badge>
							{:else if value === 'pending'}
								<Badge variant="warning" statusDot uppercase>Pending</Badge>
							{:else}
								<Badge variant="error" statusDot uppercase>Inactive</Badge>
							{/if}
						{/snippet}

						{#snippet cell_actions({ value, row })}
							<div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
								<Button variant="ghost" size="sm" onclick={() => handleEdit(row.id, row.name)}>
									<Icon icon="lucide:pencil" width="14" height="14" />
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => handleDelete(row.id, row.name)}
									class="text-red-500 hover:text-red-400"
								>
									<Icon icon="lucide:trash-2" width="14" height="14" />
								</Button>
							</div>
						{/snippet}
					</Table>
				</div>

				<CodeBlock
					filename="TableCustomColumns.svelte"
					showLineNumbers
					lineCount={customTableCode.split('\n').length}
					showCopy
					code={customTableCode}
				>
					{@html customTableHtml}
				</CodeBlock>

				<CodeBlock
					filename="TableHybridMode.svelte"
					showLineNumbers
					lineCount={hybridTableCode.split('\n').length}
					showCopy
					code={hybridTableCode}
				>
					{@html hybridTableHtml}
				</CodeBlock>

				<CodeBlock
					filename="Table.svelte"
					showLineNumbers
					lineCount={tableCode.split('\n').length}
					showCopy
					code={tableCode}
				>
					{@html tableHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Badges -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Badge</Heading>
				<Text variant="body" color="soft">Status indicators and labels with multiple variants</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Variants</Text>
					</div>
					<div class="demo-group">
						<Badge variant="default">Default</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="error">Error</Badge>
						<Badge variant="accent">Accent</Badge>
						<Badge variant="feature">Feature</Badge>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Sizes</Text>
					</div>
					<div class="demo-group items-center">
						<Badge variant="accent" size="sm">Small</Badge>
						<Badge variant="accent" size="md">Medium</Badge>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">With Icons</Text>
					</div>
					<div class="demo-group">
						<Badge variant="success" hover>
							{#snippet icon()}
								<Icon icon="lucide:check" width="14" height="14" />
							{/snippet}
							Active
						</Badge>
						<Badge variant="warning" hover>
							{#snippet icon()}
								<Icon icon="lucide:alert-triangle" width="14" height="14" />
							{/snippet}
							Pending
						</Badge>
						<Badge variant="feature" glow hover>
							{#snippet icon()}
								<Icon icon="lucide:sparkles" width="14" height="14" />
							{/snippet}
							Premium
						</Badge>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Status Indicators with Glowing Dot</Text>
					</div>
					<div class="demo-group">
						<Badge variant="success" statusDot uppercase>Active</Badge>
						<Badge variant="warning" statusDot uppercase>Pending</Badge>
						<Badge variant="error" statusDot uppercase>Inactive</Badge>
						<Badge variant="accent" statusDot uppercase>Processing</Badge>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Uppercase Styling</Text>
					</div>
					<div class="demo-group">
						<Badge variant="default" uppercase>New</Badge>
						<Badge variant="success" uppercase>Verified</Badge>
						<Badge variant="feature" uppercase hover>Featured</Badge>
					</div>
				</div>

				<CodeBlock
					filename="Badge.svelte"
					showLineNumbers
					lineCount={badgeCode.split('\n').length}
					showCopy
					code={badgeCode}
				>
					{@html badgeHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Tags -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Tag</Heading>
				<Text variant="body" color="soft">Removable labels for categorization</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Variants</Text>
					</div>
					<div class="demo-group">
						<Tag variant="default">Default Tag</Tag>
						<Tag variant="accent">Accent Tag</Tag>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">With Icons</Text>
					</div>
					<div class="demo-group">
						<Tag variant="default">
							{#snippet icon()}
								<Icon icon="lucide:tag" width="14" height="14" />
							{/snippet}
							Design
						</Tag>
						<Tag variant="accent">
							{#snippet icon()}
								<Icon icon="lucide:star" width="14" height="14" />
							{/snippet}
							Featured
						</Tag>
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Dismissible Tags</Text>
					</div>
					<div class="demo-group">
						{#each tags as tag, index}
							<Tag dismissible ondismiss={() => removeTag(index)}>
								{tag}
							</Tag>
						{/each}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => (tags = ['JavaScript', 'TypeScript', 'Svelte', 'React'])}
					>
						Reset Tags
					</Button>
				</div>
				<CodeBlock
					filename="Tag.svelte"
					showLineNumbers
					lineCount={tagCode.split('\n').length}
					showCopy
					code={tagCode}
				>
					{@html tagHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- List -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>List</Heading>
				<Text variant="body" color="soft">Organized lists with multiple style variants</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Plain List</Text>
					</div>
					<List variant="plain">
						<li>First item in plain list</li>
						<li>Second item in plain list</li>
						<li>Third item in plain list</li>
					</List>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Bordered List</Text>
					</div>
					<List variant="bordered" hoverable>
						<li class="flex items-center gap-2">
							<Icon icon="lucide:check-circle" width="20" height="20" />
							Bordered list item with icon
						</li>
						<li class="flex items-center gap-2">
							<Icon icon="lucide:star" width="20" height="20" />
							Hoverable for interaction
						</li>
						<li class="flex items-center gap-2">
							<Icon icon="lucide:zap" width="20" height="20" />
							Clean and organized
						</li>
					</List>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Divided List</Text>
					</div>
					<List variant="divided">
						<li>Item separated by dividers</li>
						<li>Great for settings or menus</li>
						<li>Last item has no divider</li>
					</List>
				</div>
				<CodeBlock filename="List.svelte" showLineNumbers lineCount={7} showCopy code={listCode}>
					{@html listHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Avatar -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Avatar</Heading>
				<Text variant="body" color="soft">User profile images with fallback support</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Sizes</Text>
					</div>
					<div class="demo-group items-center">
						<Avatar alt="Small User" size="sm" />
						<Avatar alt="Medium User" size="md" />
						<Avatar alt="Large User" size="lg" />
						<Avatar alt="Extra Large" size="xl" />
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Custom Fallback</Text>
					</div>
					<div class="demo-group items-center">
						<Avatar alt="Alice Johnson" fallback="AJ" size="md" />
						<Avatar alt="Bob Smith" fallback="BS" size="md" />
						<Avatar alt="Carol White" fallback="CW" size="md" />
						<Avatar alt="David Brown" fallback="DB" size="md" />
					</div>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">With Glow Effect</Text>
					</div>
					<div class="demo-group items-center">
						<Avatar alt="Premium User" fallback="P" size="lg" glow />
						<Avatar alt="Admin User" fallback="A" size="lg" glow />
					</div>
				</div>

				<CodeBlock
					filename="Avatar.svelte"
					showLineNumbers
					lineCount={3}
					showCopy
					code={avatarCode}
				>
					{@html avatarHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Stats -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Stat</Heading>
				<Text variant="body" color="soft">Display key metrics and statistics</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<Grid cols={3} gap="md" responsive>
					<Stat
						label="Total Users"
						value="12,345"
						change={12.5}
						trend="up"
						description="vs last month"
					>
						{#snippet icon()}
							<Icon icon="lucide:users" width="40" height="40" />
						{/snippet}
					</Stat>

					<Stat
						label="Revenue"
						value="$54,321"
						change={-5.2}
						trend="down"
						description="vs last month"
					>
						{#snippet icon()}
							<Icon icon="lucide:dollar-sign" width="40" height="40" />
						{/snippet}
					</Stat>

					<Stat label="Active Now" value="1,234" description="online users">
						{#snippet icon()}
							<Icon icon="lucide:activity" width="40" height="40" />
						{/snippet}
					</Stat>
				</Grid>

				<CodeBlock filename="Stat.svelte" showLineNumbers lineCount={8} showCopy code={statCode}>
					{@html statHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Pagination -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Pagination</Heading>
				<Text variant="body" color="soft">Navigate through paginated content</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">
							Default Pagination (Page {currentPage} of 10)
						</Text>
					</div>
					<Pagination bind:currentPage totalPages={10} />
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">With Custom Icons</Text>
					</div>
					<Pagination currentPage={1} totalPages={5} maxVisible={5}>
						{#snippet prevIcon()}
							<Icon icon="lucide:chevron-left" width="16" height="16" />
						{/snippet}
						{#snippet nextIcon()}
							<Icon icon="lucide:chevron-right" width="16" height="16" />
						{/snippet}
					</Pagination>
				</div>

				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">Without Labels</Text>
					</div>
					<Pagination currentPage={3} totalPages={7} showLabels={false} />
				</div>

				<CodeBlock
					filename="Pagination.svelte"
					showLineNumbers
					lineCount={7}
					showCopy
					code={paginationCode}
				>
					{@html paginationHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<!-- Code Block -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Code Block</Heading>
				<Text variant="body" color="soft">Syntax-highlighted code display</Text>
			{/snippet}

			<Grid cols={1} gap="xl">
				<div>
					<div class="section-label">
						<Text variant="caption" color="soft">With All Features</Text>
					</div>
					<CodeBlock
						filename="example.ts"
						showLineNumbers
						lineCount={3}
						showCopy
						code={`function greet(name: string): void {\n  console.log(\`Hello, \${name}!\`);\n}`}
					>
						{@html exampleCodeHtml}
					</CodeBlock>
				</div>

				<CodeBlock
					filename="CodeBlock.svelte"
					showLineNumbers
					lineCount={12}
					showCopy
					code={codeBlockCode}
				>
					{@html codeBlockHtml}
				</CodeBlock>
			</Grid>
		</Card>

		<Divider />

		<!-- Usage Tips -->
		<Card padding="lg" class="accent-surface">
			{#snippet header()}
				<Heading level={2}>Usage Tips</Heading>
			{/snippet}

			<Grid cols={2} gap="lg">
				<div>
					<Heading level={4}>Tables</Heading>
					<Text variant="body" color="soft">
						Use <Code>striped</Code> for readability,
						<Code>hoverable</Code> for interactivity, and
						<Code>compact</Code> for dense data.
					</Text>
				</div>

				<div>
					<Heading level={4}>Badges vs Tags</Heading>
					<Text variant="body" color="soft">
						<Code>Badge</Code> for status indicators (read-only),
						<Code>Tag</Code> for categories (removable).
					</Text>
				</div>

				<div>
					<Heading level={4}>Avatars</Heading>
					<Text variant="body" color="soft">
						Always provide descriptive <Code>alt</Code> text. Use
						<Code>fallback</Code> for initials when image is unavailable.
					</Text>
				</div>

				<div>
					<Heading level={4}>Stats</Heading>
					<Text variant="body" color="soft">
						Use <Code>trend</Code> prop to show directional changes. Positive trends automatically get
						glow effect.
					</Text>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	.demo-group {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.section-label {
		display: block;
		margin-bottom: 0.75rem;
	}
</style>
