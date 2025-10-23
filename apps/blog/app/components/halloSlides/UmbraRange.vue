<script setup lang="ts">
import { umbra } from '@umbrajs/core';
import type { FormatedRange } from '@umbrajs/core';
import { Button } from "umbraco";
import ColorLayer from './ColorLayer.vue';

defineProps<{
  simple?: boolean
}>();

const lol = umbra({
  background: 'black',
  foreground: 'white',
  accents: [
    "#0000ff",
    "#ff0000",
    "#00ff00",
  ]
});

const formated = lol.format();
const base = formated.formated[0] as FormatedRange;
const accent = formated.formated[1] as FormatedRange;
const warning = formated.formated[2] as FormatedRange;
const success = formated.formated[3] as FormatedRange;

const baseTokens = base.shades
const accentTokens = accent.shades
const warningTokens = warning.shades
const successTokens = success.shades

const addedRanges = ref(0);
</script>

<template>
  <div class="SpacingTokens">
    <div class="ColorLayersWrapper">

      <ColorLayer :helpers="true" title="Base Range" :tokens="baseTokens" prefix="base" main-color-var="var(--base)"
        text-color-var="var(--base-text)" />

      <div v-if="addedRanges > 0" class="divider"></div>

      <ColorLayer v-if="addedRanges > 0" title="Accent Range" :tokens="accentTokens" prefix="accent"
        main-color-var="var(--accent)" text-color-var="var(--accent-text)" />

      <ColorLayer v-if="addedRanges > 1" title="Warning Range" :tokens="warningTokens" prefix="warning"
        main-color-var="var(--warning)" text-color-var="var(--warning-text)" />

      <ColorLayer v-if="addedRanges > 2" title="Success Range" :tokens="successTokens" prefix="success"
        main-color-var="var(--success)" text-color-var="var(--success-text)" />


      <div class="AddRangeButton">
        <Button v-if="addedRanges < 3" @click="addedRanges++">
          <Icon name="carbon:add" />
        </Button>
        <Button v-if="addedRanges > 0" @click="addedRanges--">
          <Icon name="carbon:subtract" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.AddRangeButton {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.divider {
  width: 1px;
  background-color: var(--base-50);
  margin: 0 var(--space-2);
  height: 100%;
}

.ColorLayersWrapper {
  position: relative;
  display: flex;
  gap: var(--space-1);
  justify-content: center;
  align-items: center;
}

.SpacingTitle {
  color: var(--base-50);
}

.SpacingTokens {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
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
</style>
