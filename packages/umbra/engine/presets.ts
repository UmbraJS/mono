import type { TintsInput } from './easing'
import { swatch } from '../swatch'
import type { UmbraSwatch } from '../swatch'
import type { UmbraShade } from './easing'

/**
 * Color preset definition with optimized tints and shades
 */
export interface ColorPreset {
  /** Display name of the color */
  readonly name: string
  /** Hex color value */
  readonly hex: string
  /** Optimized tints for light themes (white background) */
  readonly tints: readonly UmbraShade[] | TintsInput
  /** Optimized shades for dark themes (dark background) */
  readonly shades: readonly UmbraShade[] | TintsInput
}

/**
 * Lookup table of optimized color presets
 * Each preset includes the color name, hex value, and optimal tints/shades configurations
 */
export const colorPresets = [
  {
    name: 'gray',
    hex: '#8B8D98',
    tints: [0.5, 2, 5, 8, 11, 13, 17, 24, 'primer', 42, 46, 58],
    shades: [0.5, 2, 5, 8, 11, 13, 17, 24, 'primer', 42, 46, 58]
  },
  {
    name: 'blue',
    hex: '#0090FF',
    tints: [
      { mix: 3, hue: "next" },
      { mix: 5, hue: "next", saturation: "+=99" },
      14, 24, 35, 49, 68, 88,
      "primer",
      { mix: "+=5", hue: 0, saturation: "-=4" },
      { mix: "+=6", hue: 0, saturation: "-=12" },
      { mix: "+=35", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 18, hue: "next" },
      { mix: 21, hue: "next", saturation: "+=99" },
      25, 30, 37, 51, 64, 82,
      "primer",
      { mix: "+=23", hue: 0, saturation: "-=4" },
      { mix: "+=4", hue: 0, saturation: "-=12" },
      { mix: "+=31", hue: 0, saturation: "-=29" }
    ]
  },
  {
    name: 'red',
    hex: '#E5484D',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      10, 19, 26, 35, 49, 67,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=5", hue: 0, saturation: "-=12" },
      { mix: "+=40", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 14, hue: "next", saturation: "+=20" },
      { mix: 17, hue: "next", saturation: "+=25" },
      24, 31, 39, 49, 63, 84,
      "primer",
      { mix: "+=14", hue: "prev", saturation: "-=34" },
      { mix: "+=25", hue: "prev", saturation: "-=40" },
      { mix: "+=20", hue: "prev", saturation: "-=90" }
    ]
  },
  {
    name: 'green',
    hex: '#30A46C',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 5, hue: "next", saturation: "+=99" },
      12, 20, 30, 41, 58, 82,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=12" },
      { mix: "+=31", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 17, hue: "next" },
      { mix: 22, hue: "next" },
      25, 32, 42, 52, 66, 81,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=12" },
      { mix: "+=41", hue: 0, saturation: "-=29" }
    ]
  },
  {
    name: 'tomato',
    hex: '#E54D2E',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      12, 20, 27, 38, 51, 68,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=5", hue: 0, saturation: "-=12" },
      { mix: "+=36", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=39" },
      25, 35, 42, 53, 65, 85,
      "primer",
      { mix: "+=11", hue: 0, saturation: "-=99" },
      { mix: "+=27", hue: 0, saturation: "-=99" },
      { mix: "+=16", hue: 0, saturation: "-=99" }
    ]
  },
  {
    name: 'crimson',
    hex: '#E93D82',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      12, 21, 31, 43, 56, 72,
      "primer",
      { mix: "+=7", hue: 0, saturation: "-=4" },
      { mix: "+=9", hue: 0, saturation: "-=12" },
      { mix: "+=30", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 13, hue: "next" },
      { mix: 17, hue: "next", saturation: "+=19" },
      24, 31, 39, 49, 62, 83,
      "primer",
      { mix: "+=12", hue: 0, saturation: "-=4" },
      { mix: "+=31", hue: 0, saturation: "-=92" },
      { mix: "+=15", hue: 0, saturation: "-=99" }
    ]
  },
  {
    name: 'pink',
    hex: '#D6409F',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      12, 20, 28, 39, 52, 67,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=5", hue: 0, saturation: "-=12" },
      { mix: "+=40", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      25, 32, 40, 52, 67, 87,
      "primer",
      { mix: "+=8", hue: 0, saturation: "-=4" },
      { mix: "+=39", hue: 0, saturation: "-=99" },
      { mix: "+=12", hue: 0, saturation: "-=99" }
    ]
  },
  {
    name: 'plum',
    hex: '#AB4ABA',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      11, 17, 23, 32, 46, 59,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=3", hue: 0, saturation: "-=12" },
      { mix: "+=38", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'purple',
    hex: '#8E4EC6',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      9, 13, 19, 31, 42, 57,
      "primer",
      { mix: "+=8", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=0" },
      { mix: "+=10", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'violet',
    hex: '#6E56CF',
    tints: [
      { mix: 2, hue: "next", saturation: "+=99" },
      { mix: 4, hue: "next", saturation: "+=99" },
      8, 11, 16, 26, 36, 55,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=12" },
      { mix: "+=26", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'iris',
    hex: '#5B5BD6',
    tints: [
      { mix: 1, hue: "next" },
      { mix: 2, hue: "next", saturation: "+=99" },
      8, 11, 16, 24, 37, 57,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=10", hue: 0, saturation: "-=12" },
      { mix: "+=20", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'indigo',
    hex: '#3E63DD',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      10, 15, 24, 30, 47, 62,
      "primer",
      { mix: "+=12", hue: 0, saturation: "-=4" },
      { mix: "+=15", hue: 0, saturation: "-=12" },
      { mix: "+=10", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'cyan',
    hex: '#00A2C7',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 5, hue: "next", saturation: "+=99" },
      16, 25, 35, 49, 64, 89,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=5", hue: 0, saturation: "-=12" },
      { mix: "+=40", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=29" },
      { mix: 19, hue: "next", saturation: "+=49" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=37", hue: "prev", saturation: "-=99" },
      { mix: "+=3", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'teal',
    hex: '#12A594',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      12, 21, 32, 44, 60, 81,
      "primer",
      { mix: "+=9", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=12" },
      { mix: "+=20", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 24, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=17", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'jade',
    hex: '#29A383',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 5, hue: "next", saturation: "+=99" },
      11, 19, 29, 41, 57, 82,
      "primer",
      { mix: "+=8", hue: 0, saturation: "-=4" },
      { mix: "+=5", hue: 0, saturation: "-=12" },
      { mix: "+=35", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 24, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 92,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=17", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'grass',
    hex: '#46A758',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 6, hue: "next", saturation: "+=99" },
      12, 20, 30, 42, 60, 84,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=18", hue: 0, saturation: "-=12" },
      { mix: "+=20", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 20, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 78,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=17", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'bronze',
    hex: '#A18072',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      13, 19, 28, 39, 50, 69,
      "primer",
      { mix: "+=8", hue: 0, saturation: "-=4" },
      { mix: "+=10", hue: 0, saturation: "-=12" },
      { mix: "+=29", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 20, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 78,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=17", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'gold',
    hex: '#978365',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 7, hue: "next", saturation: "+=99" },
      14, 20, 29, 38, 52, 70,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=14", hue: 0, saturation: "-=12" },
      { mix: "+=25", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 20, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 78,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=26", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'brown',
    hex: '#AD7F58',
    tints: [
      { mix: 2, hue: "next" },
      { mix: 4, hue: "next", saturation: "+=99" },
      13, 21, 29, 39, 52, 71,
      "primer",
      { mix: "+=6", hue: 0, saturation: "-=4" },
      { mix: "+=12", hue: 0, saturation: "-=12" },
      { mix: "+=28", hue: 0, saturation: "-=29" }
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 20, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 78,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=26", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'orange',
    hex: '#F76B15',
    tints: [
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
    ],
    shades: [
      { mix: 15, hue: "next", saturation: "+=99" },
      { mix: 20, hue: "next", saturation: "+=99" },
      28, 38, 47, 56, 71, 78,
      "primer",
      { mix: "+=10", hue: "prev", saturation: "-=99" },
      { mix: "+=26", hue: "prev", saturation: "-=99" },
      { mix: "+=28", hue: "prev", saturation: "-=99" }
    ]
  },
  {
    name: 'amber',
    hex: '#FFC53D',
    tints: [
      { mix: 6, hue: "next", saturation: 90 },
      { mix: 25, hue: "next-=10", saturation: 90 },
      { mix: 52, hue: "next-=10", saturation: 90 },
      "primer",
      { mix: "+=2", hue: "+=5" },
      { mix: "+=2", hue: "+=5" },
      "+=2",
      "+=2",
      { mix: "+=5", hue: "+=2", saturation: "-=32" },
      "+=2",
      { mix: "+=5", hue: "+=5", saturation: "+=22" },
      "+=15"
    ],
    shades: [
      { mix: 9, hue: "next", saturation: 60 },
      { mix: 15, hue: "next-=5", saturation: 39 },
      { mix: 18, hue: "next-=5", saturation: 70 },
      { mix: 20, hue: "next-=5", saturation: 99 },
      { mix: 24, hue: "next-=5", saturation: 99 },
      { mix: 30, hue: "next-=5", saturation: 99 },
      { mix: 43, hue: "next-=5", saturation: 90 },
      { mix: 56, hue: "next-=5", saturation: 90 },
      "primer",
      { mix: "+=30", hue: "prev-=0", saturation: 0 },
      { mix: "+=20", hue: "prev-=5", saturation: 0 },
      { mix: "+=18", hue: "prev-=10", saturation: 0 }
    ]
  },
  {
    name: 'yellow',
    hex: '#FFDC00',
    tints: [
      { mix: 8, hue: "next", saturation: 90 },
      { mix: 25, hue: "next-=10", saturation: 90 },
      { mix: 52, hue: "next-=10", saturation: 90 },
      "primer",
      { mix: "+=2", hue: "+=5" },
      { mix: "+=2", hue: "+=5" },
      { mix: "+=5", hue: "+=2", saturation: "-=32" },
      "+=4",
      "+=2",
      "+=2",
      { mix: "+=5", hue: "+=5", saturation: "+=22" },
      "+=20"
    ],
    shades: [
      { mix: 9, hue: "next", saturation: 60 },
      { mix: 15, hue: "next-=5", saturation: 39 },
      { mix: 18, hue: "next-=5", saturation: 70 },
      { mix: 20, hue: "next-=5", saturation: 99 },
      { mix: 24, hue: "next-=5", saturation: 99 },
      { mix: 30, hue: "next-=5", saturation: 99 },
      { mix: 43, hue: "next-=5", saturation: 90 },
      { mix: 56, hue: "next-=5", saturation: 90 },
      "primer",
      { mix: "+=30", hue: "prev-=0", saturation: 0 },
      { mix: "+=20", hue: "prev-=5", saturation: 0 },
      { mix: "+=18", hue: "prev-=10", saturation: 0 }
    ]
  },
  {
    name: 'lime',
    hex: '#BDEE63',
    tints: [
      { mix: 8, hue: "next", saturation: 90 },
      { mix: 30, hue: "next", saturation: 90 },
      { mix: 60, hue: "next", saturation: 90 },
      "primer",
      { mix: "+=6", hue: "+=5" },
      { mix: "+=6", hue: "+=5" },
      "+=2",
      "+=2",
      { mix: "+=3", hue: "+=2", saturation: "-=12" },
      "+=3",
      { mix: "+=3", hue: "+=5" },
      "+=3"
    ],
    shades: [
      { mix: 9, hue: "next", saturation: 60 },
      { mix: 15, hue: "next-=5", saturation: 39 },
      { mix: 18, hue: "next-=5", saturation: 70 },
      { mix: 20, hue: "next-=5", saturation: 99 },
      { mix: 24, hue: "next-=5", saturation: 99 },
      { mix: 30, hue: "next-=5", saturation: 99 },
      { mix: 43, hue: "next-=5", saturation: 90 },
      { mix: 56, hue: "next-=5", saturation: 90 },
      "primer",
      { mix: "+=25", hue: "prev-=0", saturation: "-=90" },
      { mix: "+=10", hue: "prev-=10", saturation: "-=90" },
      { mix: "+=7", hue: "prev-=10", saturation: "-=90" }
    ]
  },
  {
    name: 'mint',
    hex: '#86EAD4',
    tints: [
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
    ],
    shades: [
      { mix: 9, hue: "next", saturation: 60 },
      { mix: 15, hue: "next-=5", saturation: 39 },
      { mix: 25, hue: "next-=5", saturation: 70 },
      { mix: 30, hue: "next-=5", saturation: 99 },
      { mix: 44, hue: "next-=5", saturation: 99 },
      { mix: 60, hue: "next-=5", saturation: 99 },
      { mix: 73, hue: "next-=5", saturation: 90 },
      { mix: 86, hue: "next-=5", saturation: 90 },
      "primer",
      { mix: "+=25", hue: "prev-=0", saturation: "-=90" },
      { mix: "+=10", hue: "prev-=10", saturation: "-=90" },
      { mix: "+=7", hue: "prev-=10", saturation: "-=90" }
    ]
  },
  {
    name: 'sky',
    hex: '#7CE2FE',
    tints: [
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
    ],
    shades: [
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
    ]
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
