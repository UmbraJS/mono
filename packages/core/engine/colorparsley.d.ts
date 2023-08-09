type ColorIn =
  | string
  | number
  | {
      r?: number
      red?: number
      g?: number
      green?: number
      b?: number
      blue?: number
      a?: number
      alpha?: number
      space?: string
      colorSpace?: string
      colorspace?: string
    }

declare module 'colorparsley' {
  export function colorParsley(colorIn: ColorIn): (string | number | boolean)[]
  export function colorToHex(rgba?: (string | number)[], allow3?: boolean): string
  export function colorToRGB(rgba?: (string | number)[], round?: boolean): string
}
