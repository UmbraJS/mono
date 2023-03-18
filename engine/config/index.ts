import tinycolor from "tinycolor2"

export interface GenColor {
  color: string;
  shade: string;
  shade2: string;
  contrast: string;
}

export interface MyriadOutput {
  background?: GenColor,
  foreground?: GenColor,
  accents?: GenColor[],
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
  subSchemes?: {
    [key: string]: Myriad
  }
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
  readability: 2,

  subSchemes: {},
  custom: {
    success: '#00ff00',
    error: '#ff0000',
  }
}
