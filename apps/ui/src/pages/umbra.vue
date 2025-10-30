<script setup lang="ts">
import { umbra, defaultSettings, resolveTints } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput, UmbraSwatch } from '@umbrajs/core'
import { Button } from "umbraco"
import { ref, computed } from 'vue'
import {
  gray,
  grayDark,
  mauve,
  slate,
  sage,
  olive,
  sand,
  ruby
} from "@radix-ui/colors";
import ColourLightness from '../components/colour/Lightness.vue';
import ColourSaturation from '../components/colour/Saturation.vue';
import ColourHue from '../components/colour/Hue.vue';

const radixGrayMap: Accent = {
  name: 'gray',
  shades: [0.5, 2, 5, 8, 11, 13, 17, 24, 42, 46, 58, 87],
  tints: [0.5, 2, 5, 8, 11, 13, 17, 24, 42, 46, 58, 87],
}

const radixBlueMap: Accent = {
  name: 'blue-tuned',
  color: '#0090ff',
  shades: [
    { mix: 18, hue: "next" },
    { mix: 21, hue: "next", saturation: "+=99" },
    25,
    30,
    37,
    51,
    64,
    82,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=23", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=4", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=31", hue: 0, saturation: "-=29" } // Dark blue
  ],
  tints: [
    { mix: 3, hue: "next" },
    { mix: 5, hue: "next", saturation: "+=99" },
    14,
    24,
    35,
    49,
    68,
    88,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=5", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=6", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=35", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixRedMap: Accent = {
  name: 'red-tuned',
  color: '#e5484d',
  shades: [
    { mix: 14, hue: "next", saturation: "+=20" },
    { mix: 17, hue: "next", saturation: "+=25" },
    24,
    31,
    39,
    49,
    63,
    84,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=14", hue: "prev", saturation: "-=34" },   // Darken but keep blue hue
    { mix: "+=25", hue: "prev", saturation: "-=40" },  // Continue darkening
    { mix: "+=20", hue: "prev", saturation: "-=90" } // Dark blue
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    10,
    19,
    26,
    35,
    49,
    67,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=5", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=40", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixGreenMap: Accent = {
  name: 'green-tuned',
  color: '#30a46c',
  shades: [
    { mix: 17, hue: "next" },
    { mix: 22, hue: "next" },
    25,
    32,
    42,
    52,
    66,
    81,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=12", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=41", hue: 0, saturation: "-=29" } // Dark blue
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 5, hue: "next", saturation: "+=99" },
    12,
    20,
    30,
    41,
    58,
    82,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=12", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=31", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixTomatoMap: Accent = {
  name: 'tomato-tuned',
  color: '#e54d2e',
  shades: [
    { mix: 15, saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=39" },
    25,
    35,
    42,
    53,
    65,
    85,
    "primer",
    { mix: "+=11", hue: 0, saturation: "-=99" },
    { mix: "+=27", hue: 0, saturation: "-=99" },
    { mix: "+=16", hue: 0, saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    12,
    20,
    27,
    38,
    51,
    68,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=36", hue: 0, saturation: "-=29" }
  ],
}

const radixCrimsonMap: Accent = {
  name: 'crimson-tuned',
  color: '#e93d82',
  shades: [
    { mix: 13, hue: "next" },
    { mix: 17, hue: "next", saturation: "+=19" },
    24,
    31,
    39,
    49,
    62,
    83,
    "primer",
    { mix: "+=12", hue: 0, saturation: "-=4" },
    { mix: "+=31", hue: 0, saturation: "-=92" },
    { mix: "+=15", hue: 0, saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    12,
    21,
    31,
    43,
    56,
    72,
    "primer",
    { mix: "+=7", hue: 0, saturation: "-=4" },
    { mix: "+=9", hue: 0, saturation: "-=12" },
    { mix: "+=30", hue: 0, saturation: "-=29" }
  ],
}

const radixPinkMap: Accent = {
  name: 'pink-tuned',
  color: '#d6409f',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    25,
    32,
    40,
    52,
    67,
    87,
    "primer",
    { mix: "+=8", hue: 0, saturation: "-=4" },
    { mix: "+=39", hue: 0, saturation: "-=99" },
    { mix: "+=12", hue: 0, saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    12,
    20,
    28,
    39,
    52,
    67,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const radixPlumMap: Accent = {
  name: 'plum-tuned',
  color: '#ab4aba',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    11,
    17,
    23,
    32,
    46,
    59,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=3", hue: 0, saturation: "-=12" },
    { mix: "+=38", hue: 0, saturation: "-=29" }
  ],
}

const radixPurpleMap: Accent = {
  name: 'purple-tuned',
  color: '#8e4ec6',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    9,
    13,
    19,
    31,
    42,
    57,
    "primer",
    { mix: "+=8", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=0" },
    { mix: "+=10", hue: 0, saturation: "-=29" }
  ],
}

const radixVioletMap: Accent = {
  name: 'violet-tuned',
  color: '#6e56cf',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next", saturation: "+=99" },
    { mix: 4, hue: "next", saturation: "+=99" },
    8,
    11,
    16,
    26,
    36,
    55,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=26", hue: 0, saturation: "-=29" }
  ],
}

const radixIrisMap: Accent = {
  name: 'iris-tuned',
  color: '#5b5bd6',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 1, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    8,
    11,
    16,
    24,
    37,
    57,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=10", hue: 0, saturation: "-=12" },
    { mix: "+=20", hue: 0, saturation: "-=29" }
  ],
}

const radixIndigoMap: Accent = {
  name: 'indigo-tuned',
  color: '#3e63dd',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    10,
    15,
    24,
    30,
    47,
    62,
    "primer",
    { mix: "+=12", hue: 0, saturation: "-=4" },
    { mix: "+=15", hue: 0, saturation: "-=12" },
    { mix: "+=10", hue: 0, saturation: "-=29" }
  ],
}

const radixCyanMap: Accent = {
  name: 'cyan-tuned',
  color: '#00a2c7',
  shades: [
    { mix: 15, hue: "next", saturation: "+=29" },
    { mix: 19, hue: "next", saturation: "+=49" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=37", hue: "prev", saturation: "-=99" },
    { mix: "+=3", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 5, hue: "next", saturation: "+=99" },
    16,
    25,
    35,
    49,
    64,
    89,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const radixTealMap: Accent = {
  name: 'teal-tuned',
  color: '#12a594',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 24, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=17", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    12, 21, 32, 44, 60, 81,
    "primer",
    { mix: "+=9", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=20", hue: 0, saturation: "-=29" }
  ],
}

const radixJadeMap: Accent = {
  name: 'jade-tuned',
  color: '#29a383',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 24, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    92,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=17", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 5, hue: "next", saturation: "+=99" },
    11, 19, 29, 41, 57, 82,
    "primer",
    { mix: "+=8", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=35", hue: 0, saturation: "-=29" }
  ],
}

const radixGrassMap: Accent = {
  name: 'grass-tuned',
  color: '#46a758',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 20, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    78,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=17", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 6, hue: "next", saturation: "+=99" },
    12, 20, 30, 42, 60, 84,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=18", hue: 0, saturation: "-=12" },
    { mix: "+=20", hue: 0, saturation: "-=29" }
  ],
}

const radixBronzeMap: Accent = {
  name: 'bronze-tuned',
  color: '#a18072',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 20, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    78,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=17", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    13, 19, 28, 39, 50, 69,
    "primer",
    { mix: "+=8", hue: 0, saturation: "-=4" },
    { mix: "+=10", hue: 0, saturation: "-=12" },
    { mix: "+=29", hue: 0, saturation: "-=29" }
  ],
}

const radixGoldMap: Accent = {
  name: 'gold-tuned',
  color: '#978365',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 20, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    78,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=26", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 7, hue: "next", saturation: "+=99" },
    14, 20, 29, 38, 52, 70,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=14", hue: 0, saturation: "-=12" },
    { mix: "+=25", hue: 0, saturation: "-=29" }
  ],
}

const radixBrownMap: Accent = {
  name: 'brown-tuned',
  color: '#ad7f58',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 20, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    78,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=26", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
  tints: [
    { mix: 2, hue: "next" },
    { mix: 4, hue: "next", saturation: "+=99" },
    13, 21, 29, 39, 52, 71,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=28", hue: 0, saturation: "-=29" }
  ],
}

const radixOrangeMap: Accent = {
  name: 'orange-tuned',
  color: '#f76b15',
  shades: [
    { mix: 15, hue: "next", saturation: "+=99" },
    { mix: 20, hue: "next", saturation: "+=99" },
    28,
    38,
    47,
    56,
    71,
    78,
    "primer",
    { mix: "+=10", hue: "prev", saturation: "-=99" },
    { mix: "+=26", hue: "prev", saturation: "-=99" },
    { mix: "+=28", hue: "prev", saturation: "-=99" }
  ],
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
}

const radixAmberMap: Accent = {
  name: 'amber-tuned',
  color: '#ffc53d',
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
  ],
  tints: [
    { mix: 6, hue: "next", saturation: 90 },
    { mix: 25, hue: "next-=10", saturation: 90 },
    { mix: 52, hue: "next-=10", saturation: 90 },
    "primer",
    { mix: "+=2", hue: "+=5" },
    { mix: "+=2", hue: "+=5" },
    "+=2", "+=2",
    { mix: "+=5", hue: "+=2", saturation: "-=32" },
    "+=2",
    { mix: "+=5", hue: "+=5", saturation: "+=22" },
    "+=15"
  ],
}

const radixYellowMap: Accent = {
  name: 'yellow-tuned',
  color: '#ffdc00',
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
  ],
  tints: [
    { mix: 8, hue: "next", saturation: 90 },
    { mix: 25, hue: "next-=10", saturation: 90 },
    { mix: 52, hue: "next-=10", saturation: 90 },
    "primer",
    { mix: "+=2", hue: "+=5" },
    { mix: "+=2", hue: "+=5" },
    { mix: "+=5", hue: "+=2", saturation: "-=32" },
    "+=4", "+=2",
    "+=2",
    { mix: "+=5", hue: "+=5", saturation: "+=22" },
    "+=20"
  ],
}

const radixLimeMap: Accent = {
  name: 'lime-tuned',
  color: '#bdee63',
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
  ],
  tints: [
    { mix: 8, hue: "next", saturation: 90 },
    { mix: 30, hue: "next", saturation: 90 },
    { mix: 60, hue: "next", saturation: 90 },
    "primer",
    { mix: "+=6", hue: "+=5" },
    { mix: "+=6", hue: "+=5" },
    "+=2", "+=2",
    { mix: "+=3", hue: "+=2", saturation: "-=12" },
    "+=3",
    { mix: "+=3", hue: "+=5" },
    "+=3"
  ],
}

const radixMintMap: Accent = {
  name: 'mint-tuned',
  color: '#86ead4',
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
  ],
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
}

