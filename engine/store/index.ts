import { MyriadInput, MyriadScheme, MyriadGenerated, MyriadSettings, SettingType } from './types'

export let generated: MyriadGenerated | null = null

export let settings: MyriadSettings = {
  readability: 21,
  iterations: 15,
  foreground: setting({ shade: [20, 50]}),
  background: setting({ shade: [10, 30]}),
  accents: setting(),
}

export function changeSettings(newSettings: MyriadSettings) {
  settings = {
    ...settings,
    ...newSettings,
  }
}

function setting(passed?: SettingType) {
  return {
    shade: undefined,
    ...passed,
  }
}

export const defaultScheme: MyriadScheme = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  },
  subSchemes: {}
}


export const defaultTheme: MyriadInput = {
  scheme: defaultScheme,
  settings,
}
