import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
	build: {
		lib: {
			name: 'Lib',
			entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
			formats: ['es'],
		},
		minify: false,
	},
})