const radixSkyMap: Accent = {
  name: 'sky-tuned',
  color: '#7ce2fe',
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
  ],
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
}

// const theme = useUmbra({
//   foreground: '#12222e',  // Pure black (shared across all accents)
//   background: '#ffffff',  // Pure white (shared across all accents)
//   accents: [
//     {
//       name: 'test',
//       color: '#542920',
//       shades: defaultSettings.shades,
//       tints: [
//         { mix: 10, hue: "next" },
//         { mix: "+=10", hue: "next", saturation: 90 },
//         { mix: "+=15", hue: "next", saturation: 90 },
//         19, 20, 20, 35, 35,
//         "primer",
//         { mix: "+=6", hue: 0, saturation: "-=4" },
//         { mix: "+=5", hue: 0, saturation: "-=12" },
//         { mix: "+=20", hue: 0, saturation: "-=29" }
//       ],
//     },
//   ],
//   settings: {
//     shades: Object.values(grayDark),
//     tints: Object.values(gray),
//   }
// })

const theme = useUmbra({
  foreground: '#ffffff',  // Pure black (shared across all accents)
  background: '#000000',  // Pure white (shared across all accents)
  accents: [
    radixGrayMap,
    radixBlueMap,
    radixRedMap,
    radixGreenMap,
    radixTomatoMap,
    radixCrimsonMap,
    radixPinkMap,
    radixPlumMap,
    radixPurpleMap,
    radixVioletMap,
    radixIrisMap,
    radixIndigoMap,
    radixCyanMap,
    radixTealMap,
    radixJadeMap,
    radixGrassMap,
    radixBronzeMap,
    radixGoldMap,
    radixBrownMap,
    radixOrangeMap,
    radixAmberMap,
    radixYellowMap,
    radixLimeMap,
    radixMintMap,
    radixSkyMap,
  ],
  settings: {
    shades: Object.values(grayDark),
    tints: Object.values(gray),
  }
})

