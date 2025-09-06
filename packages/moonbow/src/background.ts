// Background color utilities for Moonbow

export type BackgroundColor =
  | [number, number, number, number?] // RGBA array
  | { r: number; g: number; b: number; a?: number } // RGBA object
  | string // Hex string like "#FF0000" or "red"

/**
 * Converts various color formats to GPUColor
 */
export function toGPUColor(color: BackgroundColor): GPUColor {
  if (Array.isArray(color)) {
    return {
      r: color[0],
      g: color[1],
      b: color[2],
      a: color[3] ?? 1.0
    }
  }

  if (typeof color === 'object') {
    return {
      r: color.r,
      g: color.g,
      b: color.b,
      a: color.a ?? 1.0
    }
  }

  if (typeof color === 'string') {
    return parseColorString(color)
  }

  // Default fallback
  return { r: 0.15, g: 0.15, b: 0.25, a: 1.0 }
}

/**
 * Parses color strings like "#FF0000", "rgb(255,0,0)", or named colors
 */
function parseColorString(colorString: string): GPUColor {
  const color = colorString.toLowerCase().trim()

  // Named colors
  const namedColors: Record<string, GPUColor> = {
    black: { r: 0, g: 0, b: 0, a: 1 },
    white: { r: 1, g: 1, b: 1, a: 1 },
    red: { r: 1, g: 0, b: 0, a: 1 },
    green: { r: 0, g: 1, b: 0, a: 1 },
    blue: { r: 0, g: 0, b: 1, a: 1 },
    yellow: { r: 1, g: 1, b: 0, a: 1 },
    cyan: { r: 0, g: 1, b: 1, a: 1 },
    magenta: { r: 1, g: 0, b: 1, a: 1 },
    orange: { r: 1, g: 0.5, b: 0, a: 1 },
    purple: { r: 0.5, g: 0, b: 0.5, a: 1 },
    pink: { r: 1, g: 0.75, b: 0.8, a: 1 },
    gray: { r: 0.5, g: 0.5, b: 0.5, a: 1 },
    grey: { r: 0.5, g: 0.5, b: 0.5, a: 1 }
  }

  if (namedColors[color]) {
    return namedColors[color]
  }

  // Hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1)

    if (hex.length === 3) {
      // #RGB -> #RRGGBB
      return {
        r: parseInt(hex[0] + hex[0], 16) / 255,
        g: parseInt(hex[1] + hex[1], 16) / 255,
        b: parseInt(hex[2] + hex[2], 16) / 255,
        a: 1.0
      }
    }

    if (hex.length === 6) {
      // #RRGGBB
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: 1.0
      }
    }

    if (hex.length === 8) {
      // #RRGGBBAA
      return {
        r: parseInt(hex.slice(0, 2), 16) / 255,
        g: parseInt(hex.slice(2, 4), 16) / 255,
        b: parseInt(hex.slice(4, 6), 16) / 255,
        a: parseInt(hex.slice(6, 8), 16) / 255
      }
    }
  }

  // RGB/RGBA functions
  const rgbMatch = color.match(/rgba?\s*\(\s*([^)]+)\s*\)/)
  if (rgbMatch) {
    const values = rgbMatch[1].split(',').map((v) => parseFloat(v.trim()))
    return {
      r: values[0] / 255,
      g: values[1] / 255,
      b: values[2] / 255,
      a: values[3] ?? 1.0
    }
  }

  // Default fallback
  return { r: 0.15, g: 0.15, b: 0.25, a: 1.0 }
}

/**
 * Common background color presets
 */
export const BackgroundColors = {
  // Dark themes
  darkBlue: { r: 0.15, g: 0.15, b: 0.25, a: 1.0 },
  darkGray: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
  black: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },

  // Light themes
  white: { r: 1.0, g: 1.0, b: 1.0, a: 1.0 },
  lightGray: { r: 0.95, g: 0.95, b: 0.95, a: 1.0 },

  // Colored themes
  deepBlue: { r: 0.0, g: 0.1, b: 0.2, a: 1.0 },
  forestGreen: { r: 0.0, g: 0.2, b: 0.1, a: 1.0 },
  warmBrown: { r: 0.2, g: 0.1, b: 0.0, a: 1.0 },

  // Cinematic
  filmNoir: { r: 0.05, g: 0.05, b: 0.05, a: 1.0 },
  goldHour: { r: 0.3, g: 0.2, b: 0.1, a: 1.0 },

  // Gradients (single color, but can be used as base)
  sunset: { r: 1.0, g: 0.4, b: 0.1, a: 1.0 },
  ocean: { r: 0.0, g: 0.3, b: 0.6, a: 1.0 },

  // Default moonbow color
  default: { r: 0.15, g: 0.15, b: 0.25, a: 1.0 }
} as const
