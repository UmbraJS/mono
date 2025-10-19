<script setup lang="ts">
import { umbra } from '@umbrajs/core';
import type { FormatedRange } from '@umbrajs/core';
import type { ComponentPublicInstance } from 'vue';
import { Slider, Button } from "umbraco"
import DyePicker from '../DyePicker.vue';
import UmbraAppliedToElement from './UmbraAppliedToElement.vue';

const bg = ref("#000000");
const fg = ref("#ffffff");
const ac = ref("#6400ff");

const minimumReadability = ref(50);

const theme = umbra({
  background: bg.value,
  foreground: fg.value,
  accents: [ac.value]
});

const formated = ref(theme.format().formated)

watch([bg, fg, ac, minimumReadability], ([newBg, newFg, newAc, newMinRead]) => {
  const newTheme = umbra({
    background: newBg,
    foreground: newFg,
    accents: [newAc],
    settings: {
      readability: newMinRead
    }
  });
  formated.value = newTheme.format().formated;
});

const base = computed(() => formated.value[0] as FormatedRange);
const accent = computed(() => formated.value[1] as FormatedRange);

const baseTokens = computed(() => base.value.shades);
const accentTokens = computed(() => accent.value.shades);

function getVariableName(prefix: string, entryNumber: number): string {
  return `--${prefix}-${entryNumber * 10}`;
}

function changeTheme({
  background,
  foreground,
  accentValue
}: {
  background?: string;
  foreground?: string;
  accentValue?: string;
}) {
  if (background) bg.value = background;
  if (foreground) fg.value = foreground;
  if (accentValue) ac.value = accentValue;
}

const themes = [
  {
    name: "Starfish",
    background: "#0B1A2D",
    foreground: "#FFFFFF",
    accents: ["#FF6F61", "#6B5B95", "#88B04B"],
  },
  {
    name: "Sunset",
    background: "#310000",
    foreground: "#d3bcfe",
    accents: ["#fe10d6", "#FFD97D", "#FF6F91"],
  },
  {
    name: "Forest",
    background: "#1B2A20",
    foreground: "#E6F2E1",
    accents: ["#A3CFA0", "#6B8E23", "#C4DFAA"],
  },
]

const themeRefs = ref<HTMLButtonElement[]>([])

onBeforeUpdate(() => {
  themeRefs.value = []
})

function applyThemeToElement(index: number) {
  const element = themeRefs.value[index]
  const themeInput = themes[index]
  if (!element || !themeInput) return

  umbra({
    background: themeInput.background,
    foreground: themeInput.foreground,
    accents: themeInput.accents,
  }).apply({
    target: element,
  })
}

function setThemeRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (!(el instanceof HTMLButtonElement)) return
  themeRefs.value[index] = el
  applyThemeToElement(index)
}


function applyTheme(themeName: string) {
  const selectedTheme = themes.find(t => t.name === themeName);
  if (!selectedTheme) return
  umbra({
    background: selectedTheme.background,
    foreground: selectedTheme.foreground,
    accents: selectedTheme.accents,
  }).apply()
}
</script>

<template>
  <div class="SpacingTokens">
    <div class="ExampleResult">
      <UmbraAppliedToElement />
    </div>
    <div class="AliasedWrapper">
      <p class="display">Premade Themes</p>
      <div class="MyUmbraActions">
        <button v-for="(value, index) in themes" :key="value.name" :ref="(el) => setThemeRef(el, index)" class="Theme"
          @click="applyTheme(value.name)">
          <div class="AccentRange">
            <div class="PrimaryAccent"></div>
            <div class="AccentShade1"></div>
            <div class="AccentShade2"></div>
            <div class="AccentShade3"></div>
          </div>
          <div class="ThemeInfo">
            <p class="display"><span>{{ value.name }}</span></p>
          </div>
        </button>
      </div>
    </div>



  </div>
</template>

<style>
button.Theme {
  background-color: var(--base);
  border: 1px solid var(--base-40);
  color: var(--base-120);
  border-radius: var(--radius);
  cursor: pointer;
  overflow: hidden;
  width: 150px;
}

button.Theme:hover {
  border-color: var(--accent-100);
}

button.Theme:active {
  border-color: var(--accent-120);
}

.ThemeInfo {
  display: flex;
  padding: var(--space-1);
}

.AccentRange {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  height: 40px;
  width: 100%;
}

.PrimaryAccent {
  background-color: var(--accent-100);
}

.AccentShade1 {
  background-color: var(--accent-80);
}

.AccentShade2 {
  background-color: var(--accent-60);
}

.AccentShade3 {
  background-color: var(--accent-40);
}

button.Theme p {
  color: var(--base-120);
}

.AliasedWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1);
  justify-content: center;
  align-items: center;
}

.ReadabilityWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 400px;
}


.MyUmbraActions {
  display: flex;
  gap: var(--space-4);
  grid-column: span 2;
  justify-content: center;
  align-items: center;
}

.ColorEdit {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ColorEdit:has(.DyePickerContainer.open),
.ColorEdit:hover {
  position: relative;
  z-index: 999999;
}

.SpacingTitle {
  color: var(--base-50);
}

.SpaceToken {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  gap: var(--space-2);
  align-items: center;
}

.ExampleResult {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.TokensTable {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
}

.TokenText {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0px var(--space-2);
  color: var(--base-50);
}

.TokenText span {
  color: var(--base-text);
}

.TokenName {
  color: var(--base-text);
  font-weight: 500;
}

.TokenValue {
  color: var(--base-50);
  font-family: monospace;
}

.Swatch {
  height: 1.8em;
  width: 1.8em;
  background-color: var(--color);
}
</style>
