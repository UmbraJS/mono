import { UmbraScheme, UmbraSettings } from './types'

export const defaultSettings: UmbraSettings = {
  readability: 10,
  iterations: 15,
  shades: [5, 10, 10, 10, 25, 25, 25, 25, 45, 45, 45, 45],
  tints: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25]
}

export const defaultScheme: UmbraScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff']
}
