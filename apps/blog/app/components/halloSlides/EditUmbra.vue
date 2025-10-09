<script setup lang="ts">
import { umbra } from '@umbrajs/core';
import type { FormatedRange } from '@umbrajs/core';
import { Slider, Button } from "umbraco"
import DyePicker from '../DyePicker.vue';

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

function applyTheme() {
  umbra({
    background: bg.value,
    foreground: fg.value,
    accents: [ac.value],
    settings: {
      readability: minimumReadability.value
    }
  }).apply()
}
</script>

<template>
  <div class="SpacingTokens">
    <div class="AliasedWrapper">

      <div class="UmbraActions border">
        <div class="ColorEdit">
          <p class="caption">Background</p>
          <DyePicker label="Background" :default-color="bg" @change="(color) => changeTheme({ background: color })" />
        </div>

        <div class="ColorEdit">
          <p class="caption">Foreground</p>
          <DyePicker label="Foreground" :default-color="fg" @change="(color) => changeTheme({ foreground: color })" />
        </div>

        <div class="ColorEdit">
          <p class="caption">Accent</p>
          <DyePicker label="Accent" :default-color="ac" @change="(color) => changeTheme({ accentValue: color })" />
        </div>


        <div class="ReadabilityWrapper">
          <p class="caption">Minimum Readability {{ minimumReadability }}</p>
          <Slider @update:model-value="(min) => minimumReadability = min.value" />
        </div>

        <Button @click="applyTheme">
          Apply
        </Button>
      </div>


      <div class="ColorLayer border">
        <div class="TokensTables">
          <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--base:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': bg }" />
            </div>
          </div>

          <div class="TokensTable">
            <div v-for="(token, index) in baseTokens" :key="token" class="SpaceToken">
              <span class="TokenName">{{ getVariableName("base", index + 1) }}:</span>
              <span class="TokenValue">{{ token }};</span>
              <div class="Swatch border" :style="{ '--color': token }" />
            </div>
          </div>

          <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--base-text:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': fg }" />
            </div>
          </div>
        </div>
      </div>

      <div class="ColorLayer border">
        <div class="TokensTables">
          <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--accent:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--base)' }" />
            </div>
          </div>

          <div class="TokensTable">
            <div v-for="(token, index) in accentTokens" :key="token" class="SpaceToken">
              <span class="TokenName">{{ getVariableName("accent", index + 1) }}:</span>
              <span class="TokenValue">{{ token }};</span>
              <div class="Swatch border" :style="{ '--color': token }" />
            </div>
          </div>


          <div class="TokensTable">
            <div class="SpaceToken">
              <span class="TokenName">--accent-text:</span>
              <span class="TokenValue"></span>
              <div class="Swatch border" :style="{ '--color': 'var(--accent-text)' }" />
            </div>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<style>
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


.UmbraActions {
  display: flex;
  gap: var(--space-4);
  grid-column: span 2;
  padding: var(--space-2);
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

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
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
