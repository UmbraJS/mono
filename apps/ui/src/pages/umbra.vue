<script setup lang="ts">
import { umbra } from '@umbrajs/core'
import type { Accent, Umbra, UmbraInput } from '@umbrajs/core'
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
    '#9999ff',
    warningAccent,
    successAccent,
    infoAccent,
  ],
  settings: {
    shades: Object.values(grayDark),
    tints: Object.values(gray),
  }
})

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
    <button @click="() => theme.inverseTheme(false)">Inverse Theme</button>
  </div>
  <div class="umbra-wrapper">
    <div class="range-list">
      <div v-for="range in theme.generatedTheme.value.output" :key="range.name" class="color-list">
        <div class="color-name">{{ range.name }}</div>
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

<style>
#TokenName {
  opacity: 0.2;
  font-weight: 900;
}

.color-list:first-of-type .tokens {
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.color-list:last-of-type .tokens {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.color-list:not(:last-of-type, :first-of-type) .tokens {
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

.color-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
}

.color-list:hover {
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
