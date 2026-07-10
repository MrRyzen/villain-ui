# Villain UI — Component API

> Auto-generated from component `Props` interfaces (`npm run docs:api` regenerates).
> All components also accept standard HTML attributes via rest props unless noted.
> `Snippet` = `import('svelte').Snippet` — pass with `{#snippet name()}...{/snippet}`.

## Install & Theme

```ts
import { Button, Card, Modal /* ... */ } from '@mrintel/villain-ui';
import '@mrintel/villain-ui/theme.css';
```

Fonts (consumer-loaded): Archivo 400–900, IBM Plex Mono 400–600. Optional display themes via `data-display="bodoni" | "oswald"` on an ancestor element.

Rebrand the accent by overriding `--color-accent`, `--color-accent-soft`, `--color-accent-dark` after the theme import.

## Components

- **Buttons**: [Button](#button), [IconButton](#iconbutton), [ButtonGroup](#buttongroup), [LinkButton](#linkbutton), [FloatingActionButton](#floatingactionbutton)
- **Cards & Layout**: [Card](#card), [Panel](#panel), [Grid](#grid), [Container](#container), [SectionHeader](#sectionheader), [Divider](#divider)
- **Forms**: [Input](#input), [Textarea](#textarea), [Select](#select), [Checkbox](#checkbox), [Switch](#switch), [RadioGroup](#radiogroup), [RangeSlider](#rangeslider), [FileUpload](#fileupload), [InputGroup](#inputgroup), [DatePicker](#datepicker), [TimePicker](#timepicker), [DateTimePicker](#datetimepicker), [SelectMenu](#selectmenu), [FormSection](#formsection)
- **Navigation**: [Navbar](#navbar), [Sidebar](#sidebar), [Tabs](#tabs), [Breadcrumbs](#breadcrumbs), [Menu](#menu), [DropdownMenu](#dropdownmenu), [ContextMenu](#contextmenu)
- **Overlays & Feedback**: [Modal](#modal), [Alert](#alert), [Spinner](#spinner), [Tooltip](#tooltip), [ProgressBar](#progressbar), [SkeletonLoader](#skeletonloader), [Toast](#toast), [ToastHost](#toasthost), [Drawer](#drawer), [Popover](#popover), [Dropdown](#dropdown), [CommandPalette](#commandpalette)
- **Typography**: [Heading](#heading), [Text](#text), [Code](#code)
- **Data Display**: [Table](#table), [Pagination](#pagination), [Badge](#badge), [Tag](#tag), [List](#list), [Avatar](#avatar), [CodeBlock](#codeblock), [Stat](#stat), [CalendarGrid](#calendargrid), [Sparkline](#sparkline), [EmptyState](#emptystate), [WeekHeatmap](#weekheatmap)
- **Utilities**: [Portal](#portal), [Collapse](#collapse), [Accordion](#accordion), [Carousel](#carousel), [ScrollArea](#scrollarea), [Hero](#hero), [SystemConsole](#systemconsole), [SystemInterface](#systeminterface)
- **Wizard**: [StepForm](#stepform), [StepRail](#steprail)

---

## Buttons

### Button

```ts
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onclick?: (event: MouseEvent) => void;
  iconBefore?: import('svelte').Snippet;
  iconAfter?: import('svelte').Snippet;
  children?: import('svelte').Snippet;
  class?: string;
}
```

### IconButton

```ts
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel: string;
  onclick?: (event: MouseEvent) => void;
  children?: import('svelte').Snippet;
  class?: string;
}
```

### ButtonGroup

```ts
interface Props {
  orientation?: 'horizontal' | 'vertical';
  spacing?: boolean;
  children?: import('svelte').Snippet;
}
```

### LinkButton

```ts
interface Props {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  children?: import('svelte').Snippet;
  iconBefore?: import('svelte').Snippet;
  iconAfter?: import('svelte').Snippet;
  class?: string;
}
```

### FloatingActionButton

```ts
interface Props {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'md' | 'lg';
  disabled?: boolean;
  ariaLabel: string;
  onclick?: (event: MouseEvent) => void;
  children?: import('svelte').Snippet;
  class?: string;
}
```

## Cards & Layout

### Card

```ts
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Pattern variant:
   * - default: raised content card
   * - command: card with an integrated command bar (eyebrow + actions strip)
   * - metric: recessed instrument surface for numbers/readouts
   */
  variant?: 'default' | 'command' | 'metric';
  /** Mono uppercase system label. In command variant it lives in the command bar. */
  eyebrow?: string;
  /** Actions rendered in the command bar (command variant) or top-right of content. */
  actions?: Snippet;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onclick?: (event: MouseEvent) => void;
  selected?: boolean;
  disabled?: boolean;
  class?: string;
  children?: Snippet;
  header?: Snippet;
  footer?: Snippet;
  iconBefore?: Snippet;
}
```

### Panel

```ts
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  variant?: 'default' | 'glass'; // Primary styling selector. Use variant='glass' for enhanced glass morphism.
  /** Mono uppercase title rendered in an integrated command bar. */
  title?: string;
  /** System status shown in the command bar (with a colored indicator). */
  status?: string;
  statusVariant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Actions rendered on the right side of the command bar. */
  actions?: Snippet;
  class?: string;
  children?: Snippet;
}
```

### Grid

```ts
interface Props {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  children?: Snippet;
}
```

### Container

```ts
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  padding?: boolean;
  children?: Snippet;
}
```

### SectionHeader

```ts
interface Props {
  variant?: 'default' | 'accent' | 'gradient';
  title?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  glow?: boolean;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  children?: Snippet;
}
```

### Divider

```ts
interface Props {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  thickness?: 'thin' | 'normal' | 'thick';
  variant?: 'default' | 'strong';
  height?: string; // Custom height for vertical dividers (e.g., '100px', '2rem')
  class?: string;
}
```

## Forms

### Input

```ts
interface Props {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'color' | 'search';
  name?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  oninput?: (event: Event) => void;
  iconBefore?: import('svelte').Snippet;
  iconAfter?: import('svelte').Snippet;
  validate?: (value: string | number) => boolean | string;
  validationMessage?: string;
  showValidation?: boolean;
  /** Password inputs only: show an eye toggle to reveal the value. Replaces iconAfter. */
  revealable?: boolean;
  /** Number inputs only: lower bound enforced by the stepper arrows. */
  min?: number;
  /** Number inputs only: upper bound enforced by the stepper arrows. */
  max?: number;
  /** Number inputs only: stepper arrow increment. @default 1 */
  step?: number;
  class?: string;
}
```

### Textarea

```ts
interface Props {
  value?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: HTMLTextAreaElement['autocomplete'];
  oninput?: (event: Event) => void;
  iconBefore?: import('svelte').Snippet;
  validationMessage?: string;
  class?: string;
}
```

### Select

```ts
interface Props {
  value?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: HTMLSelectElement['autocomplete'];
  onchange?: (event: Event) => void;
  iconBefore?: import('svelte').Snippet;
  validationMessage?: string;
  class?: string;
}
```

### Checkbox

```ts
interface Props {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  onchange?: (event: Event) => void;
  iconBefore?: import('svelte').Snippet;
  validationMessage?: string;
  class?: string;
}
```

### Switch

```ts
interface Props {
  checked?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  onchange?: (event: Event) => void;
  iconBefore?: import('svelte').Snippet;
  validationMessage?: string;
  class?: string;
}
```

### RadioGroup

```ts
interface Props {
  value?: string;
  options: Array<{ value: string; label: string; iconBefore?: import('svelte').Snippet }>;
  name: string;
  disabled?: boolean;
  error?: boolean;
  orientation?: 'vertical' | 'horizontal';
  label?: string;
  onchange?: (event: Event) => void;
  validationMessage?: string;
  class?: string;
}
```

### RangeSlider

```ts
interface Props {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  showValue?: boolean;
  id?: string;
  name?: string;
  oninput?: (event: Event) => void;
  validationMessage?: string;
}
```

### FileUpload

```ts
interface Props {
  files?: FileList | null;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  onchange?: (event: { target: { files: FileList } }) => void;
  icon?: import('svelte').Snippet;
  validationMessage?: string;
}
```

### InputGroup

_No props — content via default slot/children._

### DatePicker

```ts
interface Props {
  variant?: 'glass' | 'floating';
  value?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  onchange?: (event: Event) => void;
  validationMessage?: string;
  class?: string;
}
```

### TimePicker

```ts
interface Props {
  variant?: 'glass' | 'floating';
  value?: string;
  min?: string;
  max?: string;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  is24Hour?: boolean;
  onchange?: (event: Event) => void;
  validationMessage?: string;
  class?: string;
}
```

### DateTimePicker

```ts
interface Props {
  variant?: 'glass' | 'floating';
  value?: string; // ISO datetime-local format: YYYY-MM-DDTHH:mm
  min?: string;
  max?: string;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  autocomplete?: HTMLInputElement['autocomplete'];
  is24Hour?: boolean;
  onchange?: (event: Event) => void;
  validationMessage?: string;
  class?: string;
}
```

### SelectMenu

```ts
interface Props {
  value?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  id?: string;
  name?: string;
  iconBefore?: import('svelte').Snippet;
  onchange?: (value: string) => void;
  validationMessage?: string;
  class?: string;
}
```

### FormSection

```ts
interface Props {
  /** Mono uppercase section label (e.g. "01 / IDENTITY"). */
  legend?: string;
  /** Supporting copy under the legend. */
  description?: string;
  /** Field layout: single column (default) or two columns on md+. */
  columns?: 1 | 2;
  class?: string;
  children?: Snippet;
}
```

## Navigation

### Navbar

```ts
interface Props {
  position?: 'sticky' | 'fixed';
  height?: 'sm' | 'md' | 'lg';
  navigationAlign?: 'left' | 'center';
  toggleButton?: Snippet;
  logo?: Snippet;
  navigation?: Snippet;
  actions?: Snippet;
  children?: Snippet;
  currentPath?: string;
}
```

### Sidebar

```ts
interface Props {
  open?: boolean;
  side?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
  header?: Snippet;
  children?: Snippet;
  currentPath?: string;
}
```

### Tabs

```ts
interface Props {
  tabs: Tab[];
  activeTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills';
  onTabChange?: (tabId: string) => void;
  /** @deprecated Use onTabChange */
  ontabchange?: (tabId: string) => void;
  class?: string;
}
```

### Breadcrumbs

```ts
interface Props {
  items: BreadcrumbItem[];
  separator?: string;
  separatorIcon?: Snippet;
}
```

### Menu

```ts
interface Props {
  items?: MenuItem[];
  children?: Snippet;
}
```

### DropdownMenu

```ts
interface Props {
  items: MenuItem[];
  open?: boolean;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  trigger?: Snippet;
}
```

### ContextMenu

```ts
interface Props {
  items: MenuItem[];
  open?: boolean;
  x?: number;
  y?: number;
  trigger?: Snippet;
}
```

## Overlays & Feedback

### Modal

```ts
interface Props {
  open?: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children?: Snippet;
  footer?: Snippet;
  iconBefore?: Snippet;
  class?: string;
}
```

### Alert

```ts
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  iconBefore?: Snippet;
  onClose?: () => void;
  /** @deprecated Use onClose */
  onclose?: () => void;
  children?: Snippet;
  class?: string;
}
```

### Spinner

```ts
interface Props {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

### Tooltip

```ts
interface Props {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  trigger?: Snippet;
  children?: Snippet;
  class?: string;
}
```

### ProgressBar

```ts
interface Props {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}
```

### SkeletonLoader

```ts
interface Props {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}
```

### Toast

```ts
interface Props {
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
  onClose?: () => void;
  /** @deprecated Use onClose */
  onclose?: () => void;
  /** Index in toast stack for vertical offset. Pass the toast's position in a list to enable stacking. */
  index?: number;
  icon?: import('svelte').Snippet;
}
```

### ToastHost

```ts
interface Props {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Newest toasts beyond this count are queued until older ones dismiss. */
  maxVisible?: number;
}
```

### Drawer

```ts
interface Props {
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children?: Snippet;
  footer?: Snippet;
  iconBefore?: Snippet;
  class?: string;
}
```

### Popover

```ts
interface Props {
  open?: boolean;
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right';
  closeOnClickOutside?: boolean;
  trigger?: Snippet;
  children?: Snippet;
}
```

### Dropdown

```ts
interface Props {
  open?: boolean;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  closeOnClickOutside?: boolean;
  fullWidth?: boolean;
  trigger?: Snippet;
  children?: Snippet;
}
```

### CommandPalette

```ts
interface Props {
  open?: boolean;
  commands: Command[];
  placeholder?: string;
}
```

## Typography

### Heading

```ts
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  glow?: boolean;
  variant?: 'default' | 'accent' | 'gradient';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: import('svelte').Snippet;
  class?: string;
}
```

### Text

```ts
interface Props {
  variant?: 'body' | 'caption';
  color?: 'default' | 'soft' | 'muted' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'bold' | 'semibold';
  as?: 'p' | 'span' | 'div';
  children?: import('svelte').Snippet;
  class?: string;
}
```

### Code

```ts
interface Props {
  children?: import('svelte').Snippet;
}
```

## Data Display

### Table

```ts
interface Props {
  // Dynamic data mode
  columns?: Column[];
  data?: Record<string, any>[];
  // Visual options
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  // State management
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  emptyState?: Snippet;
  // User-defined filter/search function
  filterFn?: (row: Record<string, any>) => boolean;
  // Callbacks for user-implemented features
  onSort?: (columnKey: string, direction: SortDirection) => void;
  onRowClick?: (row: Record<string, any>) => void;
  // Multi-select
  selectable?: boolean;
  selectedKeys?: Set<RowKey>;
  rowKey?: string;
  onSelectionChange?: (selectedKeys: Set<RowKey>, rows: Record<string, any>[]) => void;
  // Manual markup mode
  children?: Snippet;
  // Column-specific snippets for hybrid mode
  [key: `cell_${string}`]: Snippet<[{ value: any; row: any }]> | undefined;
  // Rest props
  class?: string;
}
```

### Pagination

```ts
interface Props {
  currentPage: number;
  totalPages: number;
  maxVisible?: number;
  onPageChange?: (page: number) => void;
  /** @deprecated Use onPageChange */
  onpagechange?: (page: number) => void;
  prevIcon?: import('svelte').Snippet;
  nextIcon?: import('svelte').Snippet;
  showLabels?: boolean;
}
```

### Badge

```ts
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'feature';
  size?: 'sm' | 'md';
  icon?: import('svelte').Snippet;
  children?: import('svelte').Snippet;
  hover?: boolean;
  glow?: boolean;
  statusDot?: boolean; // Shows a glowing status indicator dot
  uppercase?: boolean; // Makes text uppercase with letter spacing
  class?: string;
}
```

### Tag

```ts
interface Props {
  variant?: 'default' | 'accent' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  /** @deprecated Use onDismiss */
  ondismiss?: () => void;
  children?: import('svelte').Snippet;
  icon?: import('svelte').Snippet;
}
```

### List

```ts
interface Props {
  variant?: 'plain' | 'bordered' | 'divided';
  hoverable?: boolean;
  items?: ListItem[];
  children?: import('svelte').Snippet;
}
```

### Avatar

```ts
interface Props {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  glow?: boolean;
}
```

### CodeBlock

```ts
interface Props {
  /**
   * Optional filename to display in the header.
   */
  filename?: string;
  /**
   * Whether to show line numbers in the gutter.
   */
  showLineNumbers?: boolean;
  /**
   * Total number of lines in the code. Required when showLineNumbers is true.
   */
  lineCount?: number;
  /**
   * Array of line numbers (1-indexed) to highlight in the gutter.
   */
  highlightLines?: number[];
  /**
   * Whether to show the copy button. Default: true.
   */
  showCopy?: boolean;
  /**
   * Raw code text for copying. If not provided, copy functionality attempts to extract text from the rendered content.
   */
  code?: string;
  /**
   * Slot for pre-highlighted code HTML.
   */
  children?: import('svelte').Snippet;
}
```

### Stat

```ts
interface Props {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: import('svelte').Snippet;
  description?: string;
  /**
   * Animate numeric values counting up from 0 on mount (easeOutCubic).
   * Ignored for string values; disabled under prefers-reduced-motion.
   */
  countUp?: boolean;
  /** Count-up duration in ms. @default 800 */
  countUpDuration?: number;
  /** Formatter for the displayed number while counting (e.g. toLocaleString). */
  format?: (value: number) => string;
}
```

### CalendarGrid

```ts
interface Props {
  month?: Date;
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (date: Date) => void;
  renderCell?: Snippet<[CellData]>;
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  showWeekNumbers?: boolean;
  highlightToday?: boolean;
  /** Clamp the year selector (e.g. from a DatePicker's min/max). */
  minDate?: Date;
  maxDate?: Date;
  class?: string;
}
```

### Sparkline

```ts
interface Props {
  /**
   * Array of numeric data points to plot
   */
  data: number[];

  /**
   * Line color (defaults to accent primary)
   */
  color?: string;

  /**
   * Chart height in pixels
   * @default 40
   */
  height?: number;

  /**
   * Chart width in pixels
   * @default 200
   */
  width?: number;

  /**
   * Show dots at each data point
   * @default false
   */
  showDots?: boolean;

  /**
   * Show gradient fill below the line
   * @default false
   */
  showFill?: boolean;

  /**
   * Line thickness in pixels
   * @default 2
   */
  strokeWidth?: number;

  /**
   * Animation duration in milliseconds (set to 0 to disable)
   * @default 500
   */
  animationDuration?: number;
}
```

### EmptyState

```ts
interface Props {
  title?: string;
  message?: string;
  /** Icon or illustration shown above the title. */
  icon?: import('svelte').Snippet;
  /** Call-to-action area (typically a Button or LinkButton). */
  action?: import('svelte').Snippet;
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}
```

### WeekHeatmap

```ts
interface Props {
  /** 7 rows × 24 cols. Row index 0 = Sunday. */
  matrix: number[][];
  /**
   * Display order of matrix row indices. Default Sunday-first [0..6].
   * Monday-first = [1, 2, 3, 4, 5, 6, 0].
   */
  rowOrder?: number[];
  /** Labels aligned to rowOrder. Default ['Sun','Mon',...] reordered by rowOrder. */
  dayLabels?: string[];
  /** Hour column label formatter. Default String(hour). E.g. h => '12a'/'6a'/'12p'/'6p'. */
  hourLabel?: (hour: number) => string;
  /**
   * Show a label only every N hour columns (others render empty) to reduce axis noise.
   * Default 1 (label every hour).
   */
  hourLabelEvery?: number;
  /**
   * true (default): scale intensity to max(matrix) — raw-count matrices.
   * false: values are already 0–100 — percentage matrices.
   */
  normalize?: boolean;
  /** Outline overlay predicate (e.g. member's frequent cells). */
  highlight?: (day: number, hour: number) => boolean;
  /** Ring the current weekday+hour cell. Default false. */
  markNow?: boolean;
  /** Tooltip/aria text per cell. Default: `${dayLabel} ${hourLabel} — ${value}`. */
  cellLabel?: (cell: WeekHeatmapCell) => string;
  /**
   * When provided, cells render as <button> and clicking/tapping calls this —
   * the consumer renders its own readout. When absent, cells are inert divs
   * and the grid gets role="img".
   */
  onCellSelect?: (cell: WeekHeatmapCell) => void;
  /** Currently selected cell, ring-highlighted. Consumer-managed (pairs with onCellSelect). */
  selected?: { day: number; hour: number } | null;
  /** Accessible name for the grid. Default "Weekly traffic heatmap". */
  ariaLabel?: string;
  class?: string;
}
```

## Utilities

### Portal

```ts
interface Props {
  target?: HTMLElement | string;
  children?: Snippet;
}
```

### Collapse

```ts
interface Props {
  open: boolean;
  title: string;
  children?: Snippet;
  onToggle?: () => void;
}
```

### Accordion

```ts
interface Props {
  items: AccordionItem[];
  openItems?: string | string[];
  mode?: 'single' | 'multiple';
  onToggle?: (itemId: string, isOpen: boolean) => void;
  /** @deprecated Use onToggle */
  ontoggle?: (itemId: string, isOpen: boolean) => void;
}
```

### Carousel

```ts
interface Props {
  items: CarouselItem[];
  currentIndex?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}
```

### ScrollArea

```ts
interface Props {
  height?: string;
  scrollPercent?: number;
  children?: Snippet;
}
```

### Hero

```ts
interface Props {
  title?: import('svelte').Snippet;
  text?: import('svelte').Snippet;
  features?: import('svelte').Snippet;
  children?: import('svelte').Snippet;
  class?: string;
}
```

### SystemConsole

```ts
interface Props {
  messages: ConsoleMessage[];
  prompt?: string; // System prompt prefix (e.g., '>', 'SYSTEM:', 'λ')
  placeholder?: string;
  height?: string;
  maxHeight?: string;
  showTimestamps?: boolean;
  autoScroll?: boolean;
  typewriterEffect?: boolean; // Animate system messages
  typewriterSpeed?: number; // Characters per second
  showScanlines?: boolean;
  glowEffect?: boolean;
  onSubmit?: (input: string) => void;
  disabled?: boolean;
  class?: string;
}
```

### SystemInterface

```ts
interface Props {
  messages: SystemMessage[];
  onSubmit?: (input: string) => void;
  processing?: boolean;
  placeholder?: string;
  height?: string;
  autoScroll?: boolean;
  stagingDelay?: number;

  // Slots for persistent areas
  leftPanel?: Snippet;
  rightPanel?: Snippet;
  topPanel?: Snippet;
  bottomPanel?: Snippet;

  class?: string;
}
```

## Wizard

### StepForm

```ts
interface Props {
  /** Step definitions */
  steps: StepDefinition<TId>[];
  /** Optional external controller - if not provided, one is created internally */
  controller?: StepController<TId>;
  /** Layout orientation */
  orientation?: StepOrientation;
  /** Initial step ID */
  initialStepId?: TId;
  /** Controller options (only used when creating internal controller) */
  controllerOptions?: Partial<StepControllerOptions<TId>>;
  /** Superforms enhance action - pass the enhance function from superForm() */
  enhance?: Action<HTMLFormElement>;
  /** Form method attribute */
  method?: 'GET' | 'POST' | 'get' | 'post';
  /** Form action attribute */
  action?: string;
  /** Custom rail snippet */
  rail?: Snippet<[StepRailSnippetContext<TId>]>;
  /** Step content snippet */
  step?: Snippet<[StepPanelSnippetContext<TId>]>;
  /** Actions snippet */
  actions?: Snippet<[StepActionsSnippetContext<TId>]>;
  /** Custom error rendering between step content and actions. */
  error?: Snippet<[{ step: StepRuntime<TId>; errors: string[] }]>;
  /** Render the default error block when no `error` snippet given. Default true. */
  showErrors?: boolean;
  /** Additional CSS classes */
  class?: string;
}
```

### StepRail

```ts
interface Props {
  /** Array of steps with runtime state */
  steps: readonly StepRuntime<TId>[];
  /** Current step index or step object */
  current: number | StepRuntime<TId>;
  /** Layout orientation */
  orientation?: StepOrientation;
  /** Callback when a step is selected */
  onSelect?: (id: TId) => void;
  /** Show step numbers in nodes */
  showNumbers?: boolean;
  /** Show step labels below/beside nodes */
  showLabels?: boolean;
  /** Node size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  class?: string;
}
```

---

## Programmatic APIs

### toast

Imperative toast API. Requires a single `<ToastHost />` mounted in the app's root layout. Returns the toast id (usable with `dismissToast`).

```ts
type ToastVariant = 'info' | 'success' | 'warning' | 'error';

interface ToastOptions {
  variant?: ToastVariant;
  /** Auto-dismiss delay in ms. 0 disables auto-dismiss. Default 3000. */
  duration?: number;
  dismissible?: boolean;
}

toast(message: string, options?: ToastOptions): string;
toast.info(message, options?);     // variant shortcuts
toast.success(message, options?);
toast.warning(message, options?);
toast.error(message, options?);

dismissToast(id: string): void;
toasts; // nanostores atom<ToastItem[]> - active toasts, oldest first
```

```ts
toast('Saved');
toast.success('Added to cart');
toast.error('Could not save', { duration: 0 });
```

### createStepController

Headless wizard state controller (nanostores). Owns step state, transitions, guards, and validation. Pair with `StepForm` + `StepRail`.

```ts
function createStepController<TId extends string>(
  options: StepControllerOptions<TId>
): StepController<TId>;
```

Key `StepControllerOptions` fields: `steps: StepDefinition<TId>[]`, `initialStepId?`, `navigation?: StepNavigationRules` (`allowBackNavigation`, etc.), and callbacks `onBeforeStepChange`, `onStepChange`, `onStepComplete`, `onError`. The returned controller exposes reactive stores plus `next()`, `prev()`, `goTo(id)`, `complete()`.

## Exported Types

```ts
// Toast
ToastItem, ToastOptions, ToastVariant

// Data
TableColumn, SortDirection, RowKey, SelectionState,
CalendarEvent, ListItem, WeekHeatmapCell

// Utilities
ConsoleMessage, SystemMessage, MessageContentType

// Wizard
StepState, StepOrientation, StepDefinition, StepRuntime,
StepNavigationRules, StepChangeContext, StepGuard, StepCallbacks,
StepValidator, StepControllerOptions, StepController,
StepRailSnippetContext, StepPanelSnippetContext,
StepActionsSnippetContext, SuperFormLike

// Component prop types (ComponentProps<T> aliases)
ButtonProps, IconButtonProps, FloatingActionButtonProps, LinkButtonProps,
InputProps, TextareaProps, SelectProps, SelectMenuProps, CheckboxProps,
SwitchProps, RadioGroupProps, DatePickerProps, TimePickerProps,
DateTimePickerProps, CardProps, TabsProps, ModalProps, DrawerProps,
AlertProps, TooltipProps, AccordionProps, SparklineProps,
WeekHeatmapProps, StepFormProps, StepRailProps
```

## Theme Utility Classes

Class-based building blocks from `theme.css`:

| Class | Purpose |
|---|---|
| `.panel-base` | Flat editorial surface (subtle border) |
| `.panel-raised` | Machined raised panel (specular top edge + short shadow) |
| `.panel-floating` | Elevated overlay surface (deep shadow) |
| `.panel-spectral` | Recessed instrument panel (inset shadow) |
| `.glass-panel` | Neutral chrome surface (solid, 1px border) |
| `.input-well` | Recessed form-field well |
| `.machined` | Inner top highlight + seated base for solid controls |
| `.accent-edge` | 2px accent left rule for featured content |
| `.metal-edge` | Thin specular top/left highlights |
| `.obsidian-surface` | Reflective black gradient |
| `.accent-surface` | Accent-tinted featured surface |
| `.hover-lift` | Precision hover: border brightens, lifts 2px, 180ms |
| `.accent-glow` / `.text-glow` | Opt-in premium accents (never default) |
| `.text-gradient` / `.text-accent` | Accent text treatments |
| `.span-2/3/4/6/full`, `.row-span-2/3/4` | Grid span helpers (+ `md:`/`lg:` variants) |
