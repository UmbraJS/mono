import type { UmbraShade, TintsInput } from './easing'
import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'

// Shared tints and shades arrays
const TINTS_GRAY = [2, 5, 8, 11, 13, 17, 24, 34, 'primer', 42, 46, 58] as const;
const SHADES_GRAY = TINTS_GRAY;

const evenContrastDark = [
  { mix: 15, hue: "next", saturation: "+=99" },
  { mix: 20, hue: "next", saturation: "+=99" },
  { mix: 25, hue: "next", saturation: "+=99" },
  { mix: 32, hue: "next", saturation: "+=99" },
  { mix: 42, hue: "next", saturation: "+=99" },
  { mix: 52, hue: "next", saturation: "+=99" },
  { mix: 66, hue: "next", saturation: "+=99" },
  { mix: 81, hue: "next", saturation: "+=99" },
  "primer",
  { mix: "+=16", hue: "prev", saturation: "-=99" },
  { mix: "+=22", hue: "prev", saturation: "-=92" },
  { mix: "+=21", hue: "prev", saturation: "-=99" }
] as const;

const evenContrastLight = [
  { mix: 5, hue: "next" },
  { mix: 8, hue: "next", saturation: "+=99" },
  14, 24, 35, 49, 68, 88,
  "primer",
  { mix: "+=15", hue: 0, saturation: "-=4" },
  { mix: "+=10", hue: 0, saturation: "-=12" },
  { mix: "+=10", hue: 0, saturation: "-=29" }
] as const;

const orangeContrastLight = [
  { mix: 2, hue: "next+=0.5", saturation: "+=99" },
  { mix: 9, hue: "next+=10", saturation: "+=99" },
  { mix: 18, hue: "next+=14", saturation: "+=99" },
  { mix: 31, hue: "next+=11", saturation: "+=99" },
  { mix: 42, hue: "next+=10", saturation: "+=99" },
  { mix: 54, hue: "next+=7", saturation: "+=99" },
  { mix: 61, hue: "next+=4", saturation: "+=99" },
  { mix: 79, hue: "next+=2", saturation: "+=99" },
  "primer",
  { mix: "+=12", hue: 0, saturation: "-=4" },
  { mix: "+=2", hue: 0, saturation: "-=12" },
  { mix: "+=28", hue: 0, saturation: "-=29" }
] as const;

const antiMud = [
  { mix: 9, hue: "next", saturation: 60 },
  { mix: 15, hue: "next-=5", saturation: 39 },
  { mix: 18, hue: "next-=5", saturation: 70 },
  { mix: 20, hue: "next-=5", saturation: 99 },
  { mix: 24, hue: "next-=5", saturation: 99 },
  { mix: 30, hue: "next-=5", saturation: 99 },
  { mix: 43, hue: "next-=5", saturation: 90 },
  { mix: 56, hue: "next-=5", saturation: 90 },
  "primer",
  { mix: "+=30", hue: "prev-=0", saturation: "-=90" },
  { mix: "+=20", hue: "prev-=5", saturation: "-=90" },
  { mix: "+=18", hue: "prev-=10", saturation: "-=90" }
] as const;

const deepContrast = [
  { mix: 9, hue: "next+=10", saturation: 90 },
  { mix: 15, hue: "next+=10", saturation: 99 },
  { mix: 25, hue: "next+=10", saturation: 90 },
  { mix: 30, hue: "next+=10", saturation: 99 },
  { mix: 44, hue: "next+=10", saturation: 99 },
  { mix: 60, hue: "next+=10", saturation: 99 },
  { mix: 73, hue: "next+=10", saturation: 90 },
  { mix: 86, hue: "next+=10", saturation: 90 },
  "primer",
  { mix: "+=25", hue: "prev-=0", saturation: "-=90" },
  { mix: "+=10", hue: "prev-=0", saturation: "-=90" },
  { mix: "+=7", hue: "prev-=0", saturation: "-=90" }
] as const;

