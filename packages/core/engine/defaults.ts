import type { UmbraScheme, UmbraSettings } from './types'

export const defaultSettings: UmbraSettings = {
  readability: 70,
  insertion: 9,
  shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25],
  tints: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25]
}

export const defaultScheme: UmbraScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  settings: defaultSettings,
  inversed: {
    background: '#ff5555',
    foreground: '#090233',
    accents: ['#5200ff']
  }
}
