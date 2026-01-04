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
export { Input, Textarea, Select, Checkbox, Switch, RadioGroup, RangeSlider, FileUpload, InputGroup, DatePicker, TimePicker, DateTimePicker } from './components/forms';

// ===== Layout Components =====
export { Card, Panel, Grid, Container, SectionHeader, Divider } from './components/cards';

// ===== Navigation Components =====
export { Navbar, Sidebar, Tabs, Breadcrumbs, Menu, DropdownMenu, ContextMenu } from './components/navigation';

// ===== Overlay & Feedback Components =====
export { Modal, Alert, Spinner, Tooltip, ProgressBar, SkeletonLoader, Toast, Drawer, Popover, Dropdown, CommandPalette } from './components/overlays';

// ===== Typography Components =====
export { Heading, Text, Code } from './components/typography';

// ===== Data Display Components =====
export { Table, Pagination, Badge, Tag, List, Avatar, CodeBlock, Stat } from './components/data';
export type { TableColumn, SortDirection } from './components/data';

// ===== Utility Components =====
export { Portal, Collapse, Accordion, Carousel, ScrollArea, Hero, SystemConsole, SystemInterface } from './components/utilities';
export type { ConsoleMessage, SystemMessage, MessageContentType } from './components/utilities';

// ===== Component Prop Type Exports =====

import type { ComponentProps } from 'svelte';
import type Button from './components/buttons/Button.svelte';
import type IconButton from './components/buttons/IconButton.svelte';
import type FloatingActionButton from './components/buttons/FloatingActionButton.svelte';
import type LinkButton from './components/buttons/LinkButton.svelte';
import type Input from './components/forms/Input.svelte';
import type Textarea from './components/forms/Textarea.svelte';
import type Select from './components/forms/Select.svelte';
import type Checkbox from './components/forms/Checkbox.svelte';
import type Switch from './components/forms/Switch.svelte';
import type RadioGroup from './components/forms/RadioGroup.svelte';
import type DatePicker from './components/forms/DatePicker.svelte';
import type TimePicker from './components/forms/TimePicker.svelte';
import type DateTimePicker from './components/forms/DateTimePicker.svelte';
import type Card from './components/cards/Card.svelte';
import type Tabs from './components/navigation/Tabs.svelte';
import type Modal from './components/overlays/Modal.svelte';
import type Drawer from './components/overlays/Drawer.svelte';
import type Alert from './components/overlays/Alert.svelte';
import type Tooltip from './components/overlays/Tooltip.svelte';
import type Accordion from './components/utilities/Accordion.svelte';

// Button Component Types
export type ButtonProps = ComponentProps<Button>;
export type IconButtonProps = ComponentProps<IconButton>;
export type FloatingActionButtonProps = ComponentProps<FloatingActionButton>;
export type LinkButtonProps = ComponentProps<LinkButton>;

// Form Component Types
export type InputProps = ComponentProps<Input>;
export type TextareaProps = ComponentProps<Textarea>;
export type SelectProps = ComponentProps<Select>;
export type CheckboxProps = ComponentProps<Checkbox>;
export type SwitchProps = ComponentProps<Switch>;
export type RadioGroupProps = ComponentProps<RadioGroup>;
export type DatePickerProps = ComponentProps<DatePicker>;
export type TimePickerProps = ComponentProps<TimePicker>;
export type DateTimePickerProps = ComponentProps<DateTimePicker>;

// Layout Component Types
export type CardProps = ComponentProps<Card>;

// Navigation Component Types
export type TabsProps = ComponentProps<Tabs>;

// Overlay Component Types
export type ModalProps = ComponentProps<Modal>;
export type DrawerProps = ComponentProps<Drawer>;
export type AlertProps = ComponentProps<Alert>;
export type TooltipProps = ComponentProps<Tooltip>;

// Utility Component Types
export type AccordionProps = ComponentProps<Accordion>;
