import { umbra, umbraObject, subScheme, Umbra } from "./engine/index"
import { randomUmbra, randomScheme } from './engine/primitives/utils'
import { format, FlattenColor, Formater, UmbraOutputs, hexFormat, rgbStrippedFormat, hslFormat } from './engine/primitives/format'
import { attach } from './engine/primitives/attach'
import { getReadable } from './engine/primitives/color'
import type { 
  UmbraOutput, 
  UmbraSettings, 
  UmbraScheme, 
  UmbraInput, 
  GeneratedColor, 
  FormatedColor 
} from './engine/types'
import { inverse, isDark } from './engine/primitives/scheme'

export {
  umbra,
  umbraObject,
  subScheme,
  randomUmbra,
  randomScheme,
  getReadable,
  isDark,
  inverse,
  attach,
  format, 
  hexFormat, 
  rgbStrippedFormat, 
  hslFormat
}

export type {
  Umbra,
  UmbraInput,
  UmbraScheme,
  UmbraSettings,
  UmbraOutput,
  UmbraOutputs,
  GeneratedColor,
  FlattenColor,
  Formater,
  FormatedColor
}
