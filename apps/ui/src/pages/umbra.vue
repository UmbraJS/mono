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

const theme = useUmbra({
  foreground: '#000000',
  background: '#ffffff',
  accents: [
    "#ff00ff",
    {
      name: 'primary',
      shades: defaultSettings.tints,
      tints: [2, 5, 6, {
        mix: 18,
        saturation: 88
      }, {
          mix: 33,
          saturation: 20
        }, 14, 18, 15, '#0090ff', 15, 15, 25],
    },
    infoAccent,
    warningAccent,
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
</script>

<template>
  <div id="ThemeControls">
    <Button @click="() => theme.inverseTheme(false)">Inverse Theme</Button>
  </div>
  <div class="umbra-wrapper">
    <div class="range-list">
      <div v-for="range in theme.generatedTheme.value.output" :key="range.name" class="ColorList">
        <!-- <div class="color-name">{{ range.name }}</div> -->
        <!-- <div class="TokensLightness">
          <ColourLightness v-for="color in range.range" :color="color" />
        </div> -->

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
.TokensLightness {
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
