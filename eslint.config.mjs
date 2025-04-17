// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  // Enables stylistic/formatting rules
  stylistic: true,
  formatters: true,
  pnpm: true,
})
