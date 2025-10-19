<script setup lang="ts">
import { umbra } from '@umbrajs/core';
import type { FormatedRange } from '@umbrajs/core';
import { Slider, Button } from "umbraco"
import DyePicker from '../DyePicker.vue';
import ColorLayer from './ColorLayer.vue';
import ColorLayerHorizontal from './ColorLayerHorizontal.vue';
import UmbraAppliedToElement from './UmbraAppliedToElement.vue';

const { focus = "tokens" } = defineProps<{
  focus: "tokens" | "element"
}>();

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
      <p class="display">We can automate it! Look how fast this is 👀</p>
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
          <Slider @update:model-value="(min) => (minimumReadability = min.value)" />
        </div>

        <div class="ApplyWrapper">
          <p class="caption">Triggers the Umbra Function</p>
          <Button @click="applyTheme">
            Apply
          </Button>
        </div>
      </div>

      <ColorLayer v-if="focus === 'tokens'" title="Base Tokens" :tokens="baseTokens" prefix="base" :main-color-var="bg"
        :text-color-var="fg" />

      <ColorLayer v-if="focus === 'tokens'" title="Accent Tokens" :tokens="accentTokens" prefix="accent"
        main-color-var="var(--base)" text-color-var="var(--accent-text)" />

      <div v-if="focus === 'element'" class="ShorterColorLayer border">
        <UmbraAppliedToElement />
      </div>

      <div v-if="focus === 'element'" class="ShorterColorLayer border">
        <ColorLayerHorizontal title="Base Tokens" :tokens="baseTokens" prefix="base" :main-color-var="bg"
          :text-color-var="fg" />

        <ColorLayerHorizontal title="Accent Tokens" :tokens="accentTokens" prefix="accent" main-color-var="var(--base)"
          text-color-var="var(--accent-text)" />
      </div>
      <!-- <p class="display">Look how fast this is 👀</p> -->
    </div>
  </div>
</template>

<style>
.ShorterColorLayer {
  grid-column: span 2;
  padding: var(--space-2);
  display: flex;
  gap: var(--space-4);
}

.AliasedWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-1);
  justify-content: center;
  align-items: center;
}

.AliasedWrapper>p {
  grid-column: span 2;
  margin-bottom: var(--space-1);
}

.ReadabilityWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 400px;
}

.ApplyWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
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
