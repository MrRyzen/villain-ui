/**
 * @mrintel/villain-ui - A luxury Svelte 5 component library
 *
 * This is the main entry point for the component library.
 */

// Import theme CSS to ensure it's bundled
import './theme.css';

export const version = '0.5.0';

// ===== Button Components =====
export { Button, IconButton, ButtonGroup, LinkButton, FloatingActionButton } from './components/buttons';

// ===== Form Components =====
export { Input, Textarea, Select, Checkbox, Switch, RadioGroup, RangeSlider, FileUpload, InputGroup } from './components/forms';

// ===== Layout Components =====
export { Card, Panel, Grid, Container, SectionHeader, Divider, LinkCard } from './components/cards';

// ===== Navigation Components =====
export { Navbar, Sidebar, Tabs, Breadcrumbs, Menu, DropdownMenu, ContextMenu } from './components/navigation';

// ===== Overlay & Feedback Components =====
export { Modal, Alert, Spinner, Tooltip, ProgressBar, SkeletonLoader, Toast, Drawer, Popover, Dropdown, CommandPalette } from './components/overlays';

// ===== Typography Components =====
export { Heading, Text, Code } from './components/typography';

// ===== Data Display Components =====
export { Table, Pagination, Badge, Tag, List, Avatar, CodeBlock, Stat } from './components/data';

// ===== Utility Components =====
export { Portal, Collapse, Accordion, Carousel, ScrollArea, Hero } from './components/utilities';

// ===== Component Prop Type Exports =====

// Button Component Types
export type { Props as ButtonProps } from './components/buttons/Button.svelte';
export type { Props as IconButtonProps } from './components/buttons/IconButton.svelte';
export type { Props as FloatingActionButtonProps } from './components/buttons/FloatingActionButton.svelte';
export type { Props as LinkButtonProps } from './components/buttons/LinkButton.svelte';

// Form Component Types
export type { Props as InputProps } from './components/forms/Input.svelte';
export type { Props as TextareaProps } from './components/forms/Textarea.svelte';
export type { Props as SelectProps } from './components/forms/Select.svelte';
export type { Props as CheckboxProps } from './components/forms/Checkbox.svelte';
export type { Props as SwitchProps } from './components/forms/Switch.svelte';
export type { Props as RadioGroupProps } from './components/forms/RadioGroup.svelte';

// Layout Component Types
export type { Props as CardProps } from './components/cards/Card.svelte';

// Navigation Component Types
export type { Props as TabsProps } from './components/navigation/Tabs.svelte';

// Overlay Component Types
export type { Props as ModalProps } from './components/overlays/Modal.svelte';
export type { Props as DrawerProps } from './components/overlays/Drawer.svelte';
export type { Props as AlertProps } from './components/overlays/Alert.svelte';
export type { Props as TooltipProps } from './components/overlays/Tooltip.svelte';

// Utility Component Types
export type { Props as AccordionProps } from './components/utilities/Accordion.svelte';
