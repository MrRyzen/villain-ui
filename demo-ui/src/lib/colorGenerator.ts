import { darken, lighten, saturate, desaturate, adjustHue, mix, toHex, parseToHsla } from 'color2k';

/**
 * Theme colors interface matching CSS variables structure
 */
export interface ThemeColors {
	base0: string;
	base1: string;
	base2: string;
	base3: string;
	accent: string;
	accentSoft: string;
	accentDark: string;
	secondary: string;
	success: string;
	warning: string;
	error: string;
	text: string;
	textSoft: string;
	textMuted: string;
}

/**
 * CSS variables mapping interface
 */
export interface CSSVariables {
	'--color-base-0': string;
	'--color-base-1': string;
	'--color-base-2': string;
	'--color-base-3': string;
	'--color-accent': string;
	'--color-accent-soft': string;
	'--color-accent-dark': string;
	'--color-secondary': string;
	'--color-success': string;
	'--color-warning': string;
	'--color-error': string;
	'--color-text': string;
	'--color-text-soft': string;
	'--color-text-muted': string;
}

/**
 * Normalizes a hex color to lowercase 6-digit format for consistent comparison
 * @param color - The hex color string to normalize
 * @returns Normalized hex color in lowercase 6-digit format
 * @example
 * normalizeHexColor('#6B21A8') // '#6b21a8'
 * normalizeHexColor('#fff') // '#ffffff'
 */
export function normalizeHexColor(color: string): string {
	const normalized = color.toLowerCase();
	// Expand 3-digit hex to 6-digit format (#fff -> #ffffff)
	if (normalized.length === 4) {
		const r = normalized[1];
		const g = normalized[2];
		const b = normalized[3];
		return `#${r}${r}${g}${g}${b}${b}`;
	}
	return normalized;
}

/**
 * Validates if a string is a valid hex color format
 * @param color - The color string to validate
 * @returns True if the color is a valid hex format (#RGB, #RRGGBB, or #RRGGBBAA)
 * @example
 * validateHexColor('#6b21a8') // true
 * validateHexColor('#fff') // true
 * validateHexColor('invalid') // false
 */
export function validateHexColor(color: string): boolean {
	const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
	return hexRegex.test(color);
}

/**
 * Returns the default theme colors matching the current theme.css values
 * @returns Default theme colors object
 * @example
 * const defaultTheme = getDefaultTheme();
 */
export function getDefaultTheme(): ThemeColors {
	return {
		base0: '#0a0a0a',
		base1: '#121212',
		base2: '#1a1a1a',
		base3: '#242424',
		accent: '#6b21a8',
		accentSoft: '#8b5cf6',
		accentDark: '#581c87',
		secondary: '#3b82f6',
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444',
		text: '#e0e0e0',
		textSoft: '#a3a3a3',
		textMuted: '#737373'
	};
}

/**
 * Options for fine-tuning theme generation
 */
export interface ThemeGenerationOptions {
	/** Saturation adjustment (0-100, default 50). Higher values increase color vibrancy. */
	saturationAdjust?: number;
	/** Lightness adjustment (0-100, default 50). Higher values increase brightness. */
	lightnessAdjust?: number;
	/** Contrast level (0-100, default 50). Higher values increase color separation. */
	contrastLevel?: number;
}

/**
 * Generates a complete theme palette from base and accent colors
 *
 * Returns exact defaults when both base0 and accent match defaults (case-insensitive).
 * For custom colors, generates a harmonious palette where:
 * - Base colors (base0-base3) are derived from base0 by progressive lightening
 * - Accent colors (accent, accentSoft, accentDark) are derived from accent
 * - Secondary, state, and text colors are derived to match the palette
 *
 * @param base0Color - The darkest base color in hex format (e.g., '#0a0a0a')
 * @param accentColor - The accent color in hex format (e.g., '#6b21a8')
 * @param options - Optional fine-tuning parameters for saturation, lightness, and contrast
 * @returns Complete theme colors object with all derived colors
 * @example
 * // Returns exact getDefaultTheme() values
 * const theme = generateTheme('#0a0a0a', '#6b21a8');
 *
 * // Generates custom theme from base and accent
 * const blueTheme = generateTheme('#0f0f0f', '#3b82f6');
 * const redTheme = generateTheme('#0a0a0a', '#ef4444', { saturationAdjust: 70 });
 */
