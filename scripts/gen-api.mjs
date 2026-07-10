// Generates API.md from component Props interfaces.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'L:/Projects/packages/mrdv-ui';
const COMP = join(ROOT, 'src', 'components');

const categories = [
	['buttons', 'Buttons'],
	['cards', 'Cards & Layout'],
	['forms', 'Forms'],
	['navigation', 'Navigation'],
	['overlays', 'Overlays & Feedback'],
	['typography', 'Typography'],
	['data', 'Data Display'],
	['utilities', 'Utilities'],
	['wizard', 'Wizard']
];

// Extract a balanced-brace block starting at the first `{` after `startIdx`
function extractBlock(src, startIdx) {
	const open = src.indexOf('{', startIdx);
	if (open === -1) return null;
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}') {
			depth--;
			if (depth === 0) return src.slice(open, i + 1);
		}
	}
	return null;
}

function extractProps(file) {
	const src = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
	const m = src.match(/(?:export )?interface Props\b/);
	if (!m) return null;
	const block = extractBlock(src, m.index);
	if (!block) return null;
	// normalize leading whitespace: convert tabs to 2 spaces, strip common indent
	let lines = `interface Props ${block}`.split('\n').map((l) => l.replace(/\t/g, '  '));
	const indents = lines.slice(1, -1).filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
	const min = indents.length ? Math.min(...indents) : 0;
	lines = [lines[0], ...lines.slice(1).map((l) => l.slice(Math.min(min - 2 > 0 ? min - 2 : 0, l.match(/^ */)[0].length)))];
	return lines.join('\n');
}

function componentsIn(cat) {
	const idx = readFileSync(join(COMP, cat, 'index.ts'), 'utf8');
	const out = [];
	for (const m of idx.matchAll(/export \{ default as (\w+) \} from '\.\/(\w+)\.svelte'/g)) {
		out.push({ name: m[1], file: join(COMP, cat, m[2] + '.svelte') });
	}
	return out;
}

let md = `# Villain UI — Component API

> Auto-generated from component \`Props\` interfaces (\`npm run docs:api\` regenerates).
> All components also accept standard HTML attributes via rest props unless noted.
> \`Snippet\` = \`import('svelte').Snippet\` — pass with \`{#snippet name()}...{/snippet}\`.

## Install & Theme

\`\`\`ts
import { Button, Card, Modal /* ... */ } from '@mrintel/villain-ui';
import '@mrintel/villain-ui/theme.css';
\`\`\`

Fonts (consumer-loaded): Archivo 400–900, IBM Plex Mono 400–600. Optional display themes via \`data-display="bodoni" | "oswald"\` on an ancestor element.

Rebrand the accent by overriding \`--color-accent\`, \`--color-accent-soft\`, \`--color-accent-dark\` after the theme import.

`;

// TOC
md += '## Components\n\n';
for (const [cat, title] of categories) {
	const comps = componentsIn(cat);
	md += `- **${title}**: ${comps.map((c) => `[${c.name}](#${c.name.toLowerCase()})`).join(', ')}\n`;
}
md += '\n---\n\n';

for (const [cat, title] of categories) {
	md += `## ${title}\n\n`;
	for (const { name, file } of componentsIn(cat)) {
		const props = extractProps(file);
		md += `### ${name}\n\n`;
		if (props) {
			md += '```ts\n' + props + '\n```\n\n';
		} else {
			md += '_No props — content via default slot/children._\n\n';
		}
	}
}

// ===== Hand-maintained appendix (programmatic APIs, types, theme classes) =====
md += `---

## Programmatic APIs

### toast

Imperative toast API. Requires a single \`<ToastHost />\` mounted in the app's root layout. Returns the toast id (usable with \`dismissToast\`).

\`\`\`ts
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
\`\`\`

\`\`\`ts
toast('Saved');
toast.success('Added to cart');
toast.error('Could not save', { duration: 0 });
\`\`\`

### createStepController

Headless wizard state controller (nanostores). Owns step state, transitions, guards, and validation. Pair with \`StepForm\` + \`StepRail\`.

\`\`\`ts
function createStepController<TId extends string>(
  options: StepControllerOptions<TId>
): StepController<TId>;
\`\`\`

Key \`StepControllerOptions\` fields: \`steps: StepDefinition<TId>[]\`, \`initialStepId?\`, \`navigation?: StepNavigationRules\` (\`allowBackNavigation\`, etc.), and callbacks \`onBeforeStepChange\`, \`onStepChange\`, \`onStepComplete\`, \`onError\`. The returned controller exposes reactive stores plus \`next()\`, \`prev()\`, \`goTo(id)\`, \`complete()\`.

## Exported Types

\`\`\`ts
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
\`\`\`

## Theme Utility Classes

Class-based building blocks from \`theme.css\`:

| Class | Purpose |
|---|---|
| \`.panel-base\` | Flat editorial surface (subtle border) |
| \`.panel-raised\` | Machined raised panel (specular top edge + short shadow) |
| \`.panel-floating\` | Elevated overlay surface (deep shadow) |
| \`.panel-spectral\` | Recessed instrument panel (inset shadow) |
| \`.glass-panel\` | Neutral chrome surface (solid, 1px border) |
| \`.input-well\` | Recessed form-field well |
| \`.machined\` | Inner top highlight + seated base for solid controls |
| \`.accent-edge\` | 2px accent left rule for featured content |
| \`.metal-edge\` | Thin specular top/left highlights |
| \`.obsidian-surface\` | Reflective black gradient |
| \`.accent-surface\` | Accent-tinted featured surface |
| \`.hover-lift\` | Precision hover: border brightens, lifts 2px, 180ms |
| \`.accent-glow\` / \`.text-glow\` | Opt-in premium accents (never default) |
| \`.text-gradient\` / \`.text-accent\` | Accent text treatments |
| \`.span-2/3/4/6/full\`, \`.row-span-2/3/4\` | Grid span helpers (+ \`md:\`/\`lg:\` variants) |
`;

writeFileSync(join(ROOT, 'API.md'), md);
console.log('written', join(ROOT, 'API.md'));
