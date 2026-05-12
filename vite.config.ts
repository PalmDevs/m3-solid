import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import solid from 'vite-plugin-solid'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command }) => {
	const isServe = command === 'serve'

	return {
		plugins: [
			solid(),
			!isServe &&
				dts({
					insertTypesEntry: true,
				}),
			!isServe &&
				viteStaticCopy({
					targets: [
						{
							src: 'src/themes/*.css',
							dest: 'themes',
							rename: { stripBase: 2 },
						},
					],
				}),
		].filter(Boolean),
		root: isServe ? '.' : undefined,
		css: {
			modules: {
				generateScopedName: isServe
					? 'm3s-[name]__[local]__[hash:base64:5]'
					: 'm3s-[hash:base64:5]',
			},
		},
		build: isServe
			? undefined
			: {
					lib: {
						entry: resolve(__dirname, 'src/index.tsx'),
						name: 'M3Solid',
						formats: ['es'],
						fileName: () => 'index.js',
						cssFileName: 'styles',
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