export function generateTheme(base0Color: string, accentColor: string, options: ThemeGenerationOptions = {}): ThemeColors {
	// Validate inputs and fallback to default if invalid
	if (!validateHexColor(base0Color) || !validateHexColor(accentColor)) {
		return getDefaultTheme();
	}

	// Exact match check: return default theme for default base0 and accent
	const normalizedBase0 = normalizeHexColor(base0Color);
	const normalizedAccent = normalizeHexColor(accentColor);
	if (normalizedBase0 === '#0a0a0a' && normalizedAccent === '#6b21a8') {
		return getDefaultTheme();
	}

	try {
		// Extract fine-tuning options with defaults
		const {
			saturationAdjust = 50,
			lightnessAdjust = 50,
			contrastLevel = 50
		} = options;

		// Convert 0-100 range to multipliers
		const saturationMultiplier = 0.5 + (saturationAdjust / 100); // 0.5 to 1.5
		const lightnessOffset = (lightnessAdjust - 50) / 200; // -0.25 to 0.25
		const contrastMultiplier = 0.5 + (contrastLevel / 100); // 0.5 to 1.5

		// === Base Colors Generation ===
		// Generate base1-base3 by progressively lightening base0
		const baseStep = 0.04 * contrastMultiplier; // Progressive lightening step
		const base0 = toHex(base0Color);
		const base1 = toHex(lighten(base0, baseStep + lightnessOffset * 0.02));
		const base2 = toHex(lighten(base1, baseStep + lightnessOffset * 0.02));
		const base3 = toHex(lighten(base2, baseStep + lightnessOffset * 0.02));

		// === Accent Colors Generation ===
		// Parse accent color and apply adjustments
		const [accentH, accentS, accentL] = parseToHsla(accentColor);
		const adjustedSaturation = Math.min(1, Math.max(0.3, accentS * saturationMultiplier));
		const adjustedLightness = Math.min(0.7, Math.max(0.2, accentL + lightnessOffset * 0.3));
		const adjustedAccent = `hsla(${accentH}, ${adjustedSaturation * 100}%, ${adjustedLightness * 100}%, 1)`;

		const accent = toHex(adjustedAccent);
		const accentLightenAmount = 0.15 * contrastMultiplier;
		const accentDarkenAmount = 0.15 * contrastMultiplier;
		const accentSoft = toHex(lighten(adjustedAccent, accentLightenAmount));
		const accentDark = toHex(darken(adjustedAccent, accentDarkenAmount));

		// === Secondary Color Generation ===
		// Complementary color with slight hue shift (180-200 degrees)
		const secondaryHueShift = 190 + (contrastMultiplier - 1) * 20;
		const secondaryBase = adjustHue(adjustedAccent, secondaryHueShift);
		const secondary = toHex(secondaryBase);

		// === State Colors Generation ===
		// Derive saturation influence from accent for consistency
		const saturationInfluence = Math.max(0.55, Math.min(0.85, adjustedSaturation * saturationMultiplier));
		const stateLightnessBase = 45 + (lightnessOffset * 40);

		// Success: Emerald Green (hue ~160)
		const successHue = 160;
		const successBase = `hsla(${successHue}, ${saturationInfluence * 100}%, ${Math.max(35, Math.min(60, stateLightnessBase))}%, 1)`;
		const success = toHex(successBase);

		// Warning: Amber/Orange (hue ~38)
		const warningHue = 38;
		const warningBase = `hsla(${warningHue}, ${Math.min(95, saturationInfluence * 100 + 10)}%, ${Math.max(40, Math.min(65, stateLightnessBase + 10))}%, 1)`;
		const warning = toHex(warningBase);

		// Error: Crimson Red (hue ~0)
		const errorHue = 0;
		const errorBase = `hsla(${errorHue}, ${saturationInfluence * 100}%, ${Math.max(40, Math.min(60, stateLightnessBase + 8))}%, 1)`;
		const error = toHex(errorBase);

		// === Text Colors Generation ===
		// Tint text colors slightly with accent for cohesion (3-8% mix)
		const text = toHex(mix('#e0e0e0', accent, 0.03));
		const textSoft = toHex(mix('#a3a3a3', accent, 0.05));
		const textMuted = toHex(mix('#737373', accent, 0.08));

		return {
			base0,
			base1,
			base2,
			base3,
			accent,
			accentSoft,
			accentDark,
			secondary,
			success,
			warning,
			error,
			text,
			textSoft,
			textMuted
		};
	} catch (error) {
		// Return default theme if color generation fails
		console.error('Error generating theme:', error);
		return getDefaultTheme();
	}
}

