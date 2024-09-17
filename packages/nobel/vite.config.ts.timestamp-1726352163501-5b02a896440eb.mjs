// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/samue/source/repos/MyriadJS/core/node_modules/.pnpm/vite@5.4.3_@types+node@22.5.4_sass@1.78.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/samue/source/repos/MyriadJS/core/node_modules/.pnpm/@vitejs+plugin-vue@5.1.3_vite@5.4.3_vue@3.5.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Users/samue/source/repos/MyriadJS/core/node_modules/.pnpm/vite-plugin-dts@4.2.1_@types+node@22.5.4_typescript@5.5.4_vite@5.4.3/node_modules/vite-plugin-dts/dist/index.mjs";
import vueDevTools from "file:///C:/Users/samue/source/repos/MyriadJS/core/node_modules/.pnpm/vite-plugin-vue-devtools@7.4.4_vite@5.4.3_vue@3.5.4/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/samue/source/repos/MyriadJS/core/packages/nobel/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), dts(), vueDevTools()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", __vite_injected_original_import_meta_url)),
      formats: ["es"],
      name: "Nobel"
    },
    minify: false,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          Vue: "vue"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzYW11ZVxcXFxzb3VyY2VcXFxccmVwb3NcXFxcTXlyaWFkSlNcXFxcY29yZVxcXFxwYWNrYWdlc1xcXFxub2JlbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcc2FtdWVcXFxcc291cmNlXFxcXHJlcG9zXFxcXE15cmlhZEpTXFxcXGNvcmVcXFxccGFja2FnZXNcXFxcbm9iZWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NhbXVlL3NvdXJjZS9yZXBvcy9NeXJpYWRKUy9jb3JlL3BhY2thZ2VzL25vYmVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXHJcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFt2dWUoKSwgZHRzKCksIHZ1ZURldlRvb2xzKCldLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBsaWI6IHtcclxuICAgICAgZW50cnk6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvaW5kZXgudHMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgZm9ybWF0czogWydlcyddLFxyXG4gICAgICBuYW1lOiAnTm9iZWwnXHJcbiAgICB9LFxyXG4gICAgbWluaWZ5OiBmYWxzZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsndnVlJ10sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIFZ1ZTogJ3Z1ZSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFcsU0FBUyxlQUFlLFdBQVc7QUFFL1ksU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUxpTixJQUFNLDJDQUEyQztBQVExUixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNyQyxPQUFPO0FBQUEsSUFDTCxLQUFLO0FBQUEsTUFDSCxPQUFPLGNBQWMsSUFBSSxJQUFJLGtCQUFrQix3Q0FBZSxDQUFDO0FBQUEsTUFDL0QsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsS0FBSztBQUFBLE1BQ2hCLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
