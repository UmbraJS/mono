import tinycolor from "tinycolor2"

export type DynamicObject = {[key: number]: string}

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

type subSchemes = {
  [key: string]: MyriadInput
}

export interface MyriadInput {
  background?: string,
  foreground?: string,
  accents?: string[],
  custom?: ColorList
  subSchemes?: subSchemes,
  inverse?: MyriadInput,
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  subSchemes?: subSchemes,
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