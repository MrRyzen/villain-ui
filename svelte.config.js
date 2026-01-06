import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/vite-plugin-svelte').SvelteConfig} */
export default {
	// Use both preprocessors: svelte-preprocess for PostCSS/Tailwind, vitePreprocess for dev
	preprocess: [
		sveltePreprocess({
			postcss: true
		}),
		vitePreprocess()
	],

	compilerOptions: {
		// Component library settings for Svelte 5
	}
};
