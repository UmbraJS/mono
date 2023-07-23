import { MyriadInput, MyriadScheme, MyriadOutput, MyriadSettings, SettingType } from './types'

export let generated: MyriadOutput | null = null

export let settings: MyriadSettings = {
  readability: 21,
  iterations: 15,
  foreground: setting({ shade: [17, 27, 40]}),
  background: setting({ shade: [4, 8, 17]}),
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
