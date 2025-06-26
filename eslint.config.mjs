// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  // Enables stylistic/formatting rules
  stylistic: true,
  formatters: true,
  pnpm: true,
  // Ignore apps and packages that have their own ESLint configs or are not meant to be linted
  ignores: [
    'apps/carbon/**/*',
    'apps/hub/**/*',
    'apps/ui/**/*',
    'packages/carbon/**/*',
    'packages/core/**/*',
    'packages/dye/**/*',
    'packages/nobel/**/*',
    'packages/richtext/**/*',
    // Ignore config and documentation files that don't need TypeScript parsing
    '**/*.md',
    '**/README.md',
    'pnpm-workspace.yaml',
  ],
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