/**
 * Generates a complete theme palette from a single accent color (legacy function)
 *
 * This function is kept for backward compatibility. It generates base colors
 * from the accent and then calls generateTheme().
 *
 * @param accentColor - The accent color in hex format (e.g., '#6b21a8')
 * @param options - Optional fine-tuning parameters
 * @returns Complete theme colors object
 * @deprecated Use generateTheme() with explicit base0 and accent colors for better results
 */
export function generateThemeFromAccent(accentColor: string, options: ThemeGenerationOptions = {}): ThemeColors {
	// Validate input and fallback to default if invalid
	if (!validateHexColor(accentColor)) {
		return getDefaultTheme();
	}

	// For backward compatibility: derive base0 from accent
	const base0 = toHex(darken(desaturate(accentColor, 0.95), 0.6));

	// Call the new generateTheme function
	return generateTheme(base0, accentColor, options);
}

/**
 * Maps theme colors to CSS variable names
 * @param theme - The theme colors object
 * @returns Object with CSS variable names as keys and color values as values
 * @example
 * const theme = generateThemeFromAccent('#6b21a8');
 * const cssVars = themeToCSSVariables(theme);
 * // cssVars['--color-accent'] === '#6b21a8'
 */
export function themeToCSSVariables(theme: ThemeColors): CSSVariables {
	return {
		'--color-base-0': theme.base0,
		'--color-base-1': theme.base1,
		'--color-base-2': theme.base2,
		'--color-base-3': theme.base3,
		'--color-accent': theme.accent,
		'--color-accent-soft': theme.accentSoft,
		'--color-accent-dark': theme.accentDark,
		'--color-secondary': theme.secondary,
		'--color-success': theme.success,
		'--color-warning': theme.warning,
		'--color-error': theme.error,
		'--color-text': theme.text,
		'--color-text-soft': theme.textSoft,
		'--color-text-muted': theme.textMuted
	};
}

/**
 * List of CSS variable names that can be applied/reset
 */
const CSS_VARIABLE_NAMES: (keyof CSSVariables)[] = [
	'--color-base-0',
	'--color-base-1',
	'--color-base-2',
	'--color-base-3',
	'--color-accent',
	'--color-accent-soft',
	'--color-accent-dark',
	'--color-secondary',
	'--color-success',
	'--color-warning',
	'--color-error',
	'--color-text',
	'--color-text-soft',
	'--color-text-muted'
];

/**
 * Applies CSS variables to the document root element
 * @param variables - The CSS variables object to apply
 * @example
 * const theme = generateThemeFromAccent('#6b21a8');
 * const cssVars = themeToCSSVariables(theme);
 * applyCSSVariables(cssVars);
 */
export function applyCSSVariables(variables: CSSVariables): void {
	// SSR safety check
	if (typeof document === 'undefined') {
		return;
	}

	try {
		const root = document.documentElement;
		for (const [property, value] of Object.entries(variables)) {
			root.style.setProperty(property, value);
		}
	} catch (error) {
		console.error('Error applying CSS variables:', error);
	}
}

/**
 * Removes custom CSS variables from the document root, allowing theme.css defaults to take effect
 * @example
 * resetCSSVariables(); // Reverts to default theme
 */
export function resetCSSVariables(): void {
	// SSR safety check
	if (typeof document === 'undefined') {
		return;
	}

	try {
		const root = document.documentElement;
		for (const property of CSS_VARIABLE_NAMES) {
			root.style.removeProperty(property);
		}
	} catch (error) {
		console.error('Error resetting CSS variables:', error);
	}
}
