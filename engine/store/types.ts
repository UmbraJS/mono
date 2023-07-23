import type tinycolor from 'tinycolor2'
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

export interface MyriadOutput {
  input: MyriadInput;
  adjusted: MyriadAdjusted;
  generated: GeneratedColor[];
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface MyriadColors {
  colors: GeneratedColor[];
  input: MyriadInput,
  adjusted: MyriadAdjusted,
}

type SubSchemes = {
  [key: string]: MyriadInput
}

export interface MyriadScheme {
  background: string,
  foreground: string,
  accents: string[],
  custom?: ColorList
  subSchemes?: SubSchemes,
}

export interface MyriadInput {
  scheme: MyriadScheme,
  settings: MyriadSettings,
  inversed?: MyriadInput,
}

export interface MyriadAdjusted {
  background: tinycolor.Instance,
  foreground: tinycolor.Instance,
  accents: tinycolor.Instance[],
  subSchemes?: SubSchemes,
  input: MyriadInput,
}

export type CustomColor = string | ((s: MyriadInput) => string)
export interface ColorList {
  [key: string]: CustomColor
}

export type Shade = number | string

export interface SettingType {
  shade?: Shade[]
}

export interface MyriadSettings {
  readability?: number
  iterations?: number
  foreground?: SettingType
  background?: SettingType
  accents?: SettingType
}