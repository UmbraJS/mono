import { umbra } from '@umbrajs/core'
import type { UmbraInput } from '@umbrajs/core'

// Default theme configuration matching useUmbra
const defaultThemeInput: UmbraInput = {
  foreground: '#080113',
  background: '#f3f6ea',
  accents: ['violet', 'red', 'green'],
  inversed: {
    foreground: '#f3f6ea',
    background: '#080113',
    accents: ['violet', 'red', 'green'],
  },
}

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<UmbraInput>('umbra-theme', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })

  // Use custom theme from cookie, or default theme
  const themeConfig = themeCookie.value || defaultThemeInput

  try {
    const theme = umbra(themeConfig)
    const output = theme.format()

    // Generate CSS variables string
    const cssVars = output.flattened
      .filter(({ name }) => !name.includes('background-text') && !name.includes('foreground-text'))
      .map(({ name, color }) => `${name}:${color};`)
      .join('')

    // Generate inverse theme CSS
    const inverseTheme = theme.inverse()
    const inverseOutput = inverseTheme.format()

    const inverseCssVars = inverseOutput.flattened
      .filter(({ name }) => !name.includes('background-text') && !name.includes('foreground-text'))
      .map(({ name, color }) => `${name}:${color};`)
      .join('')

    // Inject inline styles in the head with highest priority
    useHead({
      style: [
        {
          innerHTML: `:root{${cssVars}}.inverted-theme{${inverseCssVars}}`,
          tagPriority: -1, // Load before everything
        },
      ],
    })
  } catch (error) {
    console.error('[umbra-ssr] Failed to apply theme:', error)
  }
})
