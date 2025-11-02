import type { UmbraScheme, UmbraSettings } from './types'

export const defaultSettings: UmbraSettings = {
  readability: 70,
  insertion: 9,
  range: {
    light: [3, 9, 13, 17, 20, 25, 30, 41, 46, 51, 74, 94],
    dark: [5, 9, 13, 17, 20, 25, 30, 41, 46, 51, 74, 94],
  },
}

const warningAccent = {
  name: 'warning',
  color: '#ff0000'
}

const successAccent = {
  name: 'success',
  color: '#00ff00'
}

export const defaultScheme: UmbraScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ["#ffffff", warningAccent, successAccent],
  settings: defaultSettings,
  inversed: {
    background: '#ff5555',
    foreground: '#090233',
    accents: ['#5200ff']
  }
}
