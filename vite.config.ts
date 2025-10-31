import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./src/tests/setup.ts'],
		environmentOptions: {
			happyDOM: {
				settings: {
					disableCSSFileLoading: true
				}
			}
		},
		server: {
			deps: {
				inline: [/^(?!.*vitest).*\.svelte/]
			}
		},
		alias: {
			$app: './node_modules/@sveltejs/kit/src/runtime/app'
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/tests/',
				'**/*.config.*',
				'**/*.d.ts',
				'src/routes/**',
				'build/'
			]
		}
	},
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
