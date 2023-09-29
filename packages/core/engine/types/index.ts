import type { Colord } from 'colord'
import type { Alias } from '../primitives/attach'
export interface RawRange {
  name: string
  background: Colord
  shades: Colord[]
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
  ranges: RawRange[]
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface UmbraColors {
  colors: RawRange[]
  input: UmbraInput
  adjusted: UmbraAdjusted
}

export type AccentRange = string | (number | string)[]

export interface Accent {
  name?: string
  value: AccentRange
  readability?: number
}

export interface AdjustedAccent {
  name?: string
  value: Colord
  shades?: Shade[]
  readability: number
}
export interface UmbraScheme {
  background: string
  foreground: string
  accents: (Accent | string)[]
  custom?: ColorList
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
  input: UmbraInput
}

export type CustomColor = string | ((s: UmbraInput) => string)

export interface ColorList {
  [key: string]: CustomColor
}

export type Shade = number | string

export interface UmbraSettings {
  readability?: number
  iterations?: number
  aliases?: Alias | true
  shades?: Shade[]
}
