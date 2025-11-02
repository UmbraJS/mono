import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: [
      {
        find: /^umbraco\/(.*)$/,
        replacement: fileURLToPath(new URL('../../packages/umbraco/$1', import.meta.url)),
      },
      {
        find: 'umbraco',
        replacement: fileURLToPath(new URL('../../packages/umbraco/index.ts', import.meta.url)),
      },
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
    dedupe: ['vue'],
  },
  optimizeDeps: {
    exclude: ['umbraco'],
  },
})