// theme.generatedTheme.value.output.forEach(range => {
//   range.range = range.range.map(color => swatch(color.toHex()))
// })

function useUmbra(schema: UmbraInput) {
  const initTheme = umbra(schema)
  const generatedTheme = ref<Umbra>(initTheme)

  function applyTheme() {
    generatedTheme.value.apply()
  }

  function inverseTheme(apply = true) {
    generatedTheme.value = generatedTheme.value.inverse()
    if (apply) applyTheme()
  }

  applyTheme()

  return {
    applyTheme,
    inverseTheme,
    generatedTheme,
  }
}

function getTokenName(index: number) {
  return index * 10 + 10
}

type DisplayMode = 'lightness' | 'saturation' | 'hue'
const displayMode = ref<DisplayMode>('lightness')

function cycleMode() {
  const modes: DisplayMode[] = ['lightness', 'saturation', 'hue']
  const currentIndex = modes.indexOf(displayMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  displayMode.value = modes[nextIndex]
}

const finishedEntries = ref<string[]>([
  "base",
  "gray",
  // "blue-tuned",
  // "red-tuned",
  // "green-tuned",
  // "tomato-tuned",
  // "crimson-tuned",
  // "pink-tuned",
  // "plum-tuned",
  // "purple-tuned",
  // "violet-tuned",
  // "iris-tuned",
  // "indigo-tuned",
  // "cyan-tuned",
  // "teal-tuned",
  // "jade-tuned",
  // "grass-tuned",
  // "bronze-tuned",
  // "gold-tuned",
  // "brown-tuned",
  // "orange-tuned",
  // "amber-tuned",
  // "yellow-tuned",
  // "lime-tuned",
  // "mint-tuned",
  // "sky-tuned",
])

const filteredUmbraOutput = computed(() => {
  return theme.generatedTheme.value.output.filter(range => {
    return !finishedEntries.value.includes(range.name)
  })
})

function stringIncludesTheWordTuned(str: string) {
  return str.toLowerCase().includes("tuned")
}
</script>

<template>
  <div id="ThemeControls">
    <Button @click="() => theme.inverseTheme(false)">Inverse Theme</Button>
    <Button @click="cycleMode">
      Mode: {{ displayMode.charAt(0).toUpperCase() + displayMode.slice(1) }}
    </Button>
  </div>
  <div class="umbra-wrapper">
    <div class="range-list">
      <div v-for="range in filteredUmbraOutput" :key="range.name" class="ColorList"
        @click="finishedEntries.push(range.name)">
        <div v-if="displayMode === 'lightness'" class="TokensLightness">
          <ColourLightness v-for="color in range.range" :color="color"
            :previous-color="!stringIncludesTheWordTuned(range.name) ? filteredUmbraOutput[filteredUmbraOutput.indexOf(range) - 1]?.range[range.range.indexOf(color)] : undefined" />
        </div>

        <div v-if="displayMode === 'saturation'" class="TokensSaturation">
          <ColourSaturation v-for="color in range.range" :color="color" />
        </div>

        <div v-if="displayMode === 'hue'" class="TokensHue">
          <ColourHue v-for="color in range.range" :color="color" />
        </div>

        <div class="tokens border">
          <div id="StartCap" class="caps color" :style="`--color: ${range.background.toHex()}`"></div>
          <div v-for="(color, index) in range.range" class="color" :style="`--color: ${color.toHex()}`">
            <p v-if="true" id="TokenName" class="caption">{{ getTokenName(index) }}</p>
          </div>
          <div id="EndCap" class="caps color" :style="`--color: ${range.foreground.toHex()}`"></div>
        </div>
        <div class="color-name">{{ range.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.TokensLightness,
.TokensSaturation,
.TokensHue {
  display: flex;
  align-items: flex-end;
  height: 100px;
}

:root {
  --color: var(--accent);
  --color-10: var(--accent-10);
  --color-20: var(--accent-20);
  --color-30: var(--accent-30);
  --color-40: var(--accent-40);
  --color-50: var(--accent-50);
  --color-60: var(--accent-60);
  --color-70: var(--accent-70);
  --color-80: var(--accent-80);
  --color-90: var(--accent-90);
  --color-100: var(--accent-100);
  --color-110: var(--accent-110);
  --color-120: var(--accent-120);
  --color-text: var(--accent-text);
}

#TokenName {
  opacity: 0.2;
  font-weight: 900;
}

.ColorList:first-of-type .tokens {
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.ColorList:last-of-type .tokens {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.ColorList:not(:last-of-type, :first-of-type) .tokens {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;

  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.tokens {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.tokens:first-of-type {
  border-bottom: none;
}

.range-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.ColorList {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0px;
}

.ColorList:hover {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
}

.color-name {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-5);
}

.color {
  width: var(--space-3);
  aspect-ratio: 1 / 1;
  background: var(--color);
}
</style>
