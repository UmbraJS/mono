import tinycolor from "tinycolor2"

export type DynamicObject = {[key: number]: string}

export interface GenColor {
  color: string;
  contrast: string;
  shade: DynamicObject;
}

export type SchemeKey = 'foreground' | 'background' | 'accents' | string

export interface MyriadOutputBasic {
  background?: GenColor,
  foreground?: GenColor,
  accents?: GenColor[],
} 

export interface MyriadOutput extends MyriadOutputBasic {
  origin: Myriad,
}

type subSchemes = {
  [key: string]: Myriad
}

export interface Myriad {
  background?: string,
  foreground?: string,
  accents?: string[],
  generated?: MyriadOutput | null,
  readability?: number,
  subSchemes?: subSchemes,
  custom?: ColorList
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  generated?: any,
  readability?: number,
  subSchemes?: subSchemes,
}

export interface AdjustedScheme extends MyriadAdjusted {
  origin: Myriad,
}

export type customColor = string | ((s: Myriad) => string)
export interface ColorList {
  [key: string]: customColor
}

export const defaultScheme: Myriad = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  
  generated: null,
  readability: 11,

  subSchemes: {},
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  }
}
