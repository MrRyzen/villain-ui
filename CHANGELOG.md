# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
