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

export interface UmbraScheme {
  background: string
  foreground: string
  accents: (Accent | string)[]
}

export interface UmbraInput {
  scheme: UmbraScheme
  settings: UmbraSettings
  inversed?: UmbraInput
}

export interface UmbraAdjusted {
  background: Colord
  foreground: Colord
  accents: (Accent | string)[]
}

export interface DehydratedAdjusted {
  background: string
  foreground: string
  accents: (Accent | string)[]
  input: UmbraInput
}

export interface UmbraSettings {
  readability?: number
  iterations?: number
  aliases?: Alias | true
  shades?: (number | string)[]
  tints?: (number | string)[]
}
