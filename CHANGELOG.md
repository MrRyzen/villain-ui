# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`danger` button variant** on `Button`, `LinkButton`, and `IconButton` — error-colored fill
  with a red glow for destructive actions (cancel membership, delete). Also exports the
  `ButtonVariant` type from `buttonClasses`.
- **`ToastHost` + `toast()` store** (`overlays/toast.store.ts`): mount one `<ToastHost />` in the
  root layout, then call `toast('Saved')` / `toast.success(...)` / `toast.error(...)` from
  anywhere. Exposes `toasts` atom and `dismissToast(id)`; `maxVisible` prop queues overflow.
  Built on the existing `Toast` component (stacking via its `index` prop).
- **`EmptyState`** (data): centered icon/title/message/action block with `sm|md|lg` sizes, for
  empty lists, empty search results, and error placeholders.
- **`Stat` count-up**: `countUp` prop animates numeric values from 0 with easeOutCubic
  (`countUpDuration`, `format` for e.g. `toLocaleString`). Respects `prefers-reduced-motion`;
  re-animates from the current displayed value when `value` changes.
- **`Input` password reveal**: `revealable` prop on `type="password"` renders an eye toggle
  (replaces `iconAfter` while active) with proper `aria-label`/`aria-pressed`.
- **`Input` number bounds**: `min`, `max`, `step` props — stepper arrows clamp to bounds and the
  attributes are forwarded to the native input.
- **`WeekHeatmap`** (data): 7-day × 24-hour traffic heatmap consolidating the hand-rolled grid.
  `matrix` (row 0 = Sunday) with `color-mix` intensity fill; opt-in `rowOrder` (Monday-first),
  `hourLabel`/`hourLabelEvery`, `normalize`, `highlight` outline, `markNow` ring, `selected`, and
  `onCellSelect` (cells become buttons, consumer owns the readout). Reduced-motion aware; exports
  the `WeekHeatmapCell` type.
- **Wizard per-step validators**: `validator` / `validateOnNext` on `StepDefinition`. The
  controller assigns a step's validator to `superForm.options.validators` on entry and validates
  the step being left in `next()`, so no consumer `$effect` schema-swapping is needed.
- **Wizard per-step errors**: `stepErrors` store plus `setStepError(id, error)` /
  `clearStepError(id)` on the controller. Superforms field errors auto-map to steps via `data`;
  `StepForm` gains an `error` snippet, a `showErrors` prop, and an `errors` field on the step
  panel context, rendering a default `role="alert"` block.

### Changed

- **`class` passthrough + rest props on `Text` and `Heading`.** Layout/spacing utilities
  (`mt-4`, `truncate`, `flex-1`, …) now compose. Note: typographic properties (color, size,
  family) are still applied via inline `style` from the theme tokens, so they intentionally win
  over classes — use the `color`/`variant` props for those.
- Synced the exported `version` const with package.json (was stale at `0.7.1`).

### Deprecated

- **`StepValidator`** interface: use `validator` / `validateOnNext` on `StepDefinition` instead;
  the controller now wires per-step validators automatically.

## [0.2.0] - 2025-12-01

### Breaking Changes

#### CodeBlock Component Refactor

The `CodeBlock` component has been refactored from an integrated Shiki-based implementation to a presentational pattern. This is a **breaking change** that requires consumers to update their implementation.

**What Changed:**
- Consumers now provide pre-highlighted HTML via the default slot instead of passing raw code
- The component is now purely presentational, handling layout and styling only
- Syntax highlighting responsibility has moved to the consumer

**Removed Props:**
- `code` - No longer accepts raw code strings
- `language` - Language selection now handled by consumer's highlighter
- `theme` - Theme selection now handled by consumer's highlighter

**New Props:**
- `filename` (optional) - Display a filename in the header
- `showLineNumbers` (boolean) - Show line numbers in the gutter
- `lineCount` (number) - Total number of lines (required when `showLineNumbers` is true)
- `highlightLines` (number[]) - Array of 1-indexed line numbers to highlight
- `children` (Snippet) - Default slot for pre-highlighted HTML content

**Migration Guide:**

