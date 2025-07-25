import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath, URL } from 'node:url';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { 
		adapter: adapter(),
		alias: {
			$assets: fileURLToPath(new URL('./src/assets', import.meta.url))
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
