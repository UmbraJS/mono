import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts(), vueDevTools()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./index.ts', import.meta.url)),
      formats: ['es'],
      name: 'Nobel',
      fileName: () => 'index',
    },
    minify: false,
    rollupOptions: {
      external: ['vue', 'gsap', '@vueuse/core'],
      output: {
        entryFileNames: 'index.js',
        globals: {
          vue: 'vue',
          gsap: 'gsap',
          '@vueuse/core': 'VueUse',
        },
      },
    },
  },
})
