import type { Colord } from 'colord'
import type { Alias } from '../primitives/attach'
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
  name?: string
  color?: string
  shades?: (number | string)[]
  readability?: number
}

export interface UmbraInput {
  background?: string
  foreground?: string
  accents?: (Accent | string)[]
  settings?: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraScheme {
  background: string
  foreground: string
  accents: (Accent | string)[]
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraAdjusted {
  background: Colord
  foreground: Colord
  accents: (Accent | string)[]
}

export interface UmbraSettings {
  power?: number
  iterations?: number
  readability?: number
  insertion?: number
  aliases?: Alias | true
  shades?: (number | string)[]
  tints?: (number | string)[]
}
