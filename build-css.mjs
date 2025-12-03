import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildCSS() {
	console.log('Building CSS with Tailwind...');

	// Read the source theme.css
	const cssPath = join(__dirname, 'src', 'theme.css');
	const css = readFileSync(cssPath, 'utf-8');

	// Process through PostCSS with Tailwind
	const result = await postcss([tailwindcss]).process(css, {
		from: cssPath,
		to: join(__dirname, 'dist', 'theme.css')
	});

	// Ensure dist directory exists
	mkdirSync(join(__dirname, 'dist'), { recursive: true });

	// Write the processed CSS
	writeFileSync(join(__dirname, 'dist', 'theme.css'), result.css);

	console.log('✓ CSS built successfully to dist/theme.css');
}

buildCSS().catch((err) => {
	console.error('Error building CSS:', err);
	process.exit(1);
});
