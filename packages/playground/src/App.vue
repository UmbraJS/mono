<script setup lang="ts">
import { ref } from 'vue'
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'
import LabelsGroups from './components/ToneLabels.vue'
import ActionLabels from './components/ActionLabels.vue'
import PlayGround from './components/PlayGround.vue'

import { blue, blueDark, red, redDark, yellow, yellowDark } from '@radix-ui/colors'

const radixBlue = {
  name: 'blue',
  shades: Object.values(blueDark),
  tints: Object.values(blue)
}

const radixRed = {
  name: 'red',
  shades: Object.values(redDark),
  tints: Object.values(red)
}

const radixYellow = {
  name: 'yellow',
  shades: Object.values(yellowDark),
  tints: Object.values(yellow)
}

const success = {
  name: 'success',
  shades: [25, 25, 25, 25, 25, '#4caf50', 25, 25, 25, 25, 25, 25]
}

const royal = {
  name: 'royal',
  shades: [25, 25, 25, 25, 25, '#a94d94', 35, 25, 25, 25, 25, 25]
}

const brown = {
  name: 'brown',
  shades: [25, 25, 25, 25, 25, '#87533e', 25, 25, 25, 25, 25, 25]
}

const something = {
  shades: [10, 15, 25, 35, 35, '#4f0820', 15, 15, 15, 15, 15, 25]
}

const accent = {
  color: '#ff0157',
  shades: [25, 25, 25, 45, 25, 25, 25, 25, 25, 25, 25, 25]
}

const theme = umbra({
  background: '#000000',
  foreground: '#ffffff',
  accents: [radixBlue, radixRed, radixYellow, success, royal, brown, something, accent]
}).apply('html')

const t = ref(theme.input)
const formated = ref(theme.formated)

function inverse() {
  const newTheme = umbra(t.value.scheme).inverse().apply('html')
  t.value = newTheme.input
}

const width = ref('6rem')
const height = ref('8rem')
</script>

<template>
  <div class="page container">
    <h1 class="display">Umbra</h1>
    <button @click="() => inverse()">Invert</button>
    <div class="ranges">
      <LabelsGroups />
      <UmbraRange
        v-for="range in formated"
        :key="range.name"
        :range="range"
        :width="width"
        :height="height"
      />
      <ActionLabels />
    </div>
    <PlayGround />
  </div>
</template>

<style lang="scss">
@import './css';

.container {
  display: flex;
  gap: var(--space-m);
  flex-direction: column;
  padding-top: var(--space-m);
  padding-bottom: var(--space-m);
}

.ranges {
  display: flex;
  flex-direction: column;
  gap: 0rem;

  width: 100%;
  margin: auto;
}

.labels {
  --offset: 19px;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 0rem;
  height: 3rem;
  width: 100%;
  margin-bottom: var(--offset);
}

.shade-group {
  --radius: 13px;
  position: relative;
  grid-column: span 4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shade-group:nth-of-type(2) {
  grid-column: span 3;
}

.shade-group p {
  font-weight: 700;
  letter-spacing: 1px;
}

.shade-group .bracket {
  position: absolute;
  bottom: calc(var(--offset) * -1);
  border: solid 1px var(--base-50);

  border-bottom: 0px;
  border-top-right-radius: var(--radius);
  border-top-left-radius: var(--radius);

  width: 100%;
  height: var(--offset);
}
</style>
