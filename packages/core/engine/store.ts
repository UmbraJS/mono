import { UmbraInput, UmbraScheme, UmbraOutput, UmbraSettings } from './types'

export let generated: UmbraOutput | null = null

export let settings: UmbraSettings = {
  readability: 10,
  iterations: 15,
  shades: [25, 25, 25, 25, 25, 25]
}

export const defaultScheme: UmbraScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    success: '#00ff00',
    error: '#ff0000'
  }
}

export const defaultTheme: UmbraInput = {
  scheme: defaultScheme,
  settings
}
