import { UmbraInput, UmbraScheme, UmbraOutput, UmbraSettings, SettingType } from './types'

export let generated: UmbraOutput | null = null

export let settings: UmbraSettings = {
  readability: 4,
  iterations: 15,
  foreground: setting({ shade: [30, 60, 70]}),
  background: setting({ shade: [10, 17, 23]}),
  accents: setting(),
  shades: [35, 45, 55, 65, 75, 85],
}

function setting(passed?: SettingType) {
  return {
    shade: [35, 45, 55, 65, 75, 85],
    ...passed,
  }
}

export const defaultScheme: UmbraScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  },
  subSchemes: {}
}

export const defaultTheme: UmbraInput = {
  scheme: defaultScheme,
  settings,
}
