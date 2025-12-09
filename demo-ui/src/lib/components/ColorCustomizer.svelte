<script lang="ts">
	import { lighten, darken, adjustHue, saturate, desaturate, mix } from 'color2k';
	import { Input, Button, Heading, Text, Card, Panel, Badge } from '@mrintel/villain-ui';
	import Icon from '@iconify/svelte';

	// Mode toggle
	let mode = $state<'auto' | 'manual'>('auto');

	// Master colors (for auto mode)
	let baseColor = $state('#0a0a0a');
	let accentColor = $state('#6b21a8');

	// Individual colors (for manual mode or override)
	let colors = $state({
		base0: '#0a0a0a',
		base1: '#121212',
		base2: '#1a1a1a',
		base3: '#242424',
		accent: '#6b21a8',
		accentSoft: '#8b5cf6',
		accentDark: '#581c87',
		secondary: '#3b82f6',
		crimson: '#ef4444',
		textPrimary: '#e0e0e0',
		textSoft: '#a3a3a3',
		textMuted: '#737373',
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444'
	});

	// Smart color generation based on base + accent
	function generateAllColors(base: string, accent: string) {
		try {
			// Base shades (progressive lightening)
			const base0 = base;
			const base1 = lighten(base, 0.05);
			const base2 = lighten(base, 0.10);
			const base3 = lighten(base, 0.15);

			// Accent variants
			const accentDark = darken(accent, 0.15);
			const accentSoft = lighten(accent, 0.25);

			// Secondary: Complementary hue (120° shift for triadic harmony)
			const secondary = adjustHue(accent, 120);

			// Crimson: Analogous to accent but shifted to red spectrum
			const crimson = mix(accent, '#ef4444', 0.3);

			// Text colors: High contrast from base for readability
			const textPrimary = lighten(base, 0.88); // ~#e0e0e0
			const textSoft = lighten(base, 0.65); // ~#a3a3a3
			const textMuted = lighten(base, 0.45); // ~#737373

			// State colors: Derived from accent but shifted to standard hues
			// Success: Green hue (~150°)
			const success = saturate(adjustHue(accent, 150 - getHue(accent)), 0.1);
			// Warning: Orange/Amber hue (~40°)
			const warning = saturate(adjustHue(accent, 40 - getHue(accent)), 0.2);
			// Error: Red hue (~0°)
			const error = saturate(adjustHue(accent, 0 - getHue(accent)), 0.15);

			return {
				base0,
				base1,
				base2,
				base3,
				accent,
				accentSoft,
				accentDark,
				secondary,
				crimson,
				textPrimary,
				textSoft,
				textMuted,
				success,
				warning,
				error
			};
		} catch (e) {
			console.error('Color generation error:', e);
			return null;
		}
	}

	// Helper to get hue in degrees (approximate)
	function getHue(color: string): number {
		// Simple hue extraction - this is approximate
		// For purple (#6b21a8) ≈ 280°, blue ≈ 240°, etc.
		const hex = color.replace('#', '');
		const r = parseInt(hex.slice(0, 2), 16) / 255;
		const g = parseInt(hex.slice(2, 4), 16) / 255;
		const b = parseInt(hex.slice(4, 6), 16) / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;

		if (delta === 0) return 0;

		let hue = 0;
		if (max === r) {
			hue = ((g - b) / delta) % 6;
		} else if (max === g) {
			hue = (b - r) / delta + 2;
		} else {
			hue = (r - g) / delta + 4;
		}

		return Math.round(hue * 60);
	}

	// Auto-generate when base or accent changes (in auto mode)
	$effect(() => {
		if (mode === 'auto') {
			const generated = generateAllColors(baseColor, accentColor);
			if (generated) {
				colors = generated;
			}
		}
	});

	// Apply theme to document
	function applyTheme() {
		const cssVars = {
			'--color-base-0': colors.base0,
			'--color-base-1': colors.base1,
			'--color-base-2': colors.base2,
			'--color-base-3': colors.base3,
			'--color-accent': colors.accent,
			'--color-accent-soft': colors.accentSoft,
			'--color-accent-dark': colors.accentDark,
			'--color-secondary': colors.secondary,
			'--color-crimson': colors.crimson,
			'--color-text': colors.textPrimary,
			'--color-text-soft': colors.textSoft,
			'--color-text-muted': colors.textMuted,
			'--color-success': colors.success,
			'--color-warning': colors.warning,
			'--color-error': colors.error
		};

		Object.entries(cssVars).forEach(([key, value]) => {
			document.documentElement.style.setProperty(key, value);
		});
	}

	// Reset to defaults
	function resetTheme() {
		// Remove all inline style overrides to restore original theme.css values
		const cssVars = [
			'--color-base-0',
			'--color-base-1',
			'--color-base-2',
			'--color-base-3',
			'--color-accent',
			'--color-accent-soft',
			'--color-accent-dark',
			'--color-secondary',
			'--color-crimson',
			'--color-text',
			'--color-text-soft',
			'--color-text-muted',
			'--color-success',
			'--color-warning',
			'--color-error'
		];

		cssVars.forEach((varName) => {
			document.documentElement.style.removeProperty(varName);
		});

		// Reset state
		baseColor = '#0a0a0a';
		accentColor = '#6b21a8';
		mode = 'auto';
		// Auto mode will trigger regeneration via $effect
	}

	// Preset themes
	const presets = [
		{ name: 'Villain Purple', base: '#0a0a0a', accent: '#6b21a8' },
		{ name: 'Cyber Blue', base: '#0a0e1a', accent: '#3b82f6' },
		{ name: 'Emerald Night', base: '#0a1a0f', accent: '#10b981' },
		{ name: 'Crimson Shadow', base: '#1a0a0a', accent: '#ef4444' },
		{ name: 'Gold Lux', base: '#1a1510', accent: '#f59e0b' },
		{ name: 'Neon Pink', base: '#1a0a14', accent: '#ec4899' }
	];

	function applyPreset(preset: { base: string; accent: string }) {
		baseColor = preset.base;
		accentColor = preset.accent;
		mode = 'auto';
	}
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-2">
		<Heading level={2}>Theme Customizer</Heading>
		<Text variant="body" color="soft">
			{#if mode === 'auto'}
				All colors are automatically derived from your base and accent colors for perfect harmony.
			{:else}
				Fine-tune each color individually for complete control over your theme.
			{/if}
		</Text>
	</div>

	<!-- Mode Toggle -->
	<div class="flex gap-2">
		<Button
			variant={mode === 'auto' ? 'primary' : 'ghost'}
			size="sm"
			onclick={() => (mode = 'auto')}
		>
			{#snippet iconBefore()}
				<Icon icon="lucide:wand-2" width="16" height="16" />
			{/snippet}
			Auto Generate
		</Button>
		<Button
			variant={mode === 'manual' ? 'primary' : 'ghost'}
			size="sm"
			onclick={() => (mode = 'manual')}
		>
			{#snippet iconBefore()}
				<Icon icon="lucide:sliders" width="16" height="16" />
			{/snippet}
			Manual Control
		</Button>
	</div>

	{#if mode === 'auto'}
		<!-- Auto Mode: Just Base + Accent -->
		<div class="controls">
			<div class="color-input-group">
				<label for="base-color">
					<Text variant="body" weight="semibold">Base Color</Text>
					<Text variant="caption" color="soft">Background foundation</Text>
				</label>
				<div class="color-row">
					<Input
						id="base-color"
						type="color"
						bind:value={baseColor}
					/>
					<Input type="text" bind:value={baseColor} placeholder="#0a0a0a" />
				</div>
			</div>

			<div class="color-input-group">
				<label for="accent-color">
					<Text variant="body" weight="semibold">Accent Color</Text>
					<Text variant="caption" color="soft">Primary brand color</Text>
				</label>
				<div class="color-row">
					<Input
						id="accent-color"
						type="color"
						bind:value={accentColor}
					/>
					<Input type="text" bind:value={accentColor} placeholder="#6b21a8" />
				</div>
			</div>
		</div>
	{:else}
		<!-- Manual Mode: All individual colors -->
		<div class="manual-controls">
			<div class="color-group">
				<Text variant="body" weight="semibold">Base Shades</Text>
				<div class="color-row">
					<Input type="color" bind:value={colors.base0}  />
					<Input type="text" bind:value={colors.base0} placeholder="Base 0" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.base1}  />
					<Input type="text" bind:value={colors.base1} placeholder="Base 1" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.base2}  />
					<Input type="text" bind:value={colors.base2} placeholder="Base 2" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.base3}  />
					<Input type="text" bind:value={colors.base3} placeholder="Base 3" />
				</div>
			</div>

			<div class="color-group">
				<Text variant="body" weight="semibold">Accent Colors</Text>
				<div class="color-row">
					<Input type="color" bind:value={colors.accentDark}  />
					<Input type="text" bind:value={colors.accentDark} placeholder="Accent Dark" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.accent}  />
					<Input type="text" bind:value={colors.accent} placeholder="Accent" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.accentSoft}  />
					<Input type="text" bind:value={colors.accentSoft} placeholder="Accent Soft" />
				</div>
			</div>

			<div class="color-group">
				<Text variant="body" weight="semibold">Secondary Accents</Text>
				<div class="color-row">
					<Input type="color" bind:value={colors.secondary}  />
					<Input type="text" bind:value={colors.secondary} placeholder="Secondary" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.crimson}  />
					<Input type="text" bind:value={colors.crimson} placeholder="Crimson" />
				</div>
			</div>

			<div class="color-group">
				<Text variant="body" weight="semibold">Text Colors</Text>
				<div class="color-row">
					<Input type="color" bind:value={colors.textPrimary}  />
					<Input type="text" bind:value={colors.textPrimary} placeholder="Text Primary" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.textSoft}  />
					<Input type="text" bind:value={colors.textSoft} placeholder="Text Soft" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.textMuted}  />
					<Input type="text" bind:value={colors.textMuted} placeholder="Text Muted" />
				</div>
			</div>

			<div class="color-group">
				<Text variant="body" weight="semibold">State Colors</Text>
				<div class="color-row">
					<Input type="color" bind:value={colors.success}  />
					<Input type="text" bind:value={colors.success} placeholder="Success" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.warning}  />
					<Input type="text" bind:value={colors.warning} placeholder="Warning" />
				</div>
				<div class="color-row">
					<Input type="color" bind:value={colors.error}  />
					<Input type="text" bind:value={colors.error} placeholder="Error" />
				</div>
			</div>
		</div>
	{/if}

	<!-- Action Buttons -->
	<div class="actions">
		<Button variant="primary" onclick={applyTheme}>
			<Icon icon="lucide:check" width="16" height="16" />
			Apply Theme
		</Button>
		<Button variant="ghost" onclick={resetTheme}>
			<Icon icon="lucide:rotate-ccw" width="16" height="16" />
			Reset to Default
		</Button>
	</div>

	<!-- Presets -->
	<div class="presets">
		<Text variant="body" weight="semibold">Quick Presets</Text>
		<div class="preset-grid">
			{#each presets as preset}
				<button class="preset-card hover-lift" onclick={() => applyPreset(preset)}>
					<div class="preset-colors">
						<div class="preset-base" style="background: {preset.base}"></div>
						<div class="preset-accent" style="background: {preset.accent}"></div>
					</div>
					<Text variant="caption">{preset.name}</Text>
				</button>
			{/each}
		</div>
	</div>

	<!-- Color Preview -->
	<div class="preview">
		<Text variant="body" weight="semibold">Color Preview</Text>
		<div class="preview-grid">
			<div class="preview-section">
				<Text variant="caption" color="soft">Base Shades</Text>
				<div class="color-swatches-vertical">
					<div class="swatch" style="background: {colors.base0}">
						<Text variant="caption">Base 0</Text>
					</div>
					<div class="swatch" style="background: {colors.base1}">
						<Text variant="caption">Base 1</Text>
					</div>
					<div class="swatch" style="background: {colors.base2}">
						<Text variant="caption">Base 2</Text>
					</div>
					<div class="swatch" style="background: {colors.base3}">
						<Text variant="caption">Base 3</Text>
					</div>
				</div>
			</div>

			<div class="preview-section">
				<Text variant="caption" color="soft">Accent</Text>
				<div class="color-swatches-vertical">
					<div class="swatch" style="background: {colors.accentDark}">
						<Text variant="caption">Dark</Text>
					</div>
					<div class="swatch" style="background: {colors.accent}">
						<Text variant="caption">Primary</Text>
					</div>
					<div class="swatch" style="background: {colors.accentSoft}">
						<Text variant="caption">Soft</Text>
					</div>
				</div>
			</div>

			<div class="preview-section">
				<Text variant="caption" color="soft">Secondary</Text>
				<div class="color-swatches-vertical">
					<div class="swatch" style="background: {colors.secondary}">
						<Text variant="caption">Secondary</Text>
					</div>
					<div class="swatch" style="background: {colors.crimson}">
						<Text variant="caption">Crimson</Text>
					</div>
				</div>
			</div>

			<div class="preview-section">
				<Text variant="caption" color="soft">Text</Text>
				<div class="color-swatches-vertical">
					<div class="swatch" style="background: {colors.textPrimary}">
						<Text variant="caption">Primary</Text>
					</div>
					<div class="swatch" style="background: {colors.textSoft}">
						<Text variant="caption">Soft</Text>
					</div>
					<div class="swatch" style="background: {colors.textMuted}">
						<Text variant="caption">Muted</Text>
					</div>
				</div>
			</div>

			<div class="preview-section">
				<Text variant="caption" color="soft">State</Text>
				<div class="color-swatches-vertical">
					<div class="swatch" style="background: {colors.success}">
						<Text variant="caption">Success</Text>
					</div>
					<div class="swatch" style="background: {colors.warning}">
						<Text variant="caption">Warning</Text>
					</div>
					<div class="swatch" style="background: {colors.error}">
						<Text variant="caption">Error</Text>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.manual-controls {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.color-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.color-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.color-input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.color-input-group label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.actions :global(button) {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.presets {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preset-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.preset-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		backdrop-filter: blur(var(--glass-panel-blur));
		background: var(--glass-panel-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
	}

	.preset-colors {
		display: flex;
		width: 100%;
		height: 60px;
		border-radius: var(--radius-sm);
		overflow: hidden;
	}

	.preset-base,
	.preset-accent {
		flex: 1;
	}

	.preview {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preview-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}

	.preview-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.color-swatches-vertical {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.swatch {
		min-height: 60px;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
	}
</style>
