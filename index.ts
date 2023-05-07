import { myriad, subScheme, randomMyriad, randomScheme, MyriadOutput } from "./engine/index"
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import { GenScheme, GenSchemeBasic, MyriadSettings, Myriad, GenColor } from './engine/store/types'
import { isDark, inverse } from './engine/primitives/scheme'
import { attach } from './engine/primitives/distribution'

export {
  myriad,
  subScheme,
  randomMyriad,
  randomScheme,
  getReadable,
  colorAlly,
  isDark,
  inverse,
  attach,
}

export type {
  Myriad,
  GenColor,
  GenScheme,
  GenSchemeBasic,
  MyriadSettings,
  MyriadOutput,
}