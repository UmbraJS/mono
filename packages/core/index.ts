import { umbra, umbraHydrate, Umbra } from './engine/index'
import { umbraGenerate } from './engine/generator'
import { randomScheme } from './engine/primitives/utils'
import {
  format,
  FlattenColor,
  Formater,
  UmbraOutputs,
  hexFormat,
  rgbStrippedFormat,
  hslFormat
} from './engine/primitives/format'
import { attach } from './engine/primitives/attach'
import { mostReadable, colorMix } from './engine/primitives/color'
import type {
  UmbraOutput,
  UmbraSettings,
  UmbraInput,
  UmbraRange,
  FormatedRange
} from './engine/types'
import { inverse, isDark, findContrast } from './engine/primitives/scheme'
import { dehydrateOutput, hydrateOutput } from './engine/hydration'

export {
  umbra,
  umbraGenerate,
  umbraHydrate,
  randomScheme,
  mostReadable,
  colorMix,
  isDark,
  inverse,
  findContrast,
  attach,
  format,
  hexFormat,
  rgbStrippedFormat,
  hslFormat,
  dehydrateOutput,
  hydrateOutput
}

export type {
  Umbra,
  UmbraInput,
  UmbraSettings,
  UmbraOutput,
  UmbraOutputs,
  UmbraRange,
  FlattenColor,
  Formater,
  FormatedRange
}
