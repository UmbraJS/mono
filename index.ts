import { myriad, subScheme, Myriad } from "./engine/index"
import { randomMyriad, randomScheme } from './engine/primitives/utils'
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import type { MyriadOutput, MyriadSettings, MyriadScheme, MyriadInput, GeneratedColor } from './engine/store/types'
import { inverse, isDark } from './engine/primitives/scheme'
import { apply } from './engine/primitives/distribution'

export {
  myriad,
  subScheme,
  randomMyriad,
  randomScheme,
  getReadable,
  colorAlly,
  isDark,
  inverse,
  apply,
}

export type {
  Myriad,
  MyriadInput,
  MyriadScheme,
  MyriadSettings,
  MyriadOutput,
  GeneratedColor,
}
