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
  origin: Myriad,
}

type subSchemes = {
  [key: string]: Myriad
}

export interface Myriad {
  background?: string,
  foreground?: string,
  accents?: string[],
  custom?: ColorList
  subSchemes?: subSchemes,
  inverse?: Myriad,
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  subSchemes?: subSchemes,
}

export interface AdjustedScheme extends MyriadAdjusted {
  origin: Myriad,
}

export type customColor = string | ((s: Myriad) => string)
export interface ColorList {
  [key: string]: customColor
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export interface SettingType {
  shade?: Range<0, 51>[]
}

export interface MyriadSettings {
  element?: HTMLElement
  readability?: number
  iterations?: number
  foreground?: SettingType
  background?: SettingType
  accents?: SettingType
}