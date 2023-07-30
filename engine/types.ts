import type tinycolor from 'tinycolor2'
import type { Alias } from './primitives/attach'

export interface FormatedColor {
  name: string;
  color: string;
  contrast: string;
  shades: string[];
}

export interface ColorObject {
  color: tinycolor.Instance;
  contrast: tinycolor.Instance;
  shades: tinycolor.Instance[];
}

export interface GeneratedColor extends ColorObject {
  name: string;
}

export interface UmbraOutput {
  input: UmbraInput;
  adjusted: UmbraAdjusted;
  generated: GeneratedColor[];
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface UmbraColors {
  colors: GeneratedColor[];
  input: UmbraInput,
  adjusted: UmbraAdjusted,
}

type SubSchemes = {
  [key: string]: UmbraInput
}

export interface UmbraScheme {
  background: string,
  foreground: string,
  accents: string[],
  custom?: ColorList
  subSchemes?: SubSchemes,
}

export interface UmbraInput {
  scheme: UmbraScheme,
  settings: UmbraSettings,
  inversed?: UmbraInput,
}

export interface UmbraAdjusted {
  background: tinycolor.Instance,
  foreground: tinycolor.Instance,
  accents: tinycolor.Instance[],
  subSchemes?: SubSchemes,
  input: UmbraInput,
}

export type CustomColor = string | ((s: UmbraInput) => string)
export interface ColorList {
  [key: string]: CustomColor
}

export type Shade = number | string

export interface SettingType {
  shade?: Shade[]
}

export interface UmbraSettings {
  readability?: number
  iterations?: number
  foreground?: SettingType
  background?: SettingType
  accents?: SettingType
  aliases?: Alias | true
}
