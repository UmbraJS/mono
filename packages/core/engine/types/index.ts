import type { UmbraSwatch } from '../../swatch'
import type { Alias } from '../primitives/attach'
import type { Formater, UmbraOutputs } from '../primitives/format'
import type { TintsInput } from '../easing'

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
  color: string
  shades?: TintsInput
  tints?: TintsInput
  readability?: number
}

export type UmbraInput = Partial<UmbraScheme>

export interface UmbraScheme extends UmbraColors {
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraColors {
  background: string
  foreground: string
  accents: string | (string | Accent)[]
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
