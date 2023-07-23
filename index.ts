import { myriad, myriadObject, subScheme, Myriad } from "./engine/index"
import { randomMyriad, randomScheme } from './engine/primitives/utils'
import { format, FlattenColor, Formater, hexFormat, rgbStrippedFormat, hslFormat } from './engine/primitives/apply/format'
import { attach } from './engine/primitives/apply/attach'
import { getReadable } from './engine/primitives/color'
import { colorAlly } from './engine/plugins/diagnostics'
import type { 
  MyriadOutput, 
  MyriadSettings, 
  MyriadScheme, 
  MyriadInput, 
  GeneratedColor, 
  FormatedColor 
} from './engine/store/types'
import { inverse, isDark } from './engine/primitives/scheme'
import { apply } from './engine/primitives/apply'

export {
  myriad,
  myriadObject,
  subScheme,
  randomMyriad,
  randomScheme,
  getReadable,
  colorAlly,
  isDark,
  inverse,
  apply,
  attach,
  format, 
  hexFormat, 
  rgbStrippedFormat, 
  hslFormat
}

export type {
  Myriad,
  MyriadInput,
  MyriadScheme,
  MyriadSettings,
  MyriadOutput,
  GeneratedColor,
  FlattenColor,
  Formater,
  FormatedColor
}
