import { umbra, umbraHydrate } from './engine/index'
import type { Umbra } from './engine/index'
import { umbraGenerate } from './engine/generator'
import { randomScheme } from './engine/primitives/utils'
import { format, hex, rgb } from './engine/primitives/format'
import type { FlattenColor, Formater, UmbraOutputs } from './engine/primitives/format'

import { attach } from './engine/primitives/attach'
import { mostReadable, getReadability, colorMix } from './engine/primitives/color'
import type {
  UmbraScheme,
  UmbraInput,
  UmbraOutput,
  UmbraSettings,
  UmbraRange,
  FormatedRange
} from './engine/types'
import { inverse, isDark, findContrast } from './engine/primitives/scheme'

export {
  umbra,
  umbraGenerate,
  umbraHydrate,
  randomScheme,
  mostReadable,
  getReadability,
  colorMix,
  isDark,
  inverse,
  findContrast,
  attach,
  format,
  hex,
  rgb
}

export type {
  Umbra,
  UmbraScheme,
  UmbraSettings,
  UmbraInput,
  UmbraOutput,
  UmbraOutputs,
  UmbraRange,
  Formater,
  FlattenColor,
  FormatedRange
}
