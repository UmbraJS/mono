import { umbra } from '../packages/umbra/index.js'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join } from 'path'

// Match the default theme from packages/umbraco/composables/useUmbra.ts
const defaultThemeInput = {
  foreground: '#080113',
  background: '#f3f6ea',
  accents: ['violet', 'red', 'green'],
  inversed: {
    foreground: '#f3f6ea',
    background: '#080113',
    accents: ['violet', 'red', 'green'],
  },
}

console.log('🎨 Generating Umbra default theme CSS...')

const theme = umbra(defaultThemeInput)
const output = theme.format()

// Generate CSS variables for default (light) theme
const defaultCssVars = output.flattened
  .filter(({ name }) => !name.includes('background-text') && !name.includes('foreground-text'))
  .map(({ name, color }) => `  ${name}: ${color};`)
  .join('\n')

// Generate inverse theme CSS
const inverseTheme = theme.inverse()
const inverseOutput = inverseTheme.format()

const inverseCssVars = inverseOutput.flattened
  .filter(({ name }) => !name.includes('background-text') && !name.includes('foreground-text'))
  .map(({ name, color }) => `  ${name}: ${color};`)
  .join('\n')

// Create CSS with both light and dark themes
const css = `:root {
${defaultCssVars}
}

.inverted-theme {
${inverseCssVars}
}
`

// Write to apps/blog/public directory
const outputDir = fileURLToPath(new URL('../apps/blog/public', import.meta.url))
const outputPath = join(outputDir, 'umbra-default.css')

try {
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, css)
  console.log('✅ Generated default Umbra CSS at:', outputPath)
  console.log(`   Generated ${output.flattened.length} CSS variables`)
} catch (error) {
  console.error('❌ Failed to generate Umbra CSS:', error)
  process.exit(1)
}
