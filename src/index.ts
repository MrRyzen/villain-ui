/**
 * @mrintel/villain-ui - A luxury Svelte 5 component library
 *
 * This is the main entry point for the component library.
 */

// Import theme CSS to ensure it's bundled
import './theme.css';

export const version = '0.1.0';

// ===== Button Components =====
export { Button, IconButton, ButtonGroup, LinkButton, FloatingActionButton } from './components/buttons';

// ===== Form Components =====
export { Input, Textarea, Select, Checkbox, Switch, RadioGroup, RangeSlider, FileUpload, InputGroup } from './components/forms';

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

// ===== Utility Components =====
export { Portal, Collapse, Accordion, Carousel, ScrollArea } from './components/utilities';
