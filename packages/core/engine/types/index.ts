import type { Colord } from 'colord'
import type { Alias } from '../primitives/attach'
import type { Formater, UmbraOutputs } from '../primitives/format'

export interface UmbraRange {
  name: string
  background: Colord
  range: Colord[]
  foreground: Colord
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
  name: string
  color: string
  shades: (number | string)[]
  readability: number
}

export type UmbraInput = Partial<UmbraScheme>

export interface UmbraScheme extends UmbraColors {
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraColors {
  background: string
  foreground: string
  accents: string | string[]
}

export interface UmbraAdjusted {
  background: Colord
  foreground: Colord
  accents: string[]
}

export interface UmbraSettings {
  power?: number
  iterations?: number
  readability?: number
  insertion?: number
  aliases?: Alias | true
  shades?: (number | string)[]
  tints?: (number | string)[]
  callback?: (props: UmbraOutputs) => void
  formater?: Formater
}
