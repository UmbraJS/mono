<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FormatedRange } from '@umbrajs/core';
import { Slider, Button } from "umbraco"
import DyePicker from '../DyePicker.vue';
import ColorLayer from './ColorLayer.vue';
import ColorLayerHorizontal from './ColorLayerHorizontal.vue';
import { useUmbra } from '../../stores/useUmbra';

const { showTokens = true, showHorizontal = false } = defineProps<{
  showTokens?: boolean
  showHorizontal?: boolean
}>();

const umbraStore = useUmbra();

const bg = ref(umbraStore.input.background || "#000000");
const fg = ref(umbraStore.input.foreground || "#ffffff");
const ac = ref(
  typeof umbraStore.input.accents?.[0] === 'string'
    ? umbraStore.input.accents[0]
    : umbraStore.input.accents?.[0]?.color || "#6400ff"
);

const minimumReadability = computed({
  get: () => umbraStore.readability.target,
  set: (value) => umbraStore.setReadability(value)
});

const base = computed(() => umbraStore.formated[0] as FormatedRange);
const accent = computed(() => umbraStore.formated[1] as FormatedRange);

const baseTokens = computed(() => base.value?.shades || []);
const accentTokens = computed(() => accent.value?.shades || []);

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

async function applyTheme() {
  umbraStore.setActiveTheme(null);
  await umbraStore.apply({
    scheme: {
      background: bg.value,
      foreground: fg.value,
      accents: [ac.value],
      settings: {
        readability: minimumReadability.value
      }
    }
  });
}
</script>

<template>
  <div class="SpacingTokens">
    <div class="AliasedWrapper">
      <!-- Controls -->
      <div class="UmbraActions border">
        <div class="DyePickers">
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
        </div>

        <div class="ReadabilityWrapper">
          <p class="caption">Minimum Readability {{ minimumReadability }}</p>
          <Slider @update:model-value="(min) => (minimumReadability = min.value)" />
        </div>

        <div class="ApplyWrapper">
          <p class="caption">Apply Theme</p>
          <Button @click="applyTheme">
            Apply
          </Button>
        </div>
      </div>

      <!-- Token displays -->
      <ColorLayer v-if="showTokens && !showHorizontal" title="Base Tokens" :tokens="baseTokens" prefix="base"
        :main-color-var="bg" :text-color-var="fg" />

      <ColorLayer v-if="showTokens && !showHorizontal" title="Accent Tokens" :tokens="accentTokens" prefix="accent"
        main-color-var="var(--base)" text-color-var="var(--accent-text)" />

      <div v-if="showHorizontal" class="HorizontalColorLayers border">
        <ColorLayerHorizontal title="Base Range" :tokens="baseTokens" prefix="base" :main-color-var="bg"
          :text-color-var="fg" />

        <ColorLayerHorizontal title="Accent Range" :tokens="accentTokens" prefix="accent" main-color-var="var(--base)"
          text-color-var="var(--accent-text)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.DyePickers {
  display: flex;
  gap: var(--space-2);
}

.HorizontalColorLayers {
  grid-column: span 2;
  padding: var(--space-2);
  display: flex;
  gap: var(--space-4);
}

.AliasedWrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.ReadabilityWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 300px;
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
  padding: var(--space-3);
  justify-content: space-between;
  align-items: center;
  background: var(--base-10);
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

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4);
}
</style>
