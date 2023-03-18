// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({
    outputDir: 'dist/types',
  })],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      name: 'myriad',
      fileName: 'myriad',
    },
  }
})