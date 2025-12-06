# @mrintel/villain-ui

[![npm version](https://img.shields.io/npm/v/@mrintel/villain-ui.svg)](https://www.npmjs.com/package/@mrintel/villain-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A luxury Svelte 5 component library featuring a **Modern Villain Luxury** aesthetic. Built on Onyx Black backgrounds with Royal Purple accents, glass morphism, and neon edges for modern web applications that demand commanding elegance and exceptional user experience.

## ✨ Features

- **🚀 Svelte 5 with Runes** - Built on the latest Svelte 5 reactivity system with full TypeScript support
- **🎨 Modern Villain Luxury** - Onyx Black base with Royal Purple accents, glass morphism, and commanding neon edges
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

Install the required peer dependency:

```bash
npm install svelte@^5.0.0
```

**Note on Tailwind CSS:** The library uses Tailwind CSS v4 internally for styling, but it is **not required** as a peer dependency. The compiled theme CSS is included in the package. You only need to install Tailwind CSS in your project if you want to extend the library's theme with custom Tailwind utilities or use Tailwind for your own application styling.

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

## ✨ Key Features

### Icon Support with Snippets

Comprehensive icon snippet support across the entire component library for maximum flexibility:

**Forms:**
- **Input**: `icon`, `iconPosition` ("before"/"after"), `iconPrefix`, `iconSuffix` props for flexible icon placement in text inputs
- **Select, Textarea**: Single `icon` snippet positioned at the left with automatic padding
- **Checkbox, Switch**: Simple `icon` prop for visual enhancement
- **RadioGroup**: Per-option `icon` in options array for rich radio lists
- **FileUpload**: Custom `icon` prop to override default upload icon

**Buttons & Navigation:**
- **Button, LinkButton**: `icon` + `iconPosition`, or separate `iconBefore`/`iconAfter` props for flexible positioning
- **Breadcrumbs**: Per-item `icon` in items array for visual breadcrumb trails
- **Pagination**: `prevIcon` and `nextIcon` props for custom navigation arrows

**Data Display:**
- **Badge, Tag**: Simple `icon` prop for status indicators and tags
- **List**: Per-item `icon` in items array for icon lists
- **Avatar**: Image/initials support (not snippet-based)

**Overlays:**
- **Alert**: `icon` override for custom alert icons
- **Modal, Toast, Drawer**: `icon` prop for title icons

**Navigation:**
- **Tabs**: Per-tab `icon` in tabs array
- **Menu**: Built-in icon support

#### Icon API Patterns

The library uses three consistent icon patterns:

**1. Simple icon prop** - Single `icon?: Snippet` for components with one icon position:
```svelte
<Tag>
  {#snippet icon()}
    <StarIcon class="w-4 h-4" />
  {/snippet}
  Featured
</Tag>
```

**2. Positional icon props** - `icon` + `iconPosition` or separate `iconBefore`/`iconAfter`:
```svelte
<Button iconPosition="after">
  {#snippet icon()}
    <ArrowRightIcon class="w-5 h-5" />
  {/snippet}
  Next
</Button>

<!-- Or with separate snippets -->
<LinkButton>
  {#snippet iconBefore()}
    <HomeIcon class="w-5 h-5" />
  {/snippet}
  Home
  {#snippet iconAfter()}
    <ExternalLinkIcon class="w-4 h-4" />
  {/snippet}
</LinkButton>
```

**3. Prefix/Suffix icon props** - For text inputs with icons inside the field:
```svelte
<Input placeholder="Search...">
  {#snippet iconPrefix()}
    <SearchIcon class="w-5 h-5" />
  {/snippet}
</Input>

<!-- Or use icon + iconPosition -->
<Input iconPosition="before" placeholder="Email">
  {#snippet icon()}
    <MailIcon class="w-5 h-5" />
  {/snippet}
</Input>
```

**4. Per-item icons** - Icons specified in item/option arrays:
```svelte
<script>
  const items = [
    { 
      value: 'option1', 
      label: 'Option 1',
      icon: () => `{@render MyIcon()}`
    }
  ];
</script>

<List {items} />
<RadioGroup {items} bind:value={selected} />
<Breadcrumbs {items} />
```

#### Best Practices

- **Consistent sizing**: Use `w-5 h-5` or `w-4 h-4` across your application for visual harmony
- **Color inheritance**: Icons automatically inherit text color via `currentColor`
- **Library agnostic**: Works with any icon library (Heroicons, Lucide, Phosphor, etc.) or inline SVG
- **Optional everywhere**: All icon snippets are optional - components work perfectly without them

### Active State Support

**Navbar** and **Sidebar** components now automatically style active navigation items:

- Add the `active` class to links/buttons for current page indication
- Or use the new `currentPath` prop for automatic active state management (see Layout Best Practices)
- **How `currentPath` works**: Components scan for `<a>` and `<button>` elements, match their `href` or `data-href` attribute against `currentPath`, and automatically add/remove the `active` class
- **Manual classes preserved**: Manually applied `active` classes take precedence and are never removed by automatic management
- **Falsy currentPath**: When `currentPath` becomes falsy, only auto-managed `active` classes are cleared
- **Button support**: Buttons need a `data-href` attribute to participate in automatic active state (e.g., `<button data-href="/action">Action</button>`)
- Navbar: Shows accent color with underline indicator
- Sidebar: Shows accent background, left border, and glow effect
- Works seamlessly with SvelteKit's page stores or manual state management

### Improved Layout Management

**Automatic Sidebar Positioning** - Sidebar now automatically detects Navbar presence and adjusts its top position to start just below the Navbar. Zero configuration needed!

**How it works:**
- Sidebar uses a `data-navbar` attribute selector to find the Navbar element
- Reads the Navbar's `offsetHeight` and dynamically sets its own `top` style property
- A ResizeObserver watches for Navbar height changes (responsive behavior, window resize)
- When Navbar is absent, Sidebar starts from the top (top: 0)

**Z-index layering** ensures proper visual hierarchy:
- **Navbar**: `z-50` (highest, sits on top)
- **Sidebar**: `z-40` (below navbar, above content)
- **Modals, tooltips, overlays**: `z-50+` (above everything)

**Example - Zero Configuration:**
```svelte
<script>
  let sidebarOpen = $state(true);
</script>

<!-- Navbar automatically gets data-navbar attribute -->
<Navbar position="sticky" height="md">
  {#snippet toggleButton()}
    <IconButton variant="ghost" onclick={() => sidebarOpen = !sidebarOpen}>
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </IconButton>
  {/snippet}
  
  {#snippet logo()}
    <span>MyApp</span>
  {/snippet}
  
  {#snippet navigation()}
    <a href="/">Home</a>
    <a href="/about">About</a>
  {/snippet}
  
  {#snippet actions()}
    <Button variant="primary">Sign In</Button>
  {/snippet}
</Navbar>

<!-- Sidebar automatically detects Navbar and positions below it -->
<Sidebar bind:open={sidebarOpen} side="left" width="md">
  <!-- Sidebar content -->
</Sidebar>

<!-- No manual margin-top needed on Sidebar! -->
```

**Responsive behavior**: The Sidebar's positioning updates automatically when the Navbar height changes (e.g., responsive breakpoints, content changes). This ensures consistent layout across all screen sizes.

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

<!-- Simple icon usage -->
<Button variant="primary">
  {#snippet icon()}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
  {/snippet}
  Add Item
</Button>

<!-- Icon after text -->
<Button variant="secondary" iconPosition="after">
  Download
  {#snippet icon()}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  {/snippet}
</Button>

<!-- Advanced: Different icons before and after -->
<Button variant="primary">
  {#snippet iconBefore()}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  {/snippet}
  Upload Photo
  {#snippet iconAfter()}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  {/snippet}
</Button>
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

**Icon Examples:**
```svelte
<!-- LinkButton with icon before text -->
<LinkButton href="/docs" variant="primary">
  {#snippet icon()}
    <BookOpenIcon class="w-5 h-5" />
  {/snippet}
  View Documentation
</LinkButton>

<!-- LinkButton with icon after text -->
<LinkButton href="/download" variant="secondary" iconPosition="after">
  Download
  {#snippet icon()}
    <DownloadIcon class="w-5 h-5" />
  {/snippet}
</LinkButton>

<!-- LinkButton with different icons before and after -->
<LinkButton href="/external" variant="ghost" target="_blank">
  {#snippet iconBefore()}
    <ExternalLinkIcon class="w-4 h-4" />
  {/snippet}
  External Link
  {#snippet iconAfter()}
    <ArrowRightIcon class="w-4 h-4" />
  {/snippet}
</LinkButton>
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

**Icon Examples:**
```svelte
<!-- Input with prefix icon (search) -->
<Input 
  type="text" 
  label="Search" 
  placeholder="Search..."
  bind:value={searchQuery}
>
  {#snippet iconPrefix()}
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  {/snippet}
</Input>

<!-- Input with suffix icon (password visibility toggle) -->
<Input 
  type="password" 
  label="Password" 
  bind:value={password}
>
  {#snippet iconSuffix()}
    <button onclick={togglePasswordVisibility}>
      <EyeIcon class="w-5 h-5" />
    </button>
  {/snippet}
</Input>

<!-- Input with simple icon prop and position -->
<Input 
  type="email" 
  label="Email" 
  iconPosition="before"
  bind:value={email}
>
  {#snippet icon()}
    <MailIcon class="w-5 h-5" />
  {/snippet}
</Input>
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

**Icon Example:**
```svelte
<Textarea 
  label="Message" 
  rows={5}
  bind:value={message}
>
  {#snippet icon()}
    <MessageIcon class="w-5 h-5" />
  {/snippet}
</Textarea>
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

**Icon Example:**
```svelte
<Select 
  label="Country" 
  {options} 
  bind:value={selectedCountry}
>
  {#snippet icon()}
    <GlobeIcon class="w-5 h-5" />
  {/snippet}
</Select>
```

**Note:** Select and Textarea each support a single left-aligned `icon` snippet with automatic padding, not separate prefix/suffix slots.

**Checkbox** - Boolean selection

```svelte
<script>
  import { Checkbox } from '@mrintel/villain-ui';
  
  let accepted = $state(false);
</script>

<Checkbox label="I accept the terms and conditions" bind:checked={accepted} />
```

**Icon Example:**
```svelte
<Checkbox bind:checked={accepted}>
  {#snippet icon()}
    <ShieldCheckIcon class="w-4 h-4" />
  {/snippet}
  I accept the terms and conditions
</Checkbox>
```

**Switch** - Toggle switch

```svelte
<script>
  import { Switch } from '@mrintel/villain-ui';
  
  let enabled = $state(false);
</script>

<Switch label="Enable notifications" bind:checked={enabled} />
```

**Icon Example:**
```svelte
<Switch bind:checked={darkMode}>
  {#snippet icon()}
    <MoonIcon class="w-4 h-4" />
  {/snippet}
  Dark Mode
</Switch>
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

**Icon Example:**
```svelte
<script>
  const options = [
    { 
      value: 'card', 
      label: 'Credit Card',
      icon: () => {
        return `<svg class="w-5 h-5" ...>...</svg>`;
      }
    },
    { 
      value: 'paypal', 
      label: 'PayPal',
      icon: () => {
        return `<svg class="w-5 h-5" ...>...</svg>`;
      }
    }
  ];
</script>

<RadioGroup 
  label="Payment Method" 
  {options} 
  bind:value={paymentMethod} 
/>
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

**Icon Example:**
```svelte
<FileUpload 
  bind:files={uploadedFiles}
  accept="image/*"
>
  {#snippet icon()}
    <CloudUploadIcon class="w-8 h-8" />
  {/snippet}
</FileUpload>
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

<!-- Card as a link with lift effect and icon -->
<Card href="/features" liftOnHover padding="lg">
  {#snippet icon()}
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  {/snippet}
  
  <h3>Feature Name</h3>
  <p>Clickable card with enhanced hover lift effect.</p>
</Card>
```

**Props:**
- `href?: string` - Makes the card a clickable link (renders as `<a>` tag)
- `target?: string` - Link target attribute (e.g., '_blank')
- `rel?: string` - Link rel attribute (defaults to 'noopener noreferrer' for target='_blank')
- `liftOnHover?: boolean` - Apply enhanced lift effect on hover using `.hover-lift-enhanced` utility
- `hoverable?: boolean` - Basic hover effect (deprecated, use `liftOnHover` instead)
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding (default: 'md')
- `icon?: Snippet` - Optional icon displayed with `.card-icon` utility
- `header?: Snippet` - Optional header content
- `footer?: Snippet` - Optional footer content
- `children?: Snippet` - Main card content
- `class?: string` - Additional CSS classes

**Note:** When using `liftOnHover`, the card applies the `.hover-lift-enhanced` utility for a dramatic lift with accent border and glow. The `icon` snippet uses the `.card-icon` utility class for centered, accent-colored icon display.

**LinkCard** - Convenience wrapper for clickable cards

```svelte
<script>
  import { LinkCard } from '@mrintel/villain-ui';
</script>

<!-- Minimal boilerplate for a fully clickable, lifting card -->
<LinkCard href="/features">
  {#snippet icon()}
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  {/snippet}
  
  <h3>Quick Feature Card</h3>
  <p>LinkCard automatically enables liftOnHover and sets padding='md'.</p>
</LinkCard>

<!-- With custom padding -->
<LinkCard href="/docs" padding="lg">
  <h3>Documentation</h3>
  <p>All the Card props work here too.</p>
</LinkCard>
```

**Props:**
- `href: string` - Link destination (required)
- `target?: string` - Link target attribute
- `rel?: string` - Link rel attribute (auto-defaults for security)
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding (default: 'md')
- `icon?: Snippet` - Optional icon using `.card-icon` utility
- `header?: Snippet` - Optional header content
- `footer?: Snippet` - Optional footer content
- `children?: Snippet` - Main card content
- `class?: string` - Additional CSS classes

**Note:** `LinkCard` is a convenience wrapper around `Card` that automatically sets `liftOnHover={true}` and provides sensible defaults for clickable cards. Use it when you want a fully clickable card with the `.hover-lift-enhanced` effect without manually configuring those props. All other Card props are supported.

**Panel** - Simple content panel

```svelte
<script>
  import { Panel } from '@mrintel/villain-ui';
</script>

<!-- Recommended: Use variant prop for styling -->
<Panel variant="glass" padding="lg">
  <p>Enhanced glass morphism panel</p>
</Panel>

<!-- Default panel with basic glass styling -->
<Panel>
  <p>Panel content with default styling</p>
</Panel>

<!-- Legacy: glass prop (deprecated, use variant='glass' instead) -->
<Panel glass={false}>
  <p>Solid background panel (backwards compatible)</p>
</Panel>
```

**Panel Props:**
- `variant?: 'default' | 'glass'` - Primary styling selector. Use `'glass'` for enhanced glass morphism with accent glow.
- `padding?: 'none' | 'sm' | 'md' | 'lg'` - Internal padding (default: `'md'`)
- `rounded?: boolean` - Apply rounded corners (default: `true`)
- `glass?: boolean` - **Deprecated**. Use `variant='glass'` instead. Only affects `variant='default'` for backwards compatibility.
- `class?: string` - Additional CSS classes

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
  import { Navbar, Button, IconButton } from '@mrintel/villain-ui';
  import { page } from '$app/stores';
  
  let sidebarOpen = $state(false);
  let currentPath = $derived($page.url.pathname);
</script>

<Navbar {currentPath}>
  {#snippet toggleButton()}
    <IconButton variant="ghost" size="sm" onclick={() => sidebarOpen = !sidebarOpen}>
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </IconButton>
  {/snippet}
  
  {#snippet logo()}
    <span style="color: var(--color-accent)">MyApp</span>
  {/snippet}
  
  {#snippet navigation()}
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  {/snippet}
  
  {#snippet actions()}
    <Button variant="primary">Sign In</Button>
  {/snippet}
</Navbar>
```

**Props:**
- `position?: 'sticky' | 'fixed'` - Navbar positioning (default: 'sticky')
- `height?: 'sm' | 'md' | 'lg'` - Navbar height (default: 'md')
- `navigationAlign?: 'left' | 'center'` - Navigation alignment (default: 'center')
- `toggleButton?: Snippet` - Toggle button slot (typically for sidebar/mobile menu)
- `logo?: Snippet` - Logo content snippet
- `navigation?: Snippet` - Primary navigation links slot
- `actions?: Snippet` - Action buttons or profile controls slot
- `children?: Snippet` - Fallback navigation content (used if `navigation` not provided)
- `currentPath?: string` - Current route path for automatic active state highlighting

**Note:** The `currentPath` prop enables automatic active state management. Links matching the current path will receive the `active` class automatically.

**Sidebar** - Side navigation with collapsible state

```svelte
<script>
  import { Sidebar } from '@mrintel/villain-ui';
  import { page } from '$app/stores';
  
  let open = $state(true);
  let currentPath = $derived($page.url.pathname);
</script>

<Sidebar bind:open {currentPath}>
  {#snippet header()}
    <div>App Name</div>
  {/snippet}
  
  <!-- Recommended markup pattern for predictable collapsed behavior -->
  <a href="/dashboard">
    <span class="sidebar-item-icon">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </span>
    <span class="sidebar-item-label">Dashboard</span>
  </a>
  
  <a href="/settings">
    <span class="sidebar-item-icon">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </span>
    <span class="sidebar-item-label">Settings</span>
  </a>
  
  <!-- Items without icons will show first letter in collapsed mode -->
  <a href="/profile">
    <span class="sidebar-item-label">Profile</span>
  </a>
</Sidebar>
```

**Props:**
- `open?: boolean` (bindable) - Sidebar open/collapsed state (default: true)
- `side?: 'left' | 'right'` - Sidebar position (default: 'left')
- `width?: 'sm' | 'md' | 'lg'` - Sidebar width when open (default: 'md')
- `header?: Snippet` - Header content snippet
- `children?: Snippet` - Sidebar navigation content
- `currentPath?: string` - Current route path for automatic active state highlighting

**Collapsed Mode Behavior:**
- Items with `.sidebar-item-icon` will show the icon centered when collapsed
- Items without icons will show the first letter of `.sidebar-item-label` (or text content) in a circular badge
- Use `.sidebar-item-icon` and `.sidebar-item-label` classes for predictable behavior
- `currentPath?: string` - Current route path for automatic active state highlighting

**Collapsed State Behavior:** 

When `open={false}`, the sidebar automatically adapts its display:
- **Items with icons**: Shows centered icons (enlarged to `1.5rem`) with text hidden
- **Items without icons**: Shows first letter in an accent-colored circle as a fallback
- **Header**: Remains visible with reduced padding and centered text

The component automatically detects icons by looking for `<svg>`, `[class*="icon"]`, or `[data-icon]` elements. All transitions use smooth animations with `var(--ease-luxe)`.

**Active State Management**

Navigation components (`Navbar`, `Sidebar`) support automatic active state highlighting via the `currentPath` prop. Pass the current route path, and the component will automatically add the `active` class to matching links and buttons based on `href` or `data-href` attributes. This eliminates manual active class management.

Example:
```svelte
<script>
  import { page } from '$app/stores'; // SvelteKit
  let currentPath = $derived($page.url.pathname);
</script>

<Navbar {currentPath}>
  <a href="/">Home</a>
  <a href="/about">About</a>
</Navbar>
```

The component matches exact paths and nested routes (e.g., `/buttons` matches `/buttons/icon-button`).

**Tabs** - Tabbed interface

```svelte
<script>
  import { Tabs } from '@mrintel/villain-ui';
  
  let activeTab = $state('tab1');
  const tabs = [
    { 
      id: 'tab1', 
      label: 'Overview',
      icon: OverviewIcon // Snippet reference
    },
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

**Icon Example:**
```svelte
<script>
  import { Breadcrumbs } from '@mrintel/villain-ui';
  import { HomeIcon, FolderIcon, DocumentIcon } from 'your-icon-library';
  
  const items = [
    { 
      label: 'Home', 
      href: '/',
      icon: HomeIcon // Snippet reference
    },
    { 
      label: 'Projects', 
      href: '/projects',
      icon: FolderIcon // Snippet reference
    },
    { 
      label: 'Document',
      icon: DocumentIcon // Snippet reference
    }
  ];
</script>

<Breadcrumbs {items} />
```

**Menu** - Vertical navigation menu

```svelte
<script>
  import { Menu } from '@mrintel/villain-ui';
  
  const items = [
    { 
      id: 'dashboard',
      label: 'Dashboard', 
      icon: DashboardIcon, // Snippet reference
      onclick: () => goto('/dashboard')
    },
    { 
      id: 'settings',
      label: 'Settings', 
      icon: SettingsIcon, // Snippet reference
      onclick: () => goto('/settings')
    }
  ];
</script>

<Menu {items} />
```

**Props:**
- `items?: MenuItem[]` - Array of menu items
- `children?: Snippet` - Alternative to items array for custom content

**MenuItem Interface:**
- `id: string` - Unique identifier
- `label: string` - Display text
- `icon?: Snippet` - Optional icon snippet
- `disabled?: boolean` - Disable item
- `onclick?: () => void` - Click handler

**DropdownMenu** - Dropdown menu with items

```svelte
<script>
  import { DropdownMenu, Menu, Button } from '@mrintel/villain-ui';
  
  const menuItems = [
    { id: 'edit', label: 'Edit', onclick: () => console.log('Edit') },
    { id: 'delete', label: 'Delete', onclick: () => console.log('Delete') }
  ];
</script>

<DropdownMenu>
  {#snippet trigger()}
    <Button>Options</Button>
  {/snippet}
  
  <Menu items={menuItems} />
</DropdownMenu>
```

**Props:**
- `open?: boolean` (bindable) - Dropdown open state
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'` - Menu position
- `trigger?: Snippet` - Trigger button content
- `children?: Snippet` - Dropdown menu content

**ContextMenu** - Right-click context menu

```svelte
<script>
  import { ContextMenu, Menu } from '@mrintel/villain-ui';
  
  const menuItems = [
    { id: 'copy', label: 'Copy', onclick: () => console.log('Copy') },
    { id: 'paste', label: 'Paste', onclick: () => console.log('Paste') }
  ];
</script>

<ContextMenu>
  {#snippet trigger()}
    <div>Right click me</div>
  {/snippet}
  
  <Menu items={menuItems} />
</ContextMenu>
```

**Props:**
- `open?: boolean` (bindable) - Context menu open state
- `x?: number` (bindable) - Menu X position
- `y?: number` (bindable) - Menu Y position
- `trigger?: Snippet` - Content that triggers context menu on right-click
- `children?: Snippet` - Context menu content

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

**Icon Example:**
```svelte
<script>
  import { Modal, Button } from '@mrintel/villain-ui';
  import { ExclamationTriangleIcon } from 'your-icon-library';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Delete Item</Button>

<Modal bind:open title="Confirm Deletion">
  {#snippet icon()}
    <ExclamationTriangleIcon class="w-6 h-6 text-error" />
  {/snippet}
  
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  
  {#snippet footer()}
    <Button variant="ghost" onclick={() => open = false}>Cancel</Button>
    <Button variant="primary" onclick={() => { deleteItem(); open = false; }}>Delete</Button>
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

<!-- With custom icon -->
<Alert variant="info" title="Custom Icon">
  {#snippet icon()}
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
    </svg>
  {/snippet}
  This alert uses a custom icon snippet.
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

**Icon Examples:**
```svelte
<script>
  import { Toast } from '@mrintel/villain-ui';
  import { CheckCircleIcon, XCircleIcon } from 'your-icon-library';
  
  let showSuccess = $state(false);
  let showError = $state(false);
</script>

<!-- Success toast with custom icon -->
<Toast bind:show={showSuccess} variant="success" duration={3000}>
  {#snippet icon()}
    <CheckCircleIcon class="w-5 h-5" />
  {/snippet}
  Changes saved successfully!
</Toast>

<!-- Error toast with custom icon -->
<Toast bind:show={showError} variant="error" duration={5000}>
  {#snippet icon()}
    <XCircleIcon class="w-5 h-5" />
  {/snippet}
  Failed to save changes. Please try again.
</Toast>

<!-- Info toast with custom icon -->
<Toast bind:show={showInfo} variant="info">
  {#snippet icon()}
    <InformationCircleIcon class="w-5 h-5" />
  {/snippet}
  New features available! Check them out.
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

**Icon Example:**
```svelte
<script>
  import { Drawer, Button } from '@mrintel/villain-ui';
  import { Cog6ToothIcon } from 'your-icon-library';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Settings</Button>

<Drawer bind:open position="right" title="Settings">
  {#snippet icon()}
    <Cog6ToothIcon class="w-6 h-6" />
  {/snippet}
  
  <div class="space-y-4">
    <h3>Application Settings</h3>
    <p>Configure your preferences here.</p>
    <!-- Settings content -->
  </div>
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

<!-- Gradient variant for hero and section titles -->
<Heading level={1} variant="gradient">Hero Title with Gradient</Heading>
<Heading level={2} variant="gradient" glow>Section with Gradient and Glow</Heading>
```

**Props:**
- `level: 1 | 2 | 3 | 4 | 5 | 6` - Semantic heading level (required)
- `variant?: 'gradient'` - Apply gradient styling using the `.text-gradient` utility
- `glow?: boolean` - Add text glow effect (works well with gradient variant)
- `class?: string` - Additional CSS classes

**Note:** The `gradient` variant applies the `.text-gradient` utility class, creating a purple-to-soft-purple gradient effect. Combine with `glow` for enhanced visual impact on hero sections.

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

**Icon Examples:**
```svelte
<script>
  import { Pagination } from '@mrintel/villain-ui';
  import { ChevronLeftIcon, ChevronRightIcon } from 'your-icon-library';
  
  let currentPage = $state(1);
</script>

<!-- Pagination with custom prev/next icons -->
<Pagination 
  {currentPage} 
  totalPages={10}
  onPageChange={(page) => currentPage = page}
>
  {#snippet prevIcon()}
    <ChevronLeftIcon class="w-5 h-5" />
  {/snippet}
  {#snippet nextIcon()}
    <ChevronRightIcon class="w-5 h-5" />
  {/snippet}
</Pagination>

<!-- Icon-only pagination (no "Previous"/"Next" text) -->
<Pagination 
  {currentPage} 
  totalPages={10}
  showLabels={false}
  onPageChange={(page) => currentPage = page}
>
  {#snippet prevIcon()}
    <ChevronLeftIcon class="w-5 h-5" />
  {/snippet}
  {#snippet nextIcon()}
    <ChevronRightIcon class="w-5 h-5" />
  {/snippet}
</Pagination>
```

**Badge** - Status badge

```svelte
<script>
  import { Badge } from '@mrintel/villain-ui';
</script>

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="accent">Accent</Badge>

<!-- Feature variant - styled like a feature pill -->
<Badge variant="feature">New Feature</Badge>
<Badge variant="feature">Beta</Badge>

<!-- With icon -->
<Badge variant="accent">
  {#snippet icon()}
    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
  {/snippet}
  Verified
</Badge>
```

**Props:**
- `variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'feature'` - Badge style (default: 'default')
- `icon?: Snippet` - Optional icon content
- `class?: string` - Additional CSS classes

**Note:** The `feature` variant creates a pill-shaped badge with accent background and glow, similar to the `.feature-tag` utility class. Use it to highlight new features, beta badges, or promotional tags.

**Tag** - Removable tag

```svelte
<script>
  import { Tag } from '@mrintel/villain-ui';
</script>

<Tag onRemove={() => console.log('Removed')}>JavaScript</Tag>
<Tag>TypeScript</Tag>
```

**Icon Examples:**
```svelte
<!-- Tag with icon -->
<Tag variant="accent">
  {#snippet icon()}
    <StarIcon class="w-4 h-4" />
  {/snippet}
  Featured
</Tag>

<!-- Dismissible tag with icon -->
<Tag dismissible ondismiss={() => console.log('Removed')}>
  {#snippet icon()}
    <TagIcon class="w-4 h-4" />
  {/snippet}
  JavaScript
</Tag>

<!-- Multiple tags with different icons -->
<div class="flex gap-2">
  <Tag>
    {#snippet icon()}
      <CheckCircleIcon class="w-4 h-4" />
    {/snippet}
    Verified
  </Tag>
  <Tag variant="accent">
    {#snippet icon()}
      <FireIcon class="w-4 h-4" />
    {/snippet}
    Trending
  </Tag>
</div>
```

**List** - Styled list

```svelte
<script>
  import { List } from '@mrintel/villain-ui';
  
  const items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<List {items} variant="ordered" />
```

**Icon Example:**
```svelte
<script>
  import { List } from '@mrintel/villain-ui';
  import { CheckIcon, XIcon, ClockIcon } from 'your-icon-library';
  
  const items = [
    { 
      label: 'Task completed', 
      icon: () => `{@render CheckIcon({ class: 'w-5 h-5 text-success' })}` 
    },
    { 
      label: 'Task pending', 
      icon: () => `{@render ClockIcon({ class: 'w-5 h-5 text-warning' })}` 
    },
    { 
      label: 'Task failed', 
      icon: () => `{@render XIcon({ class: 'w-5 h-5 text-error' })}` 
    }
  ];
</script>

<List {items} variant="unordered" />

<!-- Or with custom rendering -->
<List variant="unordered">
  {#each items as item}
    <li class="flex items-center gap-3">
      {#if item.icon}
        <span class="inline-flex items-center justify-center">
          {@render item.icon()}
        </span>
      {/if}
      {item.label}
    </li>
  {/each}
</List>
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
- **Built-in copy button** with visual feedback
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
| `showCopy` | `boolean` | `true` | Whether to show the copy button |
| `code` | `string` | `undefined` | Raw code text for copying (if not provided, extracts from rendered content) |

**Important Notes:**
- Consumers are responsible for sanitizing HTML to prevent XSS attacks
- Apply `.line` class to each code line and `.highlighted` class to highlighted lines for consistent styling
- Line numbers are 1-indexed (first line is 1, not 0)
- When using `showLineNumbers`, provide the `lineCount` prop for proper rendering

**Basic Usage:**

```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';

  const code = `function hello() {
  console.log('Hello, world!');
}`;

  const highlightedCode = `<pre><code class="language-javascript">
<span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Hello, world!'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>`;
</script>

<!-- Copy button shown by default, uses raw code text -->
<CodeBlock {code}>
  {@html highlightedCode}
</CodeBlock>

<!-- Hide copy button if needed -->
<CodeBlock showCopy={false}>
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

### Global Styles

The library includes comprehensive global styles that provide the foundation for the luxury dark aesthetic. When you import `theme.css`, you get:

**Base HTML/Body Styling:**
- Dark background (`--color-base-0`: #0a0a0a - Onyx Black)
- Optimized font rendering with antialiasing
- Body text styling with Inter font family
- Proper box-sizing and reset for consistent rendering

**Typography System:**
- Automatic heading styles (h1-h6) with Inter font family
- Optimized font sizes, line heights, weights, and letter spacing
- Zero default margins/padding for precise control
- Monospace font (JetBrains Mono) for code elements

**Built-in Animations:**
The theme includes several keyframe animations ready to use:
- `fade-in` - Simple opacity fade
- `fade-out` - Opacity fade out
- `fade-up` - Fade in with upward movement
- `glow-pulse` - Pulsing accent glow effect
- `slide-in-left/right/top/bottom` - Directional slide animations

**Custom Utility Classes:**
- `.text-glow` - Apply accent text glow effect
- `.text-gradient` - Gradient text with purple-to-soft-purple gradient and transparent fill
- `.glass-panel` - Glass morphism with backdrop blur and borders
- `.accent-glow` - Accent color box-shadow glow
- `.hover-lift` - Lift element on hover with glow and shadow
- `.hover-lift-enhanced` - Enhanced lift on hover with accent border and glow (stronger effect)
- `.card-icon` - Centered icon container with accent color and 4xl sizing
- `.hero-section` - Centered hero section layout with padding (4rem top, 3rem bottom, 3rem margin-bottom). Used by the `Hero` component as its base layout.
- `.feature-tags` - Horizontal flexbox container for feature tags with center alignment and wrapping. Used by the `Hero` component for its features slot.
- `.feature-tag` - Pill-shaped feature badge with accent background, border glow, and hover effect
- `.metal-edge` - Specular metallic border highlights
- `.obsidian-surface` - Flat black surface with subtle gradient reflection
- `.sidebar-collapsed-icon` - Centered icon display for collapsed sidebar states
- `.sidebar-collapsed-letter` - Accent-colored circle with first letter for collapsed sidebar items without icons

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

The library uses calculated, precision border radii for the "villain" aesthetic:

```css
:root {
  --radius-sm: 3px;   /* Subtle taper */
  --radius-md: 6px;   /* Controlled precision */
  --radius-lg: 8px;   /* Engineered corners */
  --radius-xl: 10px;  /* Maximum rounding - still calculated */
  --radius-2xl: 14px; /* Reserved for large surfaces */
  --radius-pill: 999px; /* Intentional full-round (use sparingly) */
}
```

### Complete Variable Reference

#### Colors

**Base Colors (Modern Villain Luxury)**
- `--color-base-0`: #0a0a0a - Onyx Black (deepest background)
- `--color-base-1`: #121212 - Elevated surface
- `--color-base-2`: #1a1a1a - Panel layer
- `--color-base-3`: #242424 - Highest elevation
- `--color-surface`: Alias for base-1
- `--color-panel`: Alias for base-2
- `--color-overlay`: rgba(0, 0, 0, 0.75) - Modal backdrop

**Accent Colors (Royal Purple & Crimson)**
- `--color-accent`: #6b21a8 - Royal Purple (primary)
- `--color-accent-soft`: #8b5cf6 - Lighter purple variant
- `--color-accent-dark`: #581c87 - Darker purple variant
- `--color-secondary`: #3b82f6 - Electric Blue
- `--color-crimson`: #ef4444 - Crimson Red accent

**Text Colors**
- `--color-text`: #e0e0e0 - Primary text (refined gray)
- `--color-text-soft`: #a3a3a3 - Secondary text
- `--color-text-muted`: #737373 - Muted/disabled text

**State Colors (Bold & Commanding)**
- `--color-success`: #10b981 - Emerald green
- `--color-warning`: #f59e0b - Amber
- `--color-error`: #ef4444 - Crimson Red

**Border Colors (Neon Edges)**
- `--color-border`: rgba(255, 255, 255, 0.10) - Default border
- `--color-border-strong`: rgba(255, 255, 255, 0.20) - Emphasized border
- `--color-border-glow`: rgba(107, 33, 168, 0.30) - Purple glow edge

#### Typography

**Font Families (Modern Villain Luxury)**
- `--font-heading`: 'Inter', sans-serif - Unified typography for headings
- `--font-body`: 'Inter', sans-serif - Body text
- `--font-mono`: 'JetBrains Mono', monospace - Code and numeric display

**Heading Text Scales (h1-h6)**
- `--text-h1-size`: 3.5rem (56px)
- `--text-h1-line-height`: 1.2
- `--text-h1-weight`: 700
- `--text-h1-letter-spacing`: -0.02em

- `--text-h2-size`: 2.5rem (40px)
- `--text-h2-line-height`: 1.25
- `--text-h2-weight`: 600
- `--text-h2-letter-spacing`: -0.015em

- `--text-h3-size`: 2rem (32px)
- `--text-h3-line-height`: 1.3
- `--text-h3-weight`: 600
- `--text-h3-letter-spacing`: -0.01em

- `--text-h4-size`: 1.5rem (24px)
- `--text-h4-line-height`: 1.35
- `--text-h4-weight`: 600
- `--text-h4-letter-spacing`: -0.01em

- `--text-h5-size`: 1.25rem (20px)
- `--text-h5-line-height`: 1.4
- `--text-h5-weight`: 500
- `--text-h5-letter-spacing`: -0.005em

- `--text-h6-size`: 1rem (16px)
- `--text-h6-line-height`: 1.5
- `--text-h6-weight`: 500
- `--text-h6-letter-spacing`: 0

**Body Text Scales**
- `--text-body-size`: 1rem
- `--text-body-line-height`: 1.6
- `--text-body-weight`: 400
- `--text-body-letter-spacing`: 0.01em

- `--text-caption-size`: 0.875rem
- `--text-caption-line-height`: 1.5
- `--text-caption-weight`: 400
- `--text-caption-letter-spacing`: 0.015em

**Tailwind-Compatible Text Sizes**
- `--text-xs` through `--text-9xl` with corresponding line heights
- Example: `--text-2xl`: 1.5rem, `--text-2xl--line-height`: 2rem

#### Layout

**Border Radii (Rounded 2XL Corners)**
- `--radius-none`: 0px
- `--radius-sm`: 6px - Small rounded
- `--radius-md`: 10px - Medium rounded
- `--radius-lg`: 14px - Large rounded
- `--radius-xl`: 18px - Extra large
- `--radius-2xl`: 24px - **2XL signature rounded corners**
- `--radius-pill`: 999px - Full round

**Spacing**
- `--spacing`: 0.25rem - Base spacing unit
- `--spacing-4.5`: 1.125rem
- `--spacing-18`: 4.5rem

**Z-Index Scale**
- `--z-0` through `--z-50` (increments of 10)

#### Effects

**Shadows (Glow & Depth)**
- `--shadow-accent-glow`: Layered Royal Purple glow effect (20px/40px/60px)
- `--shadow-crimson-glow`: Crimson Red glow effect (20px/40px)
- `--shadow-deep`: 0 10px 40px rgba(0, 0, 0, 0.6)
- `--shadow-text-glow`: Text-specific Royal Purple glow (20px/40px)

**Glass Effect (Modern Blur)**
- `--glass-panel-background`: rgba(255, 255, 255, 0.05) - Subtle glass panel
- `--glass-panel-blur`: 12px - Modern blur effect

#### Motion

**Easing Curves**
- `--ease-luxe`: cubic-bezier(0.23, 1, 0.32, 1) - Smooth luxury motion
- `--ease-sharp`: cubic-bezier(0.4, 0.1, 0.2, 1) - Snappy transitions

**Duration Scale**
- `--duration-75` through `--duration-1000` (75ms, 100ms, 150ms, 200ms, 300ms, 500ms, 700ms, 1000ms)

**Opacity Scale**
- `--opacity-0` through `--opacity-100` in increments of 5-10

### Custom Utility Classes

The library provides custom utility classes you can use directly in your markup:

**Visual Effects:**
- `.text-glow` - Apply accent glow to text with shadow effect
- `.accent-glow` - Accent color glow box-shadow effect
- `.glass-panel` - Glass morphism with backdrop blur (14px), semi-transparent background, border, and deep shadow
- `.hover-lift` - Lift element 2px on hover with combined glow and shadow

**Surface Treatments:**
- `.metal-edge` - Specular metallic highlights on top and left borders
- `.obsidian-surface` - Flat black surface with subtle diagonal gradient reflection

Example usage:

```svelte
<div class="glass-panel accent-glow hover-lift">
  <h2 class="text-glow">Glowing Title</h2>
  <div class="obsidian-surface metal-edge">
    <p>Premium surface treatment</p>
  </div>
</div>
```

### Animation System

The theme includes pre-defined keyframe animations ready to use with Tailwind's `animate-*` utilities or custom CSS:

**Opacity Animations:**
- `fade-in` - Fade from 0 to full opacity
- `fade-out` - Fade from full to 0 opacity

**Combined Animations:**
- `fade-up` - Fade in while moving up 20px

**Glow Effects:**
- `glow-pulse` - Pulsing accent glow (40%-60% intensity cycle)

**Directional Slides:**
- `slide-in-left` - Slide in from left with fade
- `slide-in-right` - Slide in from right with fade
- `slide-in-top` - Slide in from top with fade
- `slide-in-bottom` - Slide in from bottom with fade

Example usage:

```css
.my-element {
  animation: fade-up 0.3s var(--ease-luxe);
}

.my-modal {
  animation: fade-in 0.2s var(--ease-sharp);
}

.my-button:hover {
  animation: glow-pulse 2s infinite;
}
```

### Theme Persistence

The brand structure (depth system, spacing, motion curves) persists even when colors change, maintaining the luxury aesthetic regardless of your chosen palette.

## 🏗️ Layout Best Practices

### Navbar + Sidebar Layout

When using both Navbar and Sidebar together, they automatically coordinate their positioning. The Sidebar detects the Navbar's presence and adjusts its top position to start just below it. Here's the recommended structure:

```svelte
<script>
  import { page } from '$app/stores';
  import { Navbar, Sidebar } from '@mrintel/villain-ui';
  
  let sidebarOpen = $state(true);
  $: currentPath = $page.url.pathname;
</script>

<!-- Navbar sits on top with z-50 and gets data-navbar attribute automatically -->
<Navbar position="sticky" height="md" currentPath={currentPath}>
  {#snippet logo()}
    <YourLogo />
  {/snippet}
  
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</Navbar>

<!-- Sidebar automatically detects Navbar and positions below it (z-40) -->
<Sidebar bind:open={sidebarOpen} side="left" width="md" currentPath={currentPath}>
  <nav>
    <a href="/dashboard">
      <DashboardIcon class="w-5 h-5" />
      <span>Dashboard</span>
    </a>
    <a href="/analytics">
      <ChartIcon class="w-5 h-5" />
      <span>Analytics</span>
    </a>
    <a href="/settings">
      <SettingsIcon class="w-5 h-5" />
      <span>Settings</span>
    </a>
  </nav>
</Sidebar>

<!-- Main content with appropriate margin/padding -->
<main class="ml-64 p-6">
  <!-- Adjust ml-64 based on sidebar width (sm: 56, md: 64, lg: 80) -->
  <!-- No margin-top needed - Sidebar handles its own positioning! -->
  <slot />
</main>
```

**Tips:**
- **Automatic positioning**: Sidebar detects Navbar via `data-navbar` attribute and adjusts its `top` position automatically. No manual `margin-top` needed on Sidebar.
- **Z-index layering**: Navbar (z-50) appears above Sidebar (z-40), which appears above regular content
- **Responsive behavior**: Sidebar's position updates automatically when Navbar height changes (window resize, responsive breakpoints)
- **Main content spacing**: Add `margin-left` to your main content based on sidebar width:
  - `width="sm"` (224px/56 Tailwind units): Use `ml-56`
  - `width="md"` (256px/64 Tailwind units): Use `ml-64` (default)
  - `width="lg"` (320px/80 Tailwind units): Use `ml-80`
  - Collapsed sidebar: Reduce margin to `ml-14`, `ml-16`, or `ml-20` respectively
- **Mobile responsive**: Use Tailwind responsive classes: `md:ml-64` to adjust layout on mobile
- **Collapsed sidebar**: Consider making sidebar collapsed by default on mobile: `let sidebarOpen = $state(window.innerWidth >= 768)`
- **Without Navbar**: When Navbar is not present, Sidebar automatically starts from the top (top: 0)
- **Active state**: Use the `currentPath` prop on both components for automatic active state management (see Active State Management section)

#### Layout Variations

**Navbar Only (No Sidebar):**
```svelte
<Navbar position="sticky" currentPath={currentPath}>
  <!-- Navigation links -->
</Navbar>

<main class="p-6">
  <!-- No margin-left needed -->
  <slot />
</main>
```

**Sidebar Only (No Navbar):**
```svelte
<Sidebar open={true} currentPath={currentPath}>
  <!-- Navigation links -->
</Sidebar>

<main class="ml-64 p-6">
  <!-- Sidebar starts from top automatically -->
  <slot />
</main>
```

**Both with Collapsible Sidebar:**
```svelte
<script>
  let sidebarOpen = $state(true);
  $: mainMargin = sidebarOpen ? 'ml-64' : 'ml-16'; // Adjust for collapsed width
</script>

<Navbar position="sticky" currentPath={currentPath}>
  <button onclick={() => sidebarOpen = !sidebarOpen}>
    <MenuIcon />
  </button>
  <!-- Other nav items -->
</Navbar>

<Sidebar bind:open={sidebarOpen} currentPath={currentPath}>
  <!-- Navigation links -->
</Sidebar>

<main class="{mainMargin} p-6 transition-all duration-300">
  <slot />
</main>
```

### Active State Management with currentPath Prop

Navbar and Sidebar components now support automatic active state management via the optional `currentPath` prop. When provided, the components automatically add the `active` class to child `<a>` and `<button>` elements whose `href` attribute matches the current path. This eliminates the need for manual class management while preserving support for manual `.active` class usage.

#### How It Works

- When `currentPath` is provided, components use a `$effect` to query child links and buttons
- Elements with `href` matching `currentPath` automatically receive the `active` class
- The effect tracks which elements it manages to avoid removing manually-added `active` classes
- Works with both `href` attributes and `data-href` attributes (for buttons)
- Reactive: updates automatically when `currentPath` changes
- SSR-safe: only runs client-side

#### With SvelteKit

```svelte
<script>
  import { page } from '$app/stores';
  import { Navbar, Sidebar } from '@mrintel/villain-ui';
  
  // Automatically reactive - updates when route changes
  $: currentPath = $page.url.pathname;
</script>

<!-- Navbar with automatic active state -->
<Navbar currentPath={currentPath}>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</Navbar>

<!-- Sidebar with automatic active state -->
<Sidebar currentPath={currentPath}>
  <a href="/dashboard">Dashboard</a>
  <a href="/settings">Settings</a>
  <a href="/profile">Profile</a>
</Sidebar>

<!-- No need to manually add class={currentPath === '/dashboard' ? 'active' : ''} -->
```

#### With SvelteKit (Advanced Matching)

```svelte
<script>
  import { page } from '$app/stores';
  import { Sidebar } from '@mrintel/villain-ui';
  
  // For nested routes, you might want to match path prefixes
  $: currentPath = $page.url.pathname;
  
  // Helper to check if a path is active (including sub-routes)
  function isActive(path: string) {
    return currentPath === path || currentPath.startsWith(path + '/');
  }
</script>

<Sidebar currentPath={currentPath}>
  <a href="/dashboard">Dashboard</a>
  <!-- For nested routes, use manual class for prefix matching -->
  <a href="/settings" class={isActive('/settings') ? 'active' : ''}>
    Settings
  </a>
</Sidebar>
```

#### With Manual State

```svelte
<script>
  import { Navbar } from '@mrintel/villain-ui';
  
  let currentPath = $state('/home');
  
  function navigate(path: string) {
    currentPath = path;
    // Your custom navigation logic
  }
</script>

<Navbar currentPath={currentPath}>
  <a href="/home" onclick={(e) => { e.preventDefault(); navigate('/home'); }}>Home</a>
  <a href="/about" onclick={(e) => { e.preventDefault(); navigate('/about'); }}>About</a>
  <a href="/contact" onclick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
</Navbar>
```

#### Hybrid Approach (Manual + Automatic)

```svelte
<script>
  import { page } from '$app/stores';
  import { Sidebar } from '@mrintel/villain-ui';
  
  $: currentPath = $page.url.pathname;
</script>

<Sidebar currentPath={currentPath}>
  <!-- These use automatic active state via currentPath -->
  <a href="/dashboard">Dashboard</a>
  <a href="/analytics">Analytics</a>
  
  <!-- This uses manual active class (takes precedence) -->
  <a href="/special" class="active">Special Page (Always Active)</a>
  
  <!-- Buttons work too with data-href -->
  <button data-href="/action" onclick={handleAction}>Action</button>
</Sidebar>
```

#### Best Practices

- Use `currentPath` prop for simple exact-match scenarios (most common)
- For nested routes or prefix matching, combine `currentPath` with manual classes
- Manual `.active` classes always take precedence over automatic management
- The `currentPath` prop is optional - components work perfectly without it
- For buttons, use `data-href` attribute to enable automatic active state
- Consider using `$page.url.pathname` in SvelteKit for automatic reactivity

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
