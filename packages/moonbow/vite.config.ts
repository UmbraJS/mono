import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ outDir: 'dist' })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Moonbow',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['gl-matrix']
    }
  }
})
