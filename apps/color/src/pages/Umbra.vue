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

const validationWarnings = computed(() => theme.generatedTheme.value.validationWarnings || [])

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

  // Don't auto-apply to avoid overwriting the global theme
  // applyTheme()

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

// Map warnings to their respective ranges
const warningsByRange = computed(() => {
  const warningsMap = new Map<string, typeof validationWarnings.value>()

  validationWarnings.value.forEach(warning => {
    const rangeName = warning.context?.accentName || 'base'
    if (!warningsMap.has(rangeName)) {
      warningsMap.set(rangeName, [])
    }
    warningsMap.get(rangeName)?.push(warning)
  })

  return warningsMap
})

// Track which ranges have their warnings expanded
const expandedWarnings = ref<Set<string>>(new Set())

function toggleWarnings(rangeName: string) {
  if (expandedWarnings.value.has(rangeName)) {
    expandedWarnings.value.delete(rangeName)
  } else {
    expandedWarnings.value.add(rangeName)
  }
}

function stringIncludesTheWordTuned(str: string) {
  return str.toLowerCase().includes("tuned")
}
</script>

<template>
  <div class="umbra-page">
    <div class="page-header">
      <div class="controls">
        <Button @click="() => theme.inverseTheme(false)" class="base-warning">Inverse Theme</Button>
        <div class="mode-selector">
          <Button :variant="displayMode === 'lightness' ? 'primary' : 'base'" size="small"
            @click="displayMode = 'lightness'">
            Lightness
          </Button>
          <Button :variant="displayMode === 'saturation' ? 'primary' : 'base'" size="small"
            @click="displayMode = 'saturation'">
            Saturation
          </Button>
          <Button :variant="displayMode === 'hue' ? 'primary' : 'base'" size="small" @click="displayMode = 'hue'">
            Hue
          </Button>
        </div>
      </div>
    </div>

    <div class="umbra-wrapper">
      <div class="range-grid">
        <div v-for="range in filteredUmbraOutput" :key="range.name" class="ColorCard">

          <div class="card-header" @click="finishedEntries.push(range.name)">
            <h3 class="color-name">{{ range.name }}</h3>
            <button v-if="warningsByRange.get(range.name)?.length" class="warning-indicator"
              :class="{ expanded: expandedWarnings.has(range.name) }" @click.stop="toggleWarnings(range.name)"
              :title="`${warningsByRange.get(range.name)?.length} warning(s)`">
              <span class="warning-icon">⚠️</span>
              <span class="warning-count">{{ warningsByRange.get(range.name)?.length }}</span>
            </button>
          </div>

          <!-- Validation Warnings Section (Expandable) -->
          <div v-if="expandedWarnings.has(range.name) && warningsByRange.get(range.name)?.length"
            class="warnings-section">
            <div v-for="(warning, index) in warningsByRange.get(range.name)" :key="index" class="warning-item">
              <div class="warning-header">
                <span class="warning-severity" :class="warning.severity">{{ warning.severity }}</span>
                <span class="warning-type">{{ warning.type }}</span>
              </div>
              <p class="warning-message">{{ warning.message }}</p>
              <div v-if="warning.context" class="warning-context">
                <code>{{ JSON.stringify(warning.context, null, 2) }}</code>
              </div>
            </div>
          </div>

          <div class="card-content">
            <div v-if="displayMode === 'lightness'" class="TokensLightness">
              <ColourLightness v-for="color in range.range" :color="color.swatch" :key="color.index" />
            </div>

            <div v-if="displayMode === 'saturation'" class="TokensSaturation">
              <ColourSaturation v-for="color in range.range" :color="color.swatch" :key="color.index" />
            </div>

            <div v-if="displayMode === 'hue'" class="TokensHue">
              <ColourHue v-for="color in range.range" :color="color.swatch" :key="color.index" />
            </div>

            <div class="tokens">
              <div class="caps color" :style="`--color: ${range.background.swatch.toHex()}`"></div>
              <div v-for="(color, index) in range.range" :key="index" class="color"
                :style="`--color: ${color.swatch.toHex()}`">
                <p class="token-label caption">{{ getTokenName(index) }}</p>
              </div>
              <div class="caps color" :style="`--color: ${range.foreground.swatch.toHex()}`"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.umbra-page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--space-4);
}

