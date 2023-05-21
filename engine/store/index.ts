import { MyriadInput, GenScheme, MyriadSettings, SettingType } from './types'

export let generated: GenScheme | null = null

export let settings: MyriadSettings = {
  readability: 11,
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

export const defaultScheme: MyriadInput = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  },
  subSchemes: {}
}
