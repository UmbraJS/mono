import { myriad, subScheme, randomMyriad, randomScheme, MyriadOutput } from "./engine/index"
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import type { MyriadGenerated, GeneratedScheme, MyriadSettings, MyriadScheme, MyriadInput, GeneratedColor } from './engine/store/types'
import { inverse, isDark } from './engine/primitives/scheme'
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
  MyriadInput,
  MyriadOutput,
  MyriadScheme,
  MyriadSettings,
  MyriadGenerated,
  GeneratedScheme,
  GeneratedColor,
}
