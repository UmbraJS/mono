import { myriad, randomMyriad, randomScheme, MyriadOutput } from "./engine/index"
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import { GenScheme, GenSchemeBasic, MyriadSettings, Myriad, GenColor } from './engine/store/types'
import { isDark, inverse } from './engine/primitives/scheme'

export {
  myriad,
  randomMyriad,
  randomScheme,
  getReadable,
  colorAlly,
  isDark,
  inverse
}

export type {
  Myriad,
  GenColor,
  GenScheme,
  GenSchemeBasic,
  MyriadSettings,
  MyriadOutput,
}