Before (v0.1.0):
```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  
  const code = `function hello() {
    console.log('Hello, world!');
  }`;
</script>

<CodeBlock {code} language="javascript" showLineNumbers />
```

After (v0.2.0):
```svelte
<script>
  import { CodeBlock } from '@mrintel/villain-ui';
  import { codeToHtml } from 'shiki';
  import { onMount } from 'svelte';
  
  const code = `function hello() {
    console.log('Hello, world!');
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

<CodeBlock showLineNumbers {lineCount}>
  {@html highlightedCode}
</CodeBlock>
```

**Important Notes:**
- Consumers are responsible for sanitizing HTML to prevent XSS attacks
- The component provides `.line` and `.highlighted` CSS classes for consistent styling
- Line numbers are 1-indexed (first line is 1, not 0)
- Development-only validation warns when `showLineNumbers` is true but `lineCount <= 0`

#### Peer Dependencies Simplified

- **Removed** `tailwindcss: ^4.1.17` from peer dependencies
- Only `svelte: ^5.0.0` is now required as a peer dependency
- Tailwind CSS is still used internally by the library but is no longer required from consumers

### Added

- **MIT License** - Added LICENSE file to the project
- **Enhanced TypeScript Configuration** - Added explicit Svelte types with `"types": ["svelte"]` in tsconfig.json
- **Improved Build Configuration** - Enhanced vite-plugin-dts with better type generation options:
  - `insertTypesEntry: true` for proper type entry points
  - `rollupTypes: true` for bundled type declarations
- **Development Validation** - Added dev-only warning for CodeBlock when `showLineNumbers` is enabled without valid `lineCount`

### Changed

- **Build Configuration** - Disabled sourcemaps in production builds (`sourcemap: false` in vite.config.ts)
- **Package Formatting** - Cleaned up package.json formatting (removed extra blank lines between sections)
- **Component Architecture** - CodeBlock transformed to presentational component pattern for better flexibility and reduced bundle size

### Removed

- **Shiki Dependency** - Removed `shiki: ^3.17.0` from devDependencies
- **Shiki Integration** - Removed all Shiki-related imports, logic, and transitive dependencies from the library
- **Bundle Weight** - Significantly reduced library bundle size by removing Shiki and its dependencies

### Documentation

- **Comprehensive CodeBlock Documentation** - Added extensive documentation to README.md including:
  - Component description and key features
  - Complete props table with types and descriptions
  - Security notes regarding XSS prevention
  - 7 complete usage examples:
    - Basic usage with pre-highlighted HTML
    - With line numbers
    - With highlighted lines
    - With filename header
    - Integration with Shiki (external)
    - Integration with Prism.js
    - Integration with Highlight.js
  - Important notes on line indexing, lineCount requirements, and CSS classes
  - Migration examples from the old API

## [0.1.0] - 2025-11-30

### Added

- Initial release of @mrintel/villain-ui
- Luxury Svelte 5 component library with dark aesthetic
- 50+ components across 8 categories:
  - Buttons (Button, IconButton, ButtonGroup, LinkButton, FloatingActionButton)
  - Forms (Input, Textarea, Select, Checkbox, Switch, RadioGroup, RangeSlider, FileUpload, InputGroup)
  - Layout (Card, Panel, Grid, Container, SectionHeader, Divider)
  - Navigation (Navbar, Sidebar, Tabs, Breadcrumbs, Menu, DropdownMenu, ContextMenu)
  - Overlays (Modal, Alert, Spinner, Tooltip, ProgressBar, SkeletonLoader, Toast, Drawer, Popover, Dropdown, CommandPalette)
  - Typography (Heading, Text, Code)
  - Data Display (Table, Pagination, Badge, Tag, List, Avatar, CodeBlock, Stat)
  - Utilities (Portal, Collapse, Accordion, Carousel, ScrollArea)
- Built with TypeScript in strict mode
- Tailwind CSS v4 for styling with CSS variable theming
- Glass morphism effects and luxury aesthetic
- Tree-shakeable ES module exports
- Complete TypeScript type definitions
- Comprehensive documentation in README.md
