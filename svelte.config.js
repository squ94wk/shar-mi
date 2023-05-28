import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		preprocess({
			scss: {
				prependData: '@use "src/variables.scss" as *;',
			},
		}),
	],

	kit: {
		adapter: adapter({
			// ignore "routes are dynamic" error
			strict: false,
			// required to generate an index.html
			fallback: 'index.html',
		}),
		paths: {
			base: dev ? '' : process.env.BASE_PATH,
		},
	}
};

export default config;
