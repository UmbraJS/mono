// @ts-check
import withNuxt from './apps/hub/.nuxt/eslint.config.mjs'

export default withNuxt().overrideRules({
  // Your custom configs here
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
  'vue/no-multiple-template-root': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/attribute-hyphenation': 'off',
  'vue/html-self-closing': 'off',
  '@stylistic/arrow-parens': 'off',
  '@stylistic/semi': 'off',
  '@stylistic/comma-dangle': 'off',
})
