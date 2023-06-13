import type tinycolor from 'tinycolor2'

export interface DynamicObject {[key: number]: string}

export interface GenColor {
  color: string;
  contrast: string;
  shade: DynamicObject;
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface GenSchemeBasic {
  background?: GenColor,
  foreground?: GenColor,
  accents?: GenColor[],
} 

export interface GenScheme extends GenSchemeBasic {
  origin: MyriadInput,
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
  settings?: MyriadSettings,
  inversed?: MyriadInput,
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  subSchemes?: SubSchemes,
}

export interface AdjustedScheme extends MyriadAdjusted {
  origin: MyriadInput,
}

export type customColor = string | ((s: MyriadInput) => string)
export interface ColorList {
  [key: string]: customColor
}

export interface SettingType {
  shade?: number[]
}

export interface MyriadSettings {
  readability?: number
  iterations?: number
  foreground?: SettingType
  background?: SettingType
  accents?: SettingType
}