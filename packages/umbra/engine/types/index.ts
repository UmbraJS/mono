import type { UmbraSwatch } from '../../swatch'
import type { Alias } from '../primitives/attach'
import type { Formater, UmbraOutputs } from '../primitives/format'
import type { TintsInput } from '../easing'
import type { ColorString } from '../presets'

export interface UmbraRange {
  name: string
  background: UmbraSwatch
  range: UmbraSwatch[]
  foreground: UmbraSwatch
}

export interface FormatedRange {
  name: string
  background: string
  shades: string[]
  foreground: string
}

export interface UmbraOutput {
  input: UmbraInput
  adjusted: UmbraAdjusted
  generated: UmbraRange[]
}

export interface Accent {
  name?: string
  color?: ColorString
  range?: TintsInput     // Used for both light-to-dark and dark-to-light
  shades?: TintsInput    // Dark-to-light range (falls back to range)
  tints?: TintsInput     // Light-to-dark range (falls back to range)
  readability?: number
}

export type UmbraInput = Partial<UmbraScheme>

export interface UmbraScheme extends UmbraColors {
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraColors {
  background: ColorString
  foreground: ColorString
  accents: ColorString | (ColorString | Accent)[]
}

export interface UmbraAdjusted {
  background: UmbraSwatch
  foreground: UmbraSwatch
  accents: (string | Accent)[]
}

export interface UmbraSettings {
  power?: number
  iterations?: number
  readability?: number
  insertion?: number
  aliases?: Alias | true
  shades?: TintsInput
  tints?: TintsInput
  callback?: (props: UmbraOutputs) => void
  formater?: Formater
}
