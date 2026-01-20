import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import solid from 'vite-plugin-solid'

export default defineConfig(({ command }) => {
	const isServe = command === 'serve'

	return {
		plugins: [
			solid(),
			!isServe &&
				dts({
					insertTypesEntry: true,
				}),
		].filter(Boolean),
		root: isServe ? '.' : undefined,
		build: isServe
			? undefined
			: {
					lib: {
						entry: resolve(__dirname, 'src/index.ts'),
						name: 'M3Solid',
						formats: ['es'],
						fileName: () => 'index.js',
					},
					rollupOptions: {
						external: ['solid-js', 'solid-js/web', 'solid-js/store'],
						output: {
							globals: {
								'solid-js': 'solid',
							},
						},
					},
				},
	}
})
