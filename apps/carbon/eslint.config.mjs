// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  rules: {
    // Use regular ESLint quotes rule instead of @stylistic/quotes
    'quotes': ['error', 'single'],
  },
}).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
})