.page-header {
  margin-bottom: var(--space-5);
}

.controls {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  padding: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius-3);
}

.mode-selector {
  display: flex;
  gap: var(--space-2);
}

.umbra-wrapper {
  width: 100%;
}

.range-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
  width: 100%;
}

.ColorCard {
  background: var(--base-10);
  border: 1px solid var(--base-20);
  border-radius: var(--radius-3);
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.ColorCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--base-30);
}

.card-header {
  padding: var(--space-3);
  background: var(--base-20);
  border-bottom: 1px solid var(--base-30);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s ease;
}

.card-header:hover {
  background: var(--base-30);
}

.color-name {
  margin: 0;
  font-size: var(--font-size-3);
  font-weight: 600;
  color: var(--base-text);
  text-transform: capitalize;
}

.warning-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  background: var(--warning-20);
  border: 1px solid var(--warning-40);
  border-radius: var(--radius-2);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--warning-text);
  font-size: var(--font-size-1);
}

.warning-indicator:hover {
  background: var(--warning-30);
  border-color: var(--warning-60);
  transform: scale(1.05);
}

.warning-indicator.expanded {
  background: var(--warning-40);
  border-color: var(--warning-80);
}

.warning-icon {
  font-size: 14px;
  line-height: 1;
}

.warning-count {
  font-weight: 600;
  font-size: 11px;
}

.warnings-section {
  padding: var(--space-3);
  background: var(--warning-10);
  border-bottom: 1px solid var(--warning-30);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }

  to {
    opacity: 1;
    max-height: 500px;
  }
}

.warning-item {
  background: var(--base);
  border: 1px solid var(--warning-40);
  border-radius: var(--radius-2);
  padding: var(--space-2);
  margin-bottom: var(--space-2);
}

.warning-item:last-child {
  margin-bottom: 0;
}

.warning-header {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.warning-severity {
  padding: 2px var(--space-1);
  border-radius: var(--radius-1);
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
}

.warning-severity.warning {
  background: var(--warning-40);
  color: var(--warning-text);
}

.warning-severity.error {
  background: var(--error-40);
  color: var(--error-text);
}

.warning-type {
  padding: 2px var(--space-1);
  background: var(--base-20);
  color: var(--base-text);
  border-radius: var(--radius-1);
  font-size: 10px;
  text-transform: uppercase;
}

.warning-message {
  margin: var(--space-1) 0;
  color: var(--base-text);
  font-size: var(--font-size-1);
  line-height: 1.4;
}

.warning-context {
  margin-top: var(--space-1);
  padding: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius-1);
  overflow-x: auto;
}

.warning-context code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 10px;
  color: var(--base-110);
  white-space: pre;
}

.card-content {
  padding: var(--space-3);
}

.TokensLightness,
.TokensSaturation,
.TokensHue {
  display: flex;
  align-items: flex-end;
  height: 100px;
  margin-bottom: var(--space-3);
  gap: 2px;
}

.tokens {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: var(--radius-2);
  border: 1px solid var(--base-30);
}

.color {
  position: relative;
  flex: 1;
  min-width: 20px;
  aspect-ratio: 1 / 1;
  background: var(--color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.caps {
  flex: 0.5;
  opacity: 0.5;
}

.token-label {
  opacity: 0;
  font-weight: 900;
  font-size: 10px;
  color: var(--base-text);
  transition: opacity 0.2s ease;
}

.color:hover .token-label {
  opacity: 0.6;
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
</style>
