import type tinycolor from 'tinycolor2'

export interface DynamicObject {[key: number]: tinycolor.Instance}

export interface GeneratedColor {
  color: tinycolor.Instance;
  contrast: tinycolor.Instance;
  shades: DynamicObject;
}

export interface FormatedColor {
  color: string;
  contrast: string;
  shades: string[];
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface GeneratedScheme {
  background?: GeneratedColor,
  foreground?: GeneratedColor,
  accents?: GeneratedColor[],
} 

export interface MyriadGenerated extends GeneratedScheme {
  input: MyriadInput,
  adjusted: MyriadAdjusted,
}

type SubSchemes = {
  [key: string]: MyriadInput
}

export interface MyriadScheme {
  background?: string,
  foreground?: string,
  accents?: string[],
  custom?: ColorList
  subSchemes?: SubSchemes,
}

export interface MyriadInput {
  scheme: MyriadScheme,
  settings: MyriadSettings,
  inversed?: MyriadInput,
}

export interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
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