const frontLoadedAmber = [
  { mix: 8, hue: "next", saturation: 90 },
  { mix: 35, hue: "next-=5", saturation: 90 },
  { mix: 52, hue: "next-=5", saturation: 80 },
  { mix: 72, hue: "next-=5", saturation: 80 },
  "primer",
  { mix: "+=2", hue: "+=5" },
  { mix: "+=5", hue: "+=2", saturation: "-=32" },
  "+=4",
  "+=2",
  "+=2",
  { mix: "+=5", hue: "+=5", saturation: "+=22" },
  "+=20"
] as const;

// Unused but kept for potential future use
// const frontLoadedYellow = [
//   { mix: "+=10" },
//   { mix: "+=10" },
//   { mix: "+=2" },
//   { mix: "+=2" },
//   { mix: "+=2" },
//   { mix: "+=5" },
//   "primer",
//   "+=4",
//   "+=2",
//   "+=2",
//   { mix: "+=5" },
//   "+=5"
// ] as const;

const endLoadedBlue = [0.5, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 'primer'];

const limeLight = [
  { mix: 10, hue: "next", saturation: 90 },
  { mix: 25, hue: "next", saturation: 90 },
  { mix: 52, hue: "next", saturation: 90 },
  "primer",
  "+=6",
  "+=4",
  "+=3",
  "+=3",
  "+=5",
  "+=2",
  "+=5",
  "+=15"
] as const;

const evenContrast = {
  name: 'evenContrast',
  range: {
    light: evenContrastLight,
    dark: evenContrastDark
  }
}

/**
 * Color preset definition with optimized range configurations
 */
export interface ColorPreset {
  /** Display name of the color */
  readonly name: string
  /** Hex color value */
  readonly hex: string
  /** Optimized range for light and dark themes */
  readonly range: { light: readonly UmbraShade[] | TintsInput; dark: readonly UmbraShade[] | TintsInput }
}

/**
 * Lookup table of optimized color presets
 * Each preset includes the color name, hex value, and optimal tints/shades configurations
 */
export const colorPresets = [
  {
    name: 'gray',
    hex: '#8B8D98',
    range: { light: TINTS_GRAY, dark: SHADES_GRAY }
  },
  {
    name: 'blue',
    hex: '#0090FF',
    range: evenContrast.range
  },
  {
    name: 'darkBlue',
    hex: '#001F3F',
    range: {
      light: endLoadedBlue,
      dark: [5, 9, 13, 17, 20, 25, 30, 41, 46, 51, 74, 94],
    }
  },
  {
    name: 'red',
    hex: '#E5484D',
    range: evenContrast.range
  },
  {
    name: 'green',
    hex: '#30A46C',
    range: evenContrast.range
  },
  {
    name: 'tomato',
    hex: '#E54D2E',
    range: evenContrast.range
  },
  {
    name: 'crimson',
    hex: '#E93D82',
    range: evenContrast.range
  },
  {
    name: 'pink',
    hex: '#D6409F',
    range: evenContrast.range
  },
  {
    name: 'plum',
    hex: '#AB4ABA',
    range: evenContrast.range
  },
  {
    name: 'purple',
    hex: '#8E4EC6',
    range: evenContrast.range
  },
  {
    name: 'violet',
    hex: '#6E56CF',
    range: evenContrast.range
  },
  {
    name: 'iris',
    hex: '#5B5BD6',
    range: evenContrast.range
  },
  {
    name: 'indigo',
    hex: '#3E63DD',
    range: evenContrast.range
  },
  {
    name: 'cyan',
    hex: '#00A2C7',
    range: evenContrast.range
  },
  {
    name: 'teal',
    hex: '#12A594',
    range: evenContrast.range
  },
  {
    name: 'jade',
    hex: '#29A383',
    range: evenContrast.range
  },
  {
    name: 'grass',
    hex: '#46A758',
    range: evenContrast.range
  },
  {
    name: 'bronze',
    hex: '#A18072',
    range: evenContrast.range
  },
  {
    name: 'gold',
    hex: '#978365',
    range: evenContrast.range
  },
  {
    name: 'brown',
    hex: '#AD7F58',
    range: evenContrast.range
  },
  {
    name: 'orange',
    hex: '#F76B15',
    range: {
      light: orangeContrastLight,
      dark: evenContrastDark
    }
  },
  {
    name: 'amber',
    hex: '#FFC53D',
    range: {
      light: frontLoadedAmber,
      dark: antiMud
    }
  },
  {
    name: 'yellow',
    hex: '#FFDC00',
    range: {
      light: frontLoadedAmber,
      dark: antiMud
    }
  },
  {
    name: 'lime',
    hex: '#BDEE63',
    range: {
      light: limeLight,
      dark: antiMud
    }
  },
  {
    name: 'mint',
    hex: '#86EAD4',
    range: {
      light: limeLight,
      dark: deepContrast
    }
  },
  {
    name: 'sky',
    hex: '#7CE2FE',
    range: {
      light: limeLight,
      dark: deepContrast

    }
  }
] as const

