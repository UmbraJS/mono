// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  rules: {
    // Use regular ESLint quotes rule instead of @stylistic/quotes
    'quotes': ['error', 'single'],
    // Disable the "Expected an assignment or function call" rule
    'no-unused-expressions': 'off',
  },
}).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
})
