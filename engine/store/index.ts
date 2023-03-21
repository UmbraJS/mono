import { Myriad, MyriadOutput } from './types'

interface SettingType {
  shade?: number[]
}

export interface SettingsType {
  readability: number
  foreground: SettingType
  background: SettingType
  accents: SettingType
}

export let generated: MyriadOutput | null = null

export function changeSettings(newSettings: SettingsType) {
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

export let settings: SettingsType = {
  readability: 11,
  foreground: setting({ shade: [20, 50]}),
  background: setting({ shade: [10, 30]}),
  accents: setting(),
}

export const defaultScheme: Myriad = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  },
  subSchemes: {}
}