/**
 * Extract preset names as a union type for autocomplete
 */
export type PresetName = typeof colorPresets[number]['name']

/**
 * Type-safe color string that accepts preset names OR any other string (like hex colors)
 * Provides autocomplete for preset names while still allowing arbitrary color strings
 */
export type ColorString = PresetName | (string & {})

/**
 * Map of color names (including aliases) to their preset configurations
 */
const presetMap = new Map<string, ColorPreset>()

// Populate the map with all names
colorPresets.forEach(preset => {
  // Add primary name
  presetMap.set(preset.name.toLowerCase(), preset)
})

/**
 * Get a color preset by name or alias
 * @param name - Color name or alias (case-insensitive)
 * @returns Color preset if found, undefined otherwise
 */
export function getPresetByName(name: string): ColorPreset | undefined {
  return presetMap.get(name.toLowerCase())
}

/**
 * Calculate color distance using RGB color space
 * This provides a simple but effective color matching algorithm
 */
function colorDistance(color1: UmbraSwatch, color2: UmbraSwatch): number {
  const rgb1 = color1.toRgb()
  const rgb2 = color2.toRgb()

  // Weighted Euclidean distance that accounts for human perception
  // Red channel is weighted more heavily in human vision
  const rDiff = rgb1.r - rgb2.r
  const gDiff = rgb1.g - rgb2.g
  const bDiff = rgb1.b - rgb2.b

  // Use weighted RGB distance (gives better perceptual results than plain RGB)
  return Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff)
}

/**
 * Find the closest matching color preset for a given hex color
 * Uses weighted RGB color space for perceptually accurate matching
 * @param hexColor - Hex color string to match
 * @returns Closest matching color preset
 */
export function findClosestPreset(hexColor: string): ColorPreset {
  const targetColor = swatch(hexColor)

  let closestPreset: ColorPreset = colorPresets[0]
  let minDistance = Infinity

  for (const preset of colorPresets) {
    const presetColor = swatch(preset.hex)
    const distance = colorDistance(targetColor, presetColor)

    if (distance < minDistance) {
      minDistance = distance
      closestPreset = preset as ColorPreset
    }
  }

  return closestPreset
}

/**
 * Resolve color input to hex and preset configuration
 * Supports:
 * - Hex colors: Finds closest preset
 * - Preset names: Uses exact preset
 * - Preset aliases: Uses exact preset
 *
 * @param color - Color string (hex or preset name/alias)
 * @returns Object with hex color and matched preset
 */
export function resolveColorPreset(color: string): {
  hex: string
  preset: ColorPreset
} {
  // Check if it's a preset name or alias first
  const namedPreset = getPresetByName(color)
  if (namedPreset) {
    return {
      hex: namedPreset.hex,
      preset: namedPreset
    }
  }

  // Otherwise treat as hex and find closest match
  const closestPreset = findClosestPreset(color)
  return {
    hex: color,
    preset: closestPreset
  }
}
