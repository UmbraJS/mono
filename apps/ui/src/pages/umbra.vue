<script setup lang="ts">
import { umbra, defaultSettings, resolveTints } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput, UmbraSwatch } from '@umbrajs/core'
import { Button } from "umbraco"
import { ref } from 'vue'
import {
  gray,
  blue,
  red,
  green,
  grayDark,
  blueDark,
  redDark,
  greenDark,
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

console.log("rex: ", Object.values(blue))

const radixGrayMap: Accent = {
  name: 'gray',
  shades: defaultSettings.shades,
  tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],
}

const radixBlueMap: Accent = {
  name: 'blue',
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
    "primary",  // The main accent - brightest, most saturated blue
    { mix: "+=5", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=6", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=35", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixRedMap: Accent = {
  name: 'red',
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
    "primary",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=5", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=40", hue: 0, saturation: "-=29" } // Dark blue
  ],
}

const radixGreenMap: Accent = {
  name: 'green',
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
    "primary",  // The main accent - brightest, most saturated blue
    { mix: "+=6", hue: 0, saturation: "-=4" },   // Darken but keep blue hue
    { mix: "+=12", hue: 0, saturation: "-=12" },  // Continue darkening
    { mix: "+=31", hue: 0, saturation: "-=29" } // Dark blue
  ],
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
      <div v-for="range in theme.generatedTheme.value.output" :key="range.name" class="ColorList">
        <!-- <div class="color-name">{{ range.name }}</div> -->
        <div v-if="displayMode === 'lightness'" class="TokensLightness">
          <ColourLightness v-for="color in range.range" :color="color" />
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
