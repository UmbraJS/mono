<script setup lang="ts">
import { umbra, defaultSettings, resolveTints } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput, UmbraSwatch } from '@umbrajs/core'
import { Button } from "umbraco"
import { ref, computed } from 'vue'
import {
  gray,
  mauve,
  slate,
  sage,
  olive,
  sand,
  tomato,
  red,
  ruby,
  crimson,
  pink,
  plum,
  purple,
  violet,
  iris,
  indigo,
  blue,
  cyan,
  teal,
  jade,
  green,
  grass,
  bronze,
  gold,
  brown,
  orange,
  amber,
  yellow,
  lime,
  mint,
  sky,
  grayDark,
  mauveDark,
  slateDark,
  sageDark,
  oliveDark,
  sandDark,
  tomatoDark,
  redDark,
  rubyDark,
  crimsonDark,
  pinkDark,
  plumDark,
  purpleDark,
  violetDark,
  irisDark,
  indigoDark,
  blueDark,
  cyanDark,
  tealDark,
  jadeDark,
  greenDark,
  grassDark,
  bronzeDark,
  goldDark,
  brownDark,
  orangeDark,
  amberDark,
  yellowDark,
  limeDark,
  mintDark,
  skyDark,
} from "@radix-ui/colors";
import ColourLightness from '../components/colour/Lightness.vue';
import ColourSaturation from '../components/colour/Saturation.vue';
import ColourHue from '../components/colour/Hue.vue';

const warningAccent: Accent = {
  name: 'warning',
  range: Object.values(red),
  shades: Object.values(redDark),
  tints: Object.values(red),
}

const successAccent: Accent = {
  name: 'success',
  shades: Object.values(greenDark),
  tints: Object.values(green),
}

const infoAccent: Accent = {
  name: 'info',
  range: Object.values(blue),
  shades: Object.values(blueDark),
  tints: Object.values(blue),
}

const tomatoAccent: Accent = {
  name: 'tomato',
  shades: Object.values(redDark),
  tints: Object.values(tomato),
}

console.log("rex: ", Object.values(blue))

const radixGrayMap: Accent = {
  name: 'gray',
  shades: defaultSettings.shades,
  tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],
}

const radixBlueMap: Accent = {
  name: 'blue-tuned',
  color: '#0090ff',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    9,
    10,
    17,
    19,
    35,
    65,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=5", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=6", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=35", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixRedMap: Accent = {
  name: 'red-tuned',
  color: '#e5484d',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    10,
    11,
    24,
    35,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=5", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=40", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixGreenMap: Accent = {
  name: 'green-tuned',
  color: '#30a46c',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 3, hue: "next", saturation: "+=99" },
    9,
    8,
    10,
    20,
    28,
    55,
    "primer",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=12", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=31", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixTomatoMap: Accent = {
  name: 'tomato-tuned',
  color: '#e54d2e',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    8,
    10,
    10,
    10,
    24,
    31,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=36", hue: 0, saturation: "-=29" }
  ],
}

const radixCrimsonMap: Accent = {
  name: 'crimson-tuned',
  color: '#e93d82',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    13,
    18,
    23,
    36,
    "primer",
    { mix: "+=7", hue: 0, saturation: "-=4" },
    { mix: "+=9", hue: 0, saturation: "-=12" },
    { mix: "+=30", hue: 0, saturation: "-=29" }
  ],
}

const crimsonAccent: Accent = {
  name: 'crimson',
  shades: Object.values(crimsonDark),
  tints: Object.values(crimson),
}

const radixPinkMap: Accent = {
  name: 'pink-tuned',
  color: '#d6409f',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    7,
    10,
    10,
    15,
    20,
    30,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const pinkAccent: Accent = {
  name: 'pink',
  shades: Object.values(pinkDark),
  tints: Object.values(pink),
}

const radixPlumMap: Accent = {
  name: 'plum-tuned',
  color: '#ab4aba',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    8,
    8,
    12,
    20,
    27,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=3", hue: 0, saturation: "-=12" },
    { mix: "+=38", hue: 0, saturation: "-=29" }
  ],
}

