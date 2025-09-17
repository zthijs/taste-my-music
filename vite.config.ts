import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	ssr: {
		noExternal: ['bits-ui', '@internationalized/*']
	},
	optimizeDeps: {
		include: ['bits-ui']
	},
	build: {
		modulePreload: {
			polyfill: true
		},
		rollupOptions: {
			output: {
				manualChunks: {
					'ui-components': [
						'./src/lib/components/ui/card/card.svelte',
						'./src/lib/components/ui/button/button.svelte',
						'./src/lib/components/ui/skeleton/skeleton.svelte'
					]
				}
			}
		}
	}
});
