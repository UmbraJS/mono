import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts(), vueDevTools()],
  resolve: {
    alias: [
      {
        find: /^umbraco\/(.*)$/,
        replacement: fileURLToPath(new URL('../../packages/umbraco/$1', import.meta.url))
      },
      {
        find: 'umbraco',
        replacement: fileURLToPath(new URL('../../packages/umbraco/index.ts', import.meta.url))
      },
      {
        find: '@umbrajs/dye',
        replacement: fileURLToPath(new URL('../../packages/dye', import.meta.url))
      }
    ],
    dedupe: ['vue'],
  },
  optimizeDeps: {
    exclude: ['umbraco'] // Prevent Vite from pre-bundling umbraco during development
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      name: 'Nobel',
    },
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          Vue: 'vue',
        },
      },
    },
  },
})