const plumAccent: Accent = {
  name: 'plum',
  shades: Object.values(plumDark),
  tints: Object.values(plum),
}

const radixPurpleMap: Accent = {
  name: 'purple-tuned',
  color: '#8e4ec6',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    3,
    8,
    14,
    14,
    27,
    "primer",
    { mix: "+=8", hue: 0, saturation: "-=4" },
    { mix: "+=10", hue: 0, saturation: "-=0" },
    { mix: "+=20", hue: 0, saturation: "-=29" }
  ],
}

const purpleAccent: Accent = {
  name: 'purple',
  shades: Object.values(purpleDark),
  tints: Object.values(purple),
}

const radixVioletMap: Accent = {
  name: 'violet-tuned',
  color: '#6e56cf',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 1, hue: "next", saturation: "+=99" },
    3,
    6,
    6,
    11,
    15,
    29,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=10", hue: 0, saturation: "-=12" },
    { mix: "+=26", hue: 0, saturation: "-=29" }
  ],
}

const violetAccent: Accent = {
  name: 'violet',
  shades: Object.values(violetDark),
  tints: Object.values(violet),
}

const radixIrisMap: Accent = {
  name: 'iris-tuned',
  color: '#5b5bd6',
  tints: [
    { mix: 3, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    10,
    11,
    16,
    27,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const irisAccent: Accent = {
  name: 'iris',
  shades: Object.values(irisDark),
  tints: Object.values(iris),
}

const radixIndigoMap: Accent = {
  name: 'indigo-tuned',
  color: '#3e63dd',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    11,
    11,
    24,
    28,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=6", hue: 0, saturation: "-=12" },
    { mix: "+=35", hue: 0, saturation: "-=29" }
  ],
}

const indigoAccent: Accent = {
  name: 'indigo',
  shades: Object.values(indigoDark),
  tints: Object.values(indigo),
}

const radixCyanMap: Accent = {
  name: 'cyan-tuned',
  color: '#00a2c7',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    27,
    11,
    42,
    75,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const cyanAccent: Accent = {
  name: 'cyan',
  shades: Object.values(cyanDark),
  tints: Object.values(cyan),
}

const radixTealMap: Accent = {
  name: 'teal-tuned',
  color: '#12a594',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const tealAccent: Accent = {
  name: 'teal',
  shades: Object.values(tealDark),
  tints: Object.values(teal),
}

const radixJadeMap: Accent = {
  name: 'jade-tuned',
  color: '#29a383',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const jadeAccent: Accent = {
  name: 'jade',
  shades: Object.values(jadeDark),
  tints: Object.values(jade),
}

const radixGrassMap: Accent = {
  name: 'grass-tuned',
  color: '#46a758',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const grassAccent: Accent = {
  name: 'grass',
  shades: Object.values(grassDark),
  tints: Object.values(grass),
}

const radixBronzeMap: Accent = {
  name: 'bronze-tuned',
  color: '#a18072',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const bronzeAccent: Accent = {
  name: 'bronze',
  shades: Object.values(bronzeDark),
  tints: Object.values(bronze),
}

const radixGoldMap: Accent = {
  name: 'gold-tuned',
  color: '#978365',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 6, hue: "next", saturation: "+=99" },
    6, 10, 10, 12, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=14", hue: 0, saturation: "-=12" },
    { mix: "+=25", hue: 0, saturation: "-=29" }
  ],
}

const goldAccent: Accent = {
  name: 'gold',
  shades: Object.values(goldDark),
  tints: Object.values(gold),
}

const radixBrownMap: Accent = {
  name: 'brown-tuned',
  color: '#ad7f58',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    9, 9, 9, 14, 24, 39,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=28", hue: 0, saturation: "-=29" }
  ],
}

const brownAccent: Accent = {
  name: 'brown',
  shades: Object.values(brownDark),
  tints: Object.values(brown),
}

const radixOrangeMap: Accent = {
  name: 'orange-tuned',
  color: '#f76b15',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 7, hue: "next", saturation: "+=99" },
    10, 18, 18, 18, 24, 45,
    "primer",
    { mix: "+=12", hue: 0, saturation: "-=4" },
    { mix: "+=2", hue: 0, saturation: "-=12" },
    { mix: "+=28", hue: 0, saturation: "-=29" }
  ],
}

const orangeAccent: Accent = {
  name: 'orange',
  shades: Object.values(orangeDark),
  tints: Object.values(orange),
}

const radixAmberMap: Accent = {
  name: 'amber-tuned',
  color: '#ffc53d',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const amberAccent: Accent = {
  name: 'amber',
  shades: Object.values(amberDark),
  tints: Object.values(amber),
}

const radixYellowMap: Accent = {
  name: 'yellow-tuned',
  color: '#ffdc00',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const yellowAccent: Accent = {
  name: 'yellow',
  shades: Object.values(yellowDark),
  tints: Object.values(yellow),
}

const radixLimeMap: Accent = {
  name: 'lime-tuned',
  color: '#bdee63',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const limeAccent: Accent = {
  name: 'lime',
  shades: Object.values(limeDark),
  tints: Object.values(lime),
}

const radixMintMap: Accent = {
  name: 'mint-tuned',
  color: '#86ead4',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6, 10, 10, 11, 24, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const mintAccent: Accent = {
  name: 'mint',
  shades: Object.values(mintDark),
  tints: Object.values(mint),
}

const radixSkyMap: Accent = {
  name: 'sky-tuned',
  color: '#7ce2fe',
  shades: defaultSettings.shades,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 10, hue: "next", saturation: "+=99" },
    15, 19, 35, 50, 104, 35,
    "primer",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const skyAccent: Accent = {
  name: 'sky',
  shades: Object.values(skyDark),
  tints: Object.values(sky),
}

const theme = useUmbra({
  foreground: '#000000',  // Pure black (shared across all accents)
  background: '#ffffff',  // Pure white (shared across all accents)
  accents: [
    radixGrayMap,
    radixBlueMap,
    infoAccent,
    radixRedMap,
    warningAccent,
    radixGreenMap,
    successAccent,
    radixTomatoMap,
    tomatoAccent,
    radixCrimsonMap,
    crimsonAccent,
    radixPinkMap,
    pinkAccent,
    radixPlumMap,
    plumAccent,
    radixPurpleMap,
    purpleAccent,
    radixVioletMap,
    violetAccent,
    radixIrisMap,
    irisAccent,
    radixIndigoMap,
    indigoAccent,
    radixCyanMap,
    cyanAccent,
    radixTealMap,
    tealAccent,
    radixJadeMap,
    jadeAccent,
    radixGrassMap,
    grassAccent,
    radixBronzeMap,
    bronzeAccent,
    radixGoldMap,
    goldAccent,
    radixBrownMap,
    brownAccent,
    radixOrangeMap,
    orangeAccent,
    radixAmberMap,
    amberAccent,
    radixYellowMap,
    yellowAccent,
    radixLimeMap,
    limeAccent,
    radixMintMap,
    mintAccent,
    radixSkyMap,
    skyAccent,
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
  "blue-tuned",
  "info",
  "red-tuned",
  "warning",
  "green-tuned",
  "success",
  "tomato-tuned",
  "tomato",
  "crimson-tuned",
  "crimson",
  "pink-tuned",
  "pink",
  "plum-tuned",
  "plum",
  "purple-tuned",
  "purple",
  "violet-tuned",
  "violet",
  "iris-tuned",
  "iris",
  "indigo-tuned",
  "indigo",
  "cyan-tuned",
  "cyan",
  "teal-tuned",
  "teal",
  "jade-tuned",
  "jade",
  "grass-tuned",
  "grass",
  "bronze-tuned",
  "bronze",
  "gold-tuned",
  "gold",
  "brown-tuned",
  "brown",
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
