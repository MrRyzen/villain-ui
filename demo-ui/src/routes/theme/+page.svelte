<script lang="ts">
	import {
		Container,
		Hero,
		Card,
		Grid,
		Panel,
		Heading,
		Text,
		Input,
		RangeSlider,
		Button,
		Badge,
		Alert,

		Toast

	} from '@mrintel/villain-ui';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import {
		getDefaultTheme,
		generateTheme,
		generateThemeFromAccent,
		themeToCSSVariables,
		applyCSSVariables,
		resetCSSVariables,
		type ThemeColors
	} from '$lib/colorGenerator';
	import { parseToHsla, adjustHue, toHex } from 'color2k';

	// Constants
	const THEME_STORAGE_KEY = 'villain-ui-custom-theme';

	// State management
	let themeColors = $state<ThemeColors>(getDefaultTheme());
	let accentColor = $state(themeColors.accent);
	let saturationAdjust = $state(50);
	let lightnessAdjust = $state(50);
	let contrastLevel = $state(50);
	let alertMessage = $state('');
	let alertVariant = $state<'success' | 'error' | 'info'>('success');

	// Validate and merge theme object with defaults
	function validateAndMergeTheme(theme: any): ThemeColors {
		const defaults = getDefaultTheme();
		const requiredKeys: (keyof ThemeColors)[] = [
			'base0', 'base1', 'base2', 'base3',
			'accent', 'accentSoft', 'accentDark',
			'secondary', 'success', 'warning', 'error',
			'text', 'textSoft', 'textMuted'
		];

		// Check if theme is an object
		if (!theme || typeof theme !== 'object') {
			return defaults;
		}

		// Validate each required key exists and is a valid hex color
		const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		for (const key of requiredKeys) {
			if (!theme[key] || typeof theme[key] !== 'string' || !hexColorRegex.test(theme[key])) {
				// Missing or invalid color, merge with defaults
				return { ...defaults, ...theme } as ThemeColors;
			}
		}

		// All keys valid, return the theme
		return theme as ThemeColors;
	}

	// Lifecycle: Load saved theme from localStorage
	onMount(() => {
		if (typeof localStorage !== 'undefined') {
			try {
				const stored = localStorage.getItem(THEME_STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					// Validate and merge with defaults to prevent undefined CSS variables
					const validatedTheme = validateAndMergeTheme(parsed);
					themeColors = validatedTheme;
					accentColor = validatedTheme.accent;
					showAlertMessage('Custom theme loaded from storage', 'info');
				}
			} catch (error) {
				console.error('Failed to load theme from localStorage:', error);
				showAlertMessage('Failed to load saved theme', 'error');
			}
		}
	});

	// Effect: Apply CSS variables whenever themeColors changes
	$effect(() => {
		if (typeof document !== 'undefined') {
			const cssVariables = themeToCSSVariables(themeColors);
			applyCSSVariables(cssVariables);
		}
	});

	// Effect: Persist theme to localStorage
	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			try {
				localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeColors));
			} catch (error) {
				console.error('Failed to save theme to localStorage:', error);
			}
		}
	});

	// Derived color information for accent
	let accentColorInfo = $derived(() => {
		try {
			const [h, s, l] = parseToHsla(themeColors.accent);
			const r = parseInt(themeColors.accent.slice(1, 3), 16);
			const g = parseInt(themeColors.accent.slice(3, 5), 16);
			const b = parseInt(themeColors.accent.slice(5, 7), 16);
			return {
				rgb: `${r}, ${g}, ${b}`,
				hsl: `${Math.round(h)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
			};
		} catch {
			return { rgb: '107, 33, 168', hsl: '272°, 67%, 39%' };
		}
	});

	// Color harmony calculations
	let colorHarmony = $derived(() => {
		try {
			const complementary = toHex(adjustHue(themeColors.accent, 180));
			const analogous1 = toHex(adjustHue(themeColors.accent, 30));
			const analogous2 = toHex(adjustHue(themeColors.accent, -30));
			const triadic1 = toHex(adjustHue(themeColors.accent, 120));
			const triadic2 = toHex(adjustHue(themeColors.accent, 240));
			return { complementary, analogous1, analogous2, triadic1, triadic2 };
		} catch {
			return {
				complementary: '#21a86b',
				analogous1: '#a821a8',
				analogous2: '#2121a8',
				triadic1: '#a8a821',
				triadic2: '#21a8a8'
			};
		}
	});

	// Alert helper
	function showAlertMessage(message: string, variant: 'success' | 'error' | 'info') {
		alertMessage = message;
		alertVariant = variant;
		setTimeout(() => {
			alertMessage = '';
		}, 3000);
	}

	// Regenerate theme from base and accent
	function regenerateFromAccent() {
		themeColors = generateTheme(themeColors.base0, themeColors.accent, {
			saturationAdjust,
			lightnessAdjust,
			contrastLevel
		});
		accentColor = themeColors.accent;
		showAlertMessage('Theme generated from base and accent colors', 'success');
	}

	// Reset theme
	function resetTheme() {
		themeColors = getDefaultTheme();
		accentColor = themeColors.accent;
		saturationAdjust = 50;
		lightnessAdjust = 50;
		contrastLevel = 50;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(THEME_STORAGE_KEY);
		}
		showAlertMessage('Theme reset to defaults', 'success');
	}

	// Export theme as CSS
	function exportThemeAsCSS() {
		try {
			const cssVars = themeToCSSVariables(themeColors);
			const cssContent = `:root {\n${Object.entries(cssVars)
				.map(([key, value]) => `  ${key}: ${value};`)
				.join('\n')}\n}`;
			const blob = new Blob([cssContent], { type: 'text/css' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'theme-override.css';
			a.click();
			URL.revokeObjectURL(url);
			showAlertMessage('Theme exported as CSS', 'success');
		} catch (error) {
			console.error('Export CSS failed:', error);
			showAlertMessage('Failed to export theme as CSS', 'error');
		}
	}

	// Export theme as JSON
	function exportThemeAsJSON() {
		try {
			const json = JSON.stringify(themeColors, null, 2);
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'theme.json';
			a.click();
			URL.revokeObjectURL(url);
			showAlertMessage('Theme exported as JSON', 'success');
		} catch (error) {
			console.error('Export JSON failed:', error);
			showAlertMessage('Failed to export theme as JSON', 'error');
		}
	}

	// Import theme from JSON
	function importThemeFromJSON(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const imported = JSON.parse(e.target?.result as string);
				// Validate and merge with defaults to prevent undefined CSS variables
				const validatedTheme = validateAndMergeTheme(imported);
				themeColors = validatedTheme;
				accentColor = validatedTheme.accent;
				showAlertMessage('Theme imported successfully', 'success');
			} catch (error) {
				console.error('Import failed:', error);
				showAlertMessage('Failed to parse theme file', 'error');
			}
		};
		reader.readAsText(file);
	}

	// Copy color to clipboard
	async function copyColor(color: string, name: string) {
		try {
			await navigator.clipboard.writeText(color);
			showAlertMessage(`${name} (${color}) copied to clipboard!`, 'success');
		} catch {
			showAlertMessage('Failed to copy color', 'error');
		}
	}
</script>

<Container centered padding>
	{#if alertMessage}
		<Toast 
			message={alertMessage} 
			variant={alertVariant} 
			position="bottom-right"
			duration={3000}
			dismissible
		/>
	{/if}

	<Hero>
		{#snippet title()}
			<Heading level={1} variant="accent" glow>Theme Customizer</Heading>
		{/snippet}

		{#snippet text()}
			<Text variant="body" color="soft">
				Customize all theme colors manually or generate a complete palette from a single accent
				color
			</Text>
		{/snippet}

		{#snippet features()}
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:edit" class="tag-icon" />
				Manual Editing
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:wand-2" class="tag-icon" />
				Auto Generation
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:download" class="tag-icon" />
				Export/Import
			</Badge>
			<Badge variant="feature" size="md" hover>
				<Icon icon="lucide:eye" class="tag-icon" />
				Live Preview
			</Badge>
		{/snippet}
	</Hero>

	<Grid cols={1} gap="lg">
		<!-- All Colors in One Card -->
		<Card padding="lg">
			{#snippet header()}
				<div class="section-header">
					<Heading level={2}>Theme Colors</Heading>
					<Button variant="primary" size="sm" onclick={regenerateFromAccent}>
						<Icon icon="lucide:wand-2" width="16" height="16" />
						Generate Theme
					</Button>
				</div>
			{/snippet}

			<Text variant="body" color="soft">
				All theme colors in one view. Manually adjust individual colors or use "Generate Theme" to auto-generate from accent and base colors.
			</Text>

			<!-- Base Colors -->
			<div class="color-section">
				<Heading level={3}>Base Colors</Heading>
				<Text variant="caption" color="soft">Background layers from darkest to lightest</Text>
				<Grid cols={4} gap="md" responsive>
					<div class="color-input-wrapper">
						<Input type="color" label="Base 0" bind:value={themeColors.base0} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.base0}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.base0, 'Base 0')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Base 1" bind:value={themeColors.base1} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.base1}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.base1, 'Base 1')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Base 2" bind:value={themeColors.base2} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.base2}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.base2, 'Base 2')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Base 3" bind:value={themeColors.base3} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.base3}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.base3, 'Base 3')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Accent Colors -->
			<div class="color-section">
				<Heading level={3}>Accent Colors</Heading>
				<Text variant="caption" color="soft">Primary accent and its variants</Text>
				<Grid cols={3} gap="md" responsive>
					<div class="color-input-wrapper">
						<Input type="color" label="Accent" bind:value={themeColors.accent} />
						<div class="color-meta">
							<Badge variant="accent" size="sm">{themeColors.accent}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.accent, 'Accent')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
						<div class="color-details">
							<Text variant="body" color="muted">RGB: {accentColorInfo().rgb}</Text>
							<Text variant="body" color="muted">HSL: {accentColorInfo().hsl}</Text>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Accent Soft" bind:value={themeColors.accentSoft} />
						<div class="color-meta">
							<Badge variant="accent" size="sm">{themeColors.accentSoft}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.accentSoft, 'Accent Soft')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Accent Dark" bind:value={themeColors.accentDark} />
						<div class="color-meta">
							<Badge variant="accent" size="sm">{themeColors.accentDark}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.accentDark, 'Accent Dark')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Secondary & State Colors -->
			<div class="color-section">
				<Heading level={3}>Secondary & State Colors</Heading>
				<Text variant="caption" color="soft">Secondary and semantic state indicators</Text>
				<Grid cols={4} gap="md" responsive>
					<div class="color-input-wrapper">
						<Input type="color" label="Secondary" bind:value={themeColors.secondary} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.secondary}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.secondary, 'Secondary')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Success" bind:value={themeColors.success} />
						<div class="color-meta">
							<Badge variant="success" size="sm">{themeColors.success}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.success, 'Success')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Warning" bind:value={themeColors.warning} />
						<div class="color-meta">
							<Badge variant="warning" size="sm">{themeColors.warning}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.warning, 'Warning')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Error" bind:value={themeColors.error} />
						<div class="color-meta">
							<Badge variant="error" size="sm">{themeColors.error}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.error, 'Error')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Text Colors -->
			<div class="color-section">
				<Heading level={3}>Text Colors</Heading>
				<Text variant="caption" color="soft">Text hierarchy from primary to muted</Text>
				<Grid cols={3} gap="md" responsive>
					<div class="color-input-wrapper">
						<Input type="color" label="Text" bind:value={themeColors.text} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.text}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.text, 'Text')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Text Soft" bind:value={themeColors.textSoft} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.textSoft}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.textSoft, 'Text Soft')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>

					<div class="color-input-wrapper">
						<Input type="color" label="Text Muted" bind:value={themeColors.textMuted} />
						<div class="color-meta">
							<Badge variant="default" size="sm">{themeColors.textMuted}</Badge>
							<button
								class="copy-icon"
								onclick={() => copyColor(themeColors.textMuted, 'Text Muted')}
								aria-label="Copy color"
							>
								<Icon icon="lucide:copy" width="14" height="14" />
							</button>
						</div>
					</div>
				</Grid>
			</div>

			<!-- Color Harmony -->
			<div class="harmony-section">
				<Heading level={3}>Color Harmony</Heading>
				<Text variant="caption" color="soft">Color relationships based on your accent color</Text>
				<div class="harmony-grid">
					<Panel padding="sm" rounded>
						<div class="harmony-label">Complementary</div>
						<div class="harmony-swatch" style="background-color: {colorHarmony().complementary}"></div>
						<Badge variant="default" size="sm">{colorHarmony().complementary}</Badge>
					</Panel>
					<Panel padding="sm" rounded>
						<div class="harmony-label">Analogous</div>
						<div class="harmony-row">
							<div class="harmony-swatch-sm" style="background-color: {colorHarmony().analogous2}"></div>
							<div class="harmony-swatch-sm" style="background-color: {themeColors.accent}"></div>
							<div class="harmony-swatch-sm" style="background-color: {colorHarmony().analogous1}"></div>
						</div>
					</Panel>
					<Panel padding="sm" rounded>
						<div class="harmony-label">Triadic</div>
						<div class="harmony-row">
							<div class="harmony-swatch-sm" style="background-color: {themeColors.accent}"></div>
							<div class="harmony-swatch-sm" style="background-color: {colorHarmony().triadic1}"></div>
							<div class="harmony-swatch-sm" style="background-color: {colorHarmony().triadic2}"></div>
						</div>
					</Panel>
				</div>
			</div>
		</Card>

		<!-- Fine-Tuning Sliders Section -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Generation Controls</Heading>
			{/snippet}

			<Text variant="body" color="soft">
				Set your base and accent colors, then adjust fine-tuning parameters before clicking "Generate Theme". Generation uses both colors for better harmony.
			</Text>

			<Grid cols={3} gap="lg" responsive>
				<Panel padding="md" rounded>
					<RangeSlider label="Saturation" bind:value={saturationAdjust} min={0} max={100} showValue />
					<div class="slider-hint">
						<Text variant="body" color="muted">Controls color vibrancy</Text>
					</div>
				</Panel>

				<Panel padding="md" rounded>
					<RangeSlider label="Lightness" bind:value={lightnessAdjust} min={0} max={100} showValue />
					<div class="slider-hint">
						<Text variant="body" color="muted">Adjusts overall brightness</Text>
					</div>
				</Panel>

				<Panel padding="md" rounded>
					<RangeSlider label="Contrast" bind:value={contrastLevel} min={0} max={100} showValue />
					<div class="slider-hint">
						<Text variant="body" color="muted">Controls color separation</Text>
					</div>
				</Panel>
			</Grid>
		</Card>

		<!-- Live Preview Section -->
		<Card padding="lg">
			{#snippet header()}
				<div class="section-header">
					<Icon icon="lucide:eye" width="24" height="24" />
					<Heading level={2}>Live Preview</Heading>
				</div>
			{/snippet}

			<Text variant="body" color="soft">
				Preview how your theme looks on actual components. Changes apply immediately.
			</Text>

			<Panel variant="glass" padding="lg" rounded>
				<div class="preview-section">
					<div class="preview-group">
						<Heading level={3}>Buttons</Heading>
						<div class="component-row">
							<Button variant="primary">Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
						</div>
					</div>

					<div class="preview-group">
						<Heading level={3}>Badges</Heading>
						<div class="component-row">
							<Badge variant="default">Default</Badge>
							<Badge variant="accent">Accent</Badge>
							<Badge variant="feature">Feature</Badge>
							<Badge variant="success">Success</Badge>
							<Badge variant="warning">Warning</Badge>
							<Badge variant="error">Error</Badge>
						</div>
					</div>

					<div class="preview-group">
						<Heading level={3}>Alerts</Heading>
						<div class="component-stack">
							<Alert variant="success">This is a success alert message.</Alert>
							<Alert variant="warning">This is a warning alert message.</Alert>
							<Alert variant="error">This is an error alert message.</Alert>
							<Alert variant="info">This is an info alert message.</Alert>
						</div>
					</div>

					<div class="preview-group">
						<Heading level={3}>Card Sample</Heading>
						<Card padding="md">
							{#snippet header()}
								<Heading level={4}>Sample Card</Heading>
							{/snippet}
							<Text variant="body">
								This card demonstrates how the generated theme colors affect card surfaces, borders,
								and text.
							</Text>
							<div class="component-row" style="margin-top: 1rem;">
								<Button variant="primary" size="sm">Action</Button>
								<Button variant="ghost" size="sm">Cancel</Button>
							</div>
						</Card>
					</div>

					<div class="preview-group">
						<Heading level={3}>Typography</Heading>
						<div class="component-stack">
							<Heading level={1}>Heading 1</Heading>
							<Heading level={2}>Heading 2</Heading>
							<Text variant="body">Body text with primary text color</Text>
							<Text variant="body" color="soft">Soft text for secondary information</Text>
							<Text variant="body" color="muted">Muted text for tertiary information</Text>
						</div>
					</div>
				</div>
			</Panel>
		</Card>

		<!-- Action Buttons Section -->
		<Card padding="lg">
			{#snippet header()}
				<Heading level={2}>Theme Management</Heading>
			{/snippet}

			<Text variant="body" color="soft">
				Export your customized theme or reset to defaults. Import previously exported themes to
				restore your custom colors.
			</Text>

			<Grid cols={2} gap="md" responsive>
				<Button variant="primary" onclick={regenerateFromAccent}>
					<Icon icon="lucide:wand-2" width="18" height="18" />
					Regenerate from Accent
				</Button>

				<Button variant="ghost" onclick={resetTheme}>
					<Icon icon="lucide:rotate-ccw" width="18" height="18" />
					Reset to Default
				</Button>

				<Button variant="secondary" onclick={exportThemeAsCSS}>
					<Icon icon="lucide:download" width="18" height="18" />
					Export as CSS
				</Button>

				<Button variant="secondary" onclick={exportThemeAsJSON}>
					<Icon icon="lucide:file-json" width="18" height="18" />
					Export as JSON
				</Button>

				<div class="import-wrapper">
					<input
						type="file"
						accept="application/json,.json"
						onchange={importThemeFromJSON}
						class="file-input"
						id="import-json"
					/>
					<Button variant="ghost" onclick={() => document.getElementById('import-json')?.click()}>
						<Icon icon="lucide:upload" width="18" height="18" />
						Import JSON
					</Button>
				</div>
			</Grid>
		</Card>
	</Grid>
</Container>

<style>
	.color-input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.color-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		justify-content: space-between;
	}

	.color-details {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}

	.copy-icon {
		background: transparent;
		border: none;
		color: var(--color-text-soft);
		cursor: pointer;
		padding: 0.25rem;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.copy-icon:hover {
		color: var(--color-accent);
		background: var(--color-base-2);
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.slider-hint {
		margin-top: 0.5rem;
	}

	.color-section {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.color-section:last-of-type {
		border-bottom: none;
		padding-bottom: 0;
	}

	.harmony-section {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.harmony-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.harmony-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-soft);
		margin-bottom: 0.5rem;
	}

	.harmony-swatch {
		width: 100%;
		height: 50px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		margin-bottom: 0.5rem;
	}

	.harmony-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.harmony-swatch-sm {
		flex: 1;
		height: 40px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--color-border);
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.preview-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.component-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}

	.component-stack {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.import-wrapper {
		position: relative;
	}

	.file-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.section-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
