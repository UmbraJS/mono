<script setup lang="ts">
import { umbra, defaultSettings, resolveTints, format } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput, UmbraSwatch } from '@umbrajs/core'
import { Button } from "umbraco"
import { ref, computed, watch } from 'vue'
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
import PageHeader from '../components/PageHeader.vue';
import ModeSelector from '../components/ModeSelector.vue';
import UmbraRangeGrid from '../components/UmbraRangeGrid.vue';
import { useUmbra as useUmbraStore } from '../stores/useUmbra';

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

// Get the global pinia store to sync with
const umbraStore = useUmbraStore()

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

  // Watch the global store's isDark state and sync this local theme
  watch(
    () => umbraStore.isDark,
    (isDark) => {
      // Check if we need to inverse the theme to match the global state
      const currentThemeIsDark = generatedTheme.value.isDark()
      if (isDark !== currentThemeIsDark) {
        inverseTheme(true)
      }
    },
    { immediate: true }
  )

  return {
    applyTheme,
    inverseTheme,
    generatedTheme,
  }
}

function getTokenName(index: number) {
  return index * 10 + 10
}

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
    <PageHeader />

    <UmbraRangeGrid :ranges="filteredUmbraOutput" :warningsByRange="warningsByRange"
      :expandedWarnings="expandedWarnings" @toggleWarnings="toggleWarnings" />
  </div>
</template>

<style scoped lang="scss">
.umbra-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}
</style>
