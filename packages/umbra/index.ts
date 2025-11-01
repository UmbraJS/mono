import { umbra, umbraHydrate } from './engine/index'
import type { Umbra } from './engine/index'
import { umbraGenerate } from './engine/generator'
import { randomScheme } from './engine/primitives/utils'
import { format, hex, rgb } from './engine/primitives/format'
import type { FlattenColor, Formater, UmbraOutputs } from './engine/primitives/format'
import { generateTints, resolveTints, easingFunctions } from './engine/easing'
import type { EasingType, EasingOptions, TintsInput } from './engine/easing'
import { defaultSettings } from './engine/defaults'
import { colorPresets, getPresetByName, findClosestPreset, resolveColorPreset } from './engine/presets'
import type { ColorPreset, PresetName, ColorString } from './engine/presets'

import { attach } from './engine/primitives/attach'
import { mostReadable, getReadability, colorMix } from './engine/primitives/color'
import type {
  Accent,
  UmbraScheme,
  UmbraInput,
  UmbraOutput,
  UmbraSettings,
  UmbraRange,
  FormatedRange,
  StableScheme,
  StableAccent,
  ValidationWarning
} from './engine/types'
import { inverse, isDark, findContrast } from './engine/primitives/scheme'

// Import swatch functionality
import { swatch, UmbraSwatch, extend, getFormat, random } from './swatch'
import type {
  Plugin,
  HslColor,
  HslaColor,
  HsvColor,
  HsvaColor,
  HwbColor,
  HwbaColor,
  LabColor,
  LabaColor,
  LchColor,
  LchaColor,
  RgbColor,
  RgbaColor,
  XyzColor,
  XyzaColor,
  AnyColor,
} from './swatch'

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
  generateTints,
  resolveTints,
  easingFunctions,
  defaultSettings,
  hex,
  rgb,
  // Export color presets
  colorPresets,
  getPresetByName,
  findClosestPreset,
  resolveColorPreset,
  // Export swatch functionality
  swatch,
  UmbraSwatch,
  extend,
  getFormat,
  random
}

export type {
  Accent,
  Umbra,
  UmbraScheme,
  UmbraSettings,
  UmbraInput,
  UmbraOutput,
  UmbraOutputs,
  UmbraRange,
  Formater,
  FlattenColor,
  FormatedRange,
  StableScheme,
  StableAccent,
  ValidationWarning,
  EasingType,
  EasingOptions,
  TintsInput,
  ColorPreset,
  PresetName,
  ColorString,
  // Export swatch types
  Plugin,
  HslColor,
  HslaColor,
  HsvColor,
  HsvaColor,
  HwbColor,
  HwbaColor,
  LabColor,
  LabaColor,
  LchColor,
  LchaColor,
  RgbColor,
  RgbaColor,
  XyzColor,
  XyzaColor,
  AnyColor,
}
