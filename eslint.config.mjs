// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  // Enables stylistic/formatting rules
  stylistic: true,
  formatters: true,
  pnpm: true,
  overrides: {
    vue: {
      rules: {
        // ⬇ Force one attribute per line in templates
        'vue/max-attributes-per-line': [
          'error',
          {
            singleline: 1,
            multiline: 1,
          },
        ],
        // ⬇ Indent properly inside templates
        'vue/html-indent': ['error', 2],
      },
    },
  },
})
