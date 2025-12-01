# @mrintel/villain-ui

[![npm version](https://img.shields.io/npm/v/@mrintel/villain-ui.svg)](https://www.npmjs.com/package/@mrintel/villain-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A luxury Svelte 5 component library with a distinctive dark aesthetic. Built for modern web applications that demand elegance, performance, and exceptional user experience.

## ✨ Features

- **🚀 Svelte 5 with Runes** - Built on the latest Svelte 5 reactivity system with full TypeScript support
- **🎨 Luxury Dark Aesthetic** - Premium glass morphism, accent glows, and sophisticated depth
- **🎭 Tailwind CSS v4** - Powered by the latest Tailwind with CSS variable theming
- **🌳 Tree-Shakeable** - Import only what you need for optimal bundle size
- **🎯 Fully Typed** - Strict TypeScript mode with complete type definitions
- **🎬 Premium Motion** - Smooth animations with custom luxury easing curves
- **🔧 Highly Customizable** - Theme via CSS variables without touching component code
- **♿ Accessible** - ARIA-compliant components following WAI-ARIA best practices

## 📦 Installation

```bash
# npm
npm install @mrintel/villain-ui

# pnpm
pnpm add @mrintel/villain-ui

# yarn
yarn add @mrintel/villain-ui
```

> **Note on Imports:** All components are exported from the root package (`@mrintel/villain-ui`). Category-specific subpath imports (e.g., `@mrintel/villain-ui/buttons`) are not provided, as the library is designed for tree-shaking at the component level. Your bundler will automatically include only the components you import.

### Peer Dependencies

Install the required peer dependencies if you haven't already:

```bash
npm install svelte@^5.0.0 tailwindcss@^4.0.0
```

### Import Theme

**Important:** The theme CSS is **not** automatically imported when you use components. You must explicitly import it in your app's entry point to apply the default styles.

Import the theme CSS in your app's entry point (e.g., `+layout.svelte` in SvelteKit or `main.ts` in Vite):

```typescript
import '@mrintel/villain-ui/theme.css';
```

This explicit import strategy gives you full control over styling and allows you to:
- Use a custom theme instead of the default
- Conditionally load themes
- Override theme variables before or after the default theme loads

## 🚀 Quick Start

### SvelteKit Setup

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '@mrintel/villain-ui/theme.css';
</script>

<slot />
```

### Basic Usage

```svelte
<script>
  import { Button, Card } from '@mrintel/villain-ui';
</script>

<Card padding="lg">
  <h1>Welcome to @mrintel/villain-ui</h1>
  <p>Build luxury interfaces with ease.</p>
  <Button variant="primary">Get Started</Button>
</Card>
```

## 📚 Components

### Buttons

**Button** - Primary interactive element with variants

```svelte
<script>
  import { Button } from '@mrintel/villain-ui';
</script>

<Button variant="primary" size="md">Primary Button</Button>
<Button variant="secondary" size="md">Secondary Button</Button>
<Button variant="ghost" size="sm">Ghost Button</Button>
<Button variant="primary" size="lg" disabled>Disabled</Button>
```

**IconButton** - Compact button for icon-only interactions

```svelte
<script>
  import { IconButton } from '@mrintel/villain-ui';
</script>

<IconButton variant="primary" size="md" aria-label="Settings">
  <SettingsIcon />
</IconButton>
```

**ButtonGroup** - Group related buttons together

```svelte
<script>
  import { ButtonGroup, Button } from '@mrintel/villain-ui';
</script>

<ButtonGroup>
  <Button variant="secondary">Left</Button>
  <Button variant="secondary">Center</Button>
  <Button variant="secondary">Right</Button>
</ButtonGroup>
```

**LinkButton** - Button styled as link

```svelte
<script>
  import { LinkButton } from '@mrintel/villain-ui';
</script>

<LinkButton href="/docs" variant="primary">View Documentation</LinkButton>
```

**FloatingActionButton** - Prominent floating action button

```svelte
<script>
  import { FloatingActionButton } from '@mrintel/villain-ui';
</script>

<FloatingActionButton position="bottom-right" onclick={() => console.log('FAB clicked')}>
  <PlusIcon />
</FloatingActionButton>
```

### Forms

**Input** - Text input with label and error states

```svelte
<script>
  import { Input } from '@mrintel/villain-ui';
  
  let email = $state('');
  let hasError = $state(false);
</script>

<Input 
  type="email" 
  label="Email Address" 
  placeholder="you@example.com"
  bind:value={email}
  error={hasError}
/>
```

**Textarea** - Multi-line text input

```svelte
<script>
  import { Textarea } from '@mrintel/villain-ui';
  
  let comment = $state('');
</script>

<Textarea 
  label="Comment" 
  placeholder="Enter your comment..."
  rows={5}
  bind:value={comment}
/>
```

**Select** - Dropdown selection

```svelte
<script>
  import { Select } from '@mrintel/villain-ui';
  
  let selected = $state('');
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
</script>

<Select label="Choose an option" {options} bind:value={selected} />
```

**Checkbox** - Boolean selection

```svelte
<script>
  import { Checkbox } from '@mrintel/villain-ui';
  
  let accepted = $state(false);
</script>

<Checkbox label="I accept the terms and conditions" bind:checked={accepted} />
```

**Switch** - Toggle switch

```svelte
<script>
  import { Switch } from '@mrintel/villain-ui';
  
  let enabled = $state(false);
</script>

<Switch label="Enable notifications" bind:checked={enabled} />
```

**RadioGroup** - Single selection from multiple options

```svelte
<script>
  import { RadioGroup } from '@mrintel/villain-ui';
  
  let selected = $state('');
  const options = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
</script>

<RadioGroup label="Select size" {options} bind:value={selected} />
```

**RangeSlider** - Numeric range selection

```svelte
<script>
  import { RangeSlider } from '@mrintel/villain-ui';
  
  let volume = $state(50);
</script>

<RangeSlider label="Volume" min={0} max={100} bind:value={volume} />
```

**FileUpload** - File selection with drag & drop

```svelte
<script>
  import { FileUpload } from '@mrintel/villain-ui';
  
  function handleUpload(files) {
    console.log('Files:', files);
  }
</script>

<FileUpload 
  accept="image/*" 
  multiple 
  onchange={handleUpload}
  label="Upload Images"
/>
```

**InputGroup** - Grouped input with addons

```svelte
<script>
  import { InputGroup } from '@mrintel/villain-ui';
</script>

<InputGroup>
  {#snippet prepend()}
    https://
  {/snippet}
  
  <input type="text" placeholder="example.com" />
  
  {#snippet append()}
    .com
  {/snippet}
</InputGroup>
```

### Layout

**Card** - Content container with optional header and footer

```svelte
<script>
  import { Card } from '@mrintel/villain-ui';
</script>

<Card padding="lg" hoverable>
  {#snippet header()}
    <h2>Card Title</h2>
  {/snippet}
  
  <p>Card content goes here with beautiful glass morphism effect.</p>
  
  {#snippet footer()}
    <Button variant="primary">Action</Button>
  {/snippet}
</Card>
```

**Panel** - Simple content panel

```svelte
<script>
  import { Panel } from '@mrintel/villain-ui';
</script>

<Panel>
  <p>Panel content with default styling</p>
</Panel>
```

**Grid** - Responsive grid layout

```svelte
<script>
  import { Grid, Card } from '@mrintel/villain-ui';
</script>

<Grid columns={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

**Container** - Centered content container

```svelte
<script>
  import { Container } from '@mrintel/villain-ui';
</script>

<Container maxWidth="lg">
  <h1>Centered Content</h1>
</Container>
```

**SectionHeader** - Section heading with divider

```svelte
<script>
  import { SectionHeader } from '@mrintel/villain-ui';
</script>

<SectionHeader title="Features" subtitle="What makes us different" />
```

**Divider** - Visual separator

```svelte
<script>
  import { Divider } from '@mrintel/villain-ui';
</script>

<Divider />
<Divider orientation="vertical" />
```

### Navigation

**Navbar** - Top navigation bar

```svelte
<script>
  import { Navbar } from '@mrintel/villain-ui';
</script>

<Navbar>
  {#snippet logo()}
    <Logo />
  {/snippet}
  
  {#snippet links()}
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  {/snippet}
  
  {#snippet actions()}
    <Button variant="primary">Sign In</Button>
  {/snippet}
</Navbar>
```

**Sidebar** - Side navigation with collapsible state

```svelte
<script>
  import { Sidebar } from '@mrintel/villain-ui';
  
  let collapsed = $state(false);
</script>

<Sidebar bind:collapsed>
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/settings">Settings</a>
    <a href="/profile">Profile</a>
  </nav>
</Sidebar>
```

**Tabs** - Tabbed interface

```svelte
<script>
  import { Tabs } from '@mrintel/villain-ui';
  
  let activeTab = $state('tab1');
  const tabs = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Analytics' },
    { id: 'tab3', label: 'Reports' }
  ];
</script>

<Tabs {tabs} bind:activeTab>
  {#if activeTab === 'tab1'}
    <div>Overview content</div>
  {:else if activeTab === 'tab2'}
    <div>Analytics content</div>
  {:else}
    <div>Reports content</div>
  {/if}
</Tabs>
```

**Breadcrumbs** - Navigation breadcrumb trail

```svelte
<script>
  import { Breadcrumbs } from '@mrintel/villain-ui';
  
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category', href: '/products/category' },
    { label: 'Item' }
  ];
</script>

<Breadcrumbs {items} />
```

**Menu** - Vertical navigation menu

```svelte
<script>
  import { Menu } from '@mrintel/villain-ui';
  
  const items = [
    { label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { label: 'Settings', icon: SettingsIcon, href: '/settings' }
  ];
</script>

<Menu {items} />
```

**DropdownMenu** - Dropdown menu with items

```svelte
<script>
  import { DropdownMenu } from '@mrintel/villain-ui';
  
  const items = [
    { label: 'Edit', onclick: () => console.log('Edit') },
    { label: 'Delete', onclick: () => console.log('Delete') }
  ];
</script>

<DropdownMenu {items} trigger="Options" />
```

**ContextMenu** - Right-click context menu

```svelte
<script>
  import { ContextMenu } from '@mrintel/villain-ui';
  
  const items = [
    { label: 'Copy', onclick: () => console.log('Copy') },
    { label: 'Paste', onclick: () => console.log('Paste') }
  ];
</script>

<ContextMenu {items}>
  <div>Right click me</div>
</ContextMenu>
```

### Overlays & Feedback

**Modal** - Modal dialog with backdrop

```svelte
<script>
  import { Modal, Button } from '@mrintel/villain-ui';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Modal</Button>

<Modal bind:open title="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  
  {#snippet footer()}
    <Button variant="ghost" onclick={() => open = false}>Cancel</Button>
    <Button variant="primary" onclick={() => open = false}>Confirm</Button>
  {/snippet}
</Modal>
```

**Alert** - Alert message with variants

```svelte
<script>
  import { Alert } from '@mrintel/villain-ui';
</script>

<Alert variant="success" title="Success">
  Operation completed successfully!
</Alert>

<Alert variant="warning" title="Warning">
  Please review your changes.
</Alert>

<Alert variant="error" title="Error">
  An error occurred.
</Alert>
```

**Spinner** - Loading spinner

```svelte
<script>
  import { Spinner } from '@mrintel/villain-ui';
</script>

<Spinner size="lg" />
```

**Tooltip** - Hover tooltip

```svelte
<script>
  import { Tooltip } from '@mrintel/villain-ui';
</script>

<Tooltip content="This is a helpful tip" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

**ProgressBar** - Progress indicator

```svelte
<script>
  import { ProgressBar } from '@mrintel/villain-ui';
  
  let progress = $state(45);
</script>

<ProgressBar value={progress} max={100} showLabel />
```

**SkeletonLoader** - Content loading placeholder

```svelte
<script>
  import { SkeletonLoader } from '@mrintel/villain-ui';
</script>

<SkeletonLoader variant="text" count={3} />
<SkeletonLoader variant="circle" width="60px" height="60px" />
<SkeletonLoader variant="rectangle" width="100%" height="200px" />
```

**Toast** - Notification toast

```svelte
<script>
  import { Toast } from '@mrintel/villain-ui';
  
  let show = $state(false);
</script>

<Toast bind:show variant="success" duration={3000}>
  Changes saved successfully!
</Toast>
```

**Drawer** - Slide-out drawer panel

```svelte
<script>
  import { Drawer, Button } from '@mrintel/villain-ui';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Drawer</Button>

<Drawer bind:open position="right">
  <h2>Drawer Content</h2>
  <p>This slides in from the side.</p>
</Drawer>
```

**Popover** - Popover content

```svelte
<script>
  import { Popover } from '@mrintel/villain-ui';
</script>

<Popover>
  {#snippet trigger()}
    <Button>Click me</Button>
  {/snippet}
  
  {#snippet content()}
    <div>Popover content here</div>
  {/snippet}
</Popover>
```

**Dropdown** - Generic dropdown container

```svelte
<script>
  import { Dropdown } from '@mrintel/villain-ui';
</script>

<Dropdown trigger="Select Option">
  <a href="#">Option 1</a>
  <a href="#">Option 2</a>
  <a href="#">Option 3</a>
</Dropdown>
```

**CommandPalette** - Command palette with fuzzy search

```svelte
<script>
  import { CommandPalette } from '@mrintel/villain-ui';
  
  let open = $state(false);
  const commands = [
    { id: '1', label: 'New File', onSelect: () => console.log('New File') },
    { id: '2', label: 'Open Settings', onSelect: () => console.log('Settings') }
  ];
</script>

<CommandPalette bind:open {commands} placeholder="Search commands..." />
```

### Typography

**Heading** - Semantic heading levels

```svelte
<script>
  import { Heading } from '@mrintel/villain-ui';
</script>

<Heading level={1}>Main Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection</Heading>
```

**Text** - Text with variants

```svelte
<script>
  import { Text } from '@mrintel/villain-ui';
</script>

<Text variant="body">Regular body text</Text>
<Text variant="caption">Caption text</Text>
<Text variant="muted">Muted text</Text>
```

**Code** - Inline code

```svelte
<script>
  import { Code } from '@mrintel/villain-ui';
</script>

<p>Install with <Code>npm install @mrintel/villain-ui</Code></p>
```

### Data Display

**Table** - Data table

```svelte
<script>
  import { Table } from '@mrintel/villain-ui';
  
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];
  
  const data = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ];
</script>

<Table {columns} {data} hoverable striped />
```

**Pagination** - Page navigation

```svelte
<script>
  import { Pagination } from '@mrintel/villain-ui';
  
  let currentPage = $state(1);
  const totalPages = 10;
</script>

<Pagination bind:currentPage {totalPages} />
```

**Badge** - Status badge

```svelte
<script>
  import { Badge } from '@mrintel/villain-ui';
</script>

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
```

**Tag** - Removable tag

```svelte
<script>
  import { Tag } from '@mrintel/villain-ui';
</script>

<Tag onRemove={() => console.log('Removed')}>JavaScript</Tag>
<Tag>TypeScript</Tag>
```

**List** - Styled list

```svelte
<script>
  import { List } from '@mrintel/villain-ui';
  
  const items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<List {items} variant="ordered" />
```

**Avatar** - User avatar

```svelte
<script>
  import { Avatar } from '@mrintel/villain-ui';
</script>

<Avatar src="/avatar.jpg" alt="User" size="md" />
<Avatar initials="JD" size="lg" />
```

**CodeBlock** - Presentational component for displaying syntax-highlighted code

A luxury-styled code display component that provides layout, styling, and optional features like line numbers, filename headers, and line highlighting. Consumers control syntax highlighting by providing pre-highlighted HTML via the default slot.

**Key Features:**
- Glass morphism aesthetic with custom scrollbars
- Optional line numbers with highlighting support
- Optional filename header display
- Consumers choose their preferred syntax highlighter
- Responsive overflow handling

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filename` | `string` | `undefined` | Optional filename to display in the header |
| `showLineNumbers` | `boolean` | `false` | Whether to show line numbers in the gutter |
| `lineCount` | `number` | `0` | Total number of lines (required when `showLineNumbers` is `true`) |
| `highlightLines` | `number[]` | `[]` | Array of 1-indexed line numbers to highlight in the gutter |

**Important Notes:**
- Consumers are responsible for sanitizing HTML to prevent XSS attacks
- Apply `.line` class to each code line and `.highlighted` class to highlighted lines for consistent styling
- Line numbers are 1-indexed (first line is 1, not 0)
- When using `showLineNumbers`, provide the `lineCount` prop for proper rendering

**Basic Usage:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  
  const highlightedCode = `<pre><code class="language-javascript">
<span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Hello, world!'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>`;
</script>

<CodeBlock>
  {@html highlightedCode}
</CodeBlock>
```

**With Line Numbers:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  
  const code = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;
  
  const lineCount = code.split('\n').length;
  // Assume you have a highlighter that returns HTML
  const highlightedCode = yourHighlighter(code, 'javascript');
</script>

<CodeBlock showLineNumbers {lineCount}>
  {@html highlightedCode}
</CodeBlock>
```

**With Highlighted Lines:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  
  const code = `function calculate(a, b) {
  const sum = a + b;
  return sum * 2;
}`;
  
  const lineCount = 4;
  const highlightedCode = yourHighlighter(code, 'javascript');
  const highlightLines = [2]; // Highlight line 2
</script>

<CodeBlock showLineNumbers {lineCount} {highlightLines}>
  {@html highlightedCode}
</CodeBlock>
```

**With Filename:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  
  const code = `export function add(a: number, b: number): number {
  return a + b;
}`;
  
  const highlightedCode = yourHighlighter(code, 'typescript');
</script>

<CodeBlock filename="utils.ts">
  {@html highlightedCode}
</CodeBlock>
```

**Integration with Shiki:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  import { codeToHtml } from 'shiki';
  import { onMount } from 'svelte';
  
  const code = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;
  
  let highlightedCode = $state('');
  let lineCount = $state(0);
  
  onMount(async () => {
    highlightedCode = await codeToHtml(code, {
      lang: 'javascript',
      theme: 'github-dark'
    });
    lineCount = code.split('\n').length;
  });
</script>

<CodeBlock filename="fibonacci.js" showLineNumbers {lineCount} highlightLines={[2, 3]}>
  {@html highlightedCode}
</CodeBlock>
```

**Integration with Prism.js:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism-tomorrow.css';
  
  const code = `const greeting = (name) => {
  console.log(\`Hello, \${name}!\`);
};`;
  
  const lineCount = code.split('\n').length;
  const highlightedCode = Prism.highlight(code, Prism.languages.javascript, 'javascript');
</script>

<CodeBlock showLineNumbers {lineCount}>
  <pre><code class="language-javascript">{@html highlightedCode}</code></pre>
</CodeBlock>
```

**Integration with Highlight.js:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  
  const code = `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
  
  const lineCount = code.split('\n').length;
  const highlightedCode = hljs.highlight(code, { language: 'java' }).value;
</script>

<CodeBlock filename="HelloWorld.java" showLineNumbers {lineCount}>
  <pre><code class="language-java">{@html highlightedCode}</code></pre>
</CodeBlock>
```

**Stat** - Statistic display

```svelte
<script>
  import { Stat } from '@mrintel/villain-ui';
</script>

<Stat label="Total Users" value="1,234" change="+12.5%" trend="up" />
```

### Utilities

**Portal** - Render content in different DOM location

```svelte
<script>
  import { Portal } from '@mrintel/villain-ui';
</script>

<Portal target="body">
  <div>This renders at the end of body</div>
</Portal>
```

**Collapse** - Collapsible content

```svelte
<script>
  import { Collapse } from '@mrintel/villain-ui';
  
  let open = $state(false);
</script>

<Collapse title="Click to expand" open={open} onToggle={() => open = !open}>
  <p>Hidden content that can be toggled</p>
</Collapse>
```

**Accordion** - Accordion with multiple items

```svelte
<script>
  import { Accordion } from '@mrintel/villain-ui';
  
  const items = [
    { id: '1', title: 'Section 1', content: 'Content for section 1' },
    { id: '2', title: 'Section 2', content: 'Content for section 2' }
  ];
  
  let openItems = $state([]);
</script>

<Accordion {items} bind:openItems mode="multiple" />
```

**Carousel** - Image/content carousel

```svelte
<script>
  import { Carousel } from '@mrintel/villain-ui';
  
  const items = [
    { id: '1', content: 'Slide 1' },
    { id: '2', content: 'Slide 2' },
    { id: '3', content: 'Slide 3' }
  ];
  
  let currentIndex = $state(0);
</script>

<Carousel {items} bind:currentIndex autoplay showDots showArrows />
```

**ScrollArea** - Custom scrollable area

```svelte
<script>
  import { ScrollArea } from '@mrintel/villain-ui';
</script>

<ScrollArea height="300px">
  <div>Long scrollable content...</div>
</ScrollArea>
```

## 🎨 Theming

### CSS Variable System

@mrintel/villain-ui uses a comprehensive CSS variable system that allows complete customization without touching component code. All theme variables are defined in `theme.css` and can be overridden in your own CSS.

### Custom Theme Example

Create a custom CSS file (e.g., `custom-theme.css`) and import it **after** the library theme:

```css
/* custom-theme.css */

/* Override accent color from purple to blue */
:root {
  --color-accent: #3B82F6;
  --color-accent-soft: #60A5FA;
  --color-accent-dark: #1E40AF;
  
  --shadow-accent-glow: 
    0 0 20px rgba(59, 130, 246, 0.4),
    0 0 40px rgba(59, 130, 246, 0.2),
    0 0 60px rgba(59, 130, 246, 0.1);
  
  --shadow-text-glow: 
    0 0 20px rgba(59, 130, 246, 0.5),
    0 0 40px rgba(59, 130, 246, 0.3);
}
```

Import order in your app:

```typescript
import '@mrintel/villain-ui/theme.css';
import './custom-theme.css'; // Your overrides
```

### Typography Customization

```css
:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  --text-h1-size: 4rem;
  --text-body-size: 1.125rem;
}
```

### Border Radius Customization

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
}
```

### Complete Variable Reference

#### Colors

**Base Colors**
- `--color-base-0` through `--color-base-3`: Background layers
- `--color-surface`: Default surface color
- `--color-panel`: Panel background
- `--color-overlay`: Modal/overlay backdrop

**Accent Colors**
- `--color-accent`: Primary accent color
- `--color-accent-soft`: Lighter accent variant
- `--color-accent-dark`: Darker accent variant

**Text Colors**
- `--color-text`: Primary text color
- `--color-text-soft`: Secondary text color
- `--color-text-muted`: Muted/disabled text

**State Colors**
- `--color-success`: Success state
- `--color-warning`: Warning state
- `--color-error`: Error state

**Border Colors**
- `--color-border`: Default border
- `--color-border-strong`: Emphasized border

#### Typography

**Font Families**
- `--font-heading`: Heading font stack
- `--font-body`: Body text font stack
- `--font-mono`: Monospace font stack

**Text Scales** (h1-h6, body, caption)
- `--text-{level}-size`: Font size
- `--text-{level}-line-height`: Line height
- `--text-{level}-weight`: Font weight

#### Layout

**Border Radii**
- `--radius-none` through `--radius-2xl`, `--radius-pill`

**Spacing**
- `--spacing-4.5`: 1.125rem
- `--spacing-18`: 4.5rem

#### Effects

**Shadows**
- `--shadow-accent-glow`: Accent glow effect
- `--shadow-deep`: Deep shadow
- `--shadow-text-glow`: Text glow effect

**Glass Effect**
- `--glass-panel-background`: Glass panel background

#### Motion

**Easing Curves**
- `--ease-luxe`: Primary luxury easing
- `--ease-sharp`: Sharp transitions

### Custom Utility Classes

The library provides custom utility classes you can use:

- `.text-glow` - Apply accent glow to text
- `.glass-panel` - Glass morphism effect with backdrop blur
- `.accent-glow` - Accent color glow effect
- `.hover-lift` - Lift and glow on hover

Example usage:

```svelte
<div class="glass-panel accent-glow">
  <h2 class="text-glow">Glowing Title</h2>
</div>
```

### Theme Persistence

The brand structure (depth system, spacing, motion curves) persists even when colors change, maintaining the luxury aesthetic regardless of your chosen palette.

## 🛠️ Development

### Clone and Setup

```bash
git clone <repository-url>
cd villain-ui
npm install
```

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build the library for production
- `npm run type-check` - Run TypeScript type checking
- `npm run check` - Alias for type-check

### Build Output

The build creates a `dist/` directory with:

```
dist/
├── index.js          # Compiled components
├── index.d.ts        # TypeScript declarations
└── theme.css         # Compiled theme styles
```

### Manual Build Before Publishing

If you want to verify the build manually:

```bash
npm run build
npm pack
```

This creates a `.tgz` file you can inspect before publishing.

## 📘 TypeScript Support

@mrintel/villain-ui is built with TypeScript in strict mode and includes complete type definitions.

- ✅ Full TypeScript support
- ✅ Strict mode enabled
- ✅ Type definitions included in `dist/index.d.ts`
- ✅ All components have typed Props interfaces
- ✅ IntelliSense support in VS Code and other editors

Import types directly from components:

```typescript
import type { Button } from '@mrintel/villain-ui';

// Component props are fully typed
const props: ComponentProps<typeof Button> = {
  variant: 'primary',
  size: 'md',
  disabled: false
};
```

## 🌐 Browser Support

@mrintel/villain-ui targets modern browsers that support:

- ✅ CSS Variables (Custom Properties)
- ✅ CSS `backdrop-filter` for glass morphism
- ✅ ES2022+ JavaScript features
- ✅ Tailwind CSS v4 requirements

**Supported Browsers:**
- Chrome/Edge 88+
- Firefox 94+
- Safari 15.4+
- Opera 74+

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Built with ❤️ for the modern web**
