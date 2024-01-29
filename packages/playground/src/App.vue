<script setup lang="ts">
import { ref } from 'vue'
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'
import LabelsGroups from './components/ToneLabels.vue'
import ActionLabels from './components/ActionLabels.vue'
import PlayGround from './components/PlayGround.vue'
import { DyePicker } from '@umbrajs/dye'
import '@umbrajs/dye/dist/style.css'

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
  color: '#4caf50'
}

const royal = {
  name: 'royal',
  color: '#4d4da9'
}

const brown = {
  name: 'brown',
  color: '#87533e'
}

const accent = {
  color: '#ff0157'
}

const accent3 = {
  color: '#e5484d'
}

const theme = umbra(
  {
    background: '#000000',
    foreground: '#ffffff',
    accents: [royal, accent, radixRed, radixYellow, radixBlue, accent3, radixRed, success, brown]
  },
  {
    formater: (color) => {
      return color.toHslString()
    }
  }
)
  .inverse()
  .apply({})

// const theme = umbra({
//   foreground: '#ffffff',
//   background: '#000000',
//   accents: ['#ff88ff'],
//   inversed: {
//     foreground: '#002200',
//     background: '#ffffff',
//     accents: ['#872455']
//   }
// }).apply()

const t = ref(theme.input)
const formated = ref(theme.formated)

function inverse() {
  const newTheme = umbra(t.value).inverse().apply({})
  t.value = newTheme.input
}

const width = ref('6rem')
const height = ref('8rem')
</script>

<template>
  <div class="page container">
    <h1 class="display">Umbra</h1>
    <DyePicker
      default="#36576a"
      @change="
        (value) => {
          console.log(value.name)
        }
      "
    />
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
