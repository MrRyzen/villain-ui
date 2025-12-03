import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Preprocess with Vite for TypeScript and CSS support
	preprocess: vitePreprocess(),

	compilerOptions: {
		// Component library settings for Svelte 5
	}
};
