<script setup lang="ts">
import { umbra, defaultSettings, resolveTints, format } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput, UmbraSwatch } from '@umbrajs/core'
import { Button } from "umbraco"
import { ref, computed } from 'vue'
import {
  gray,
  grayDark,
  mauve,
  mauveDark,
  slate,
  slateDark,
  sage,
  olive,
  sand,
  ruby
} from "@radix-ui/colors";
import ColourLightness from '../components/colour/Lightness.vue';
import ColourSaturation from '../components/colour/Saturation.vue';
import ColourHue from '../components/colour/Hue.vue';

const radixBlueMap: Accent = {
  name: 'blue',
  color: 'blue',
}

const radixBlueTestMap: Accent = {
  name: 'blue-test',
  color: '#001099',
}

const radixRedMap: Accent = {
  name: 'red',
  color: 'red',
}

const radixGreenMap: Accent = {
  name: 'green',
  color: 'green',
}

const radixTomatoMap: Accent = {
  name: 'tomato',
  color: 'tomato',
}

const radixCrimsonMap: Accent = {
  name: 'crimson',
  color: 'crimson',
}

const radixPinkMap: Accent = {
  name: 'pink',
  color: 'pink',
}

const radixPlumMap: Accent = {
  name: 'plum',
  color: 'plum',
}

const radixPurpleMap: Accent = {
  name: 'purple',
  color: 'purple'
}

const radixVioletMap: Accent = {
  name: 'violet',
  color: 'violet',
}

const radixIrisMap: Accent = {
  name: 'iris',
  color: 'iris',
}

const radixIndigoMap: Accent = {
  name: 'indigo',
  color: 'indigo',
}

const radixCyanMap: Accent = {
  name: 'cyan',
  color: 'cyan',
}

const radixTealMap: Accent = {
  name: 'teal',
  color: 'teal',
}

const radixJadeMap: Accent = {
  name: 'jade',
  color: 'jade',
}

const radixGrassMap: Accent = {
  name: 'grass',
  color: 'grass',
}

const radixBronzeMap: Accent = {
  name: 'bronze',
  color: 'bronze',
}

const radixGoldMap: Accent = {
  name: 'gold',
  color: 'gold',
}

const radixBrownMap: Accent = {
  name: 'brown',
  color: 'brown',
}

const radixOrangeMap: Accent = {
  name: 'orange',
  color: 'orange',
}

const radixAmberMap: Accent = {
  name: 'amber',
  color: 'amber'
}

const radixYellowMap: Accent = {
  name: 'yellow',
  color: 'yellow',
}

const radixLimeMap: Accent = {
  name: 'lime',
  color: 'lime',
}

const radixMintMap: Accent = {
  name: 'mint',
  color: 'mint',
}

const radixSkyMap: Accent = {
  name: 'sky',
  color: 'sky',
}

const theme = useUmbra({
  foreground: '#000000',  // Pure black (shared across all accents)
  background: '#ffffff',  // Pure white (shared across all accents)
  baseRange: {
    dark: Object.values(slateDark),
    light: Object.values(slate),
  },
  accents: [
    radixBlueTestMap,
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
})

// theme.generatedTheme.value.output.forEach(range => {
//   range.range = range.range.map(color => swatch(color.toHex()))
// })

function useUmbra(schema: UmbraInput) {
  const initTheme = umbra(schema)
  console.log('Initialized Umbra Theme:', {
    init: initTheme,
    formatted: initTheme.format(),
  })
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

const finishedEntries = ref<string[]>([
  // "base",
  // "gray",
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
    <Button @click="() => theme.inverseTheme(false)" class="base-warning">Inverse Theme</Button>
    <!-- <Button @click="cycleMode">
      Mode: {{ displayMode.charAt(0).toUpperCase() + displayMode.slice(1) }}
    </Button> -->
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
        <!-- <div class="color-name">{{ range.name }}</div> -->
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
