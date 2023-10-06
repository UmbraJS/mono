<script setup lang="ts">
import { ref } from 'vue'
import { umbra } from '@umbrajs/core'
import UmbraRange from './components/UmbraRange.vue'
import LabelsGroups from './components/ToneLabels.vue'
import ActionLabels from './components/ActionLabels.vue'

const success = {
  name: 'success',
  shades: [25, 25, 25, 25, '#a94d94', 35, 25, 25, 25]
}

const royal = {
  name: 'royal',
  shades: [25, 25, 25, 25, '#87533e', 25, 25, 25, 25]
}

const something = {
  //color: '#4f0820',
  shades: [35, 55, 25, 15, '#4f0820', 25, 25, 25, 25]
}

const another = {
  color: '#e91e63',
  shades: [25, 25, 45, 25, 25, 25, 25, 25, 25]
}

const theme = umbra({
  background: 'white',
  foreground: 'black',
  accents: [another, success, royal, something]
}).apply({ alias: true })

const width = ref('6rem')
const height = ref('8rem')
</script>

<template>
  <div class="ranges">
    <LabelsGroups />

    <UmbraRange
      v-for="range in theme.formated"
      :key="range.name"
      :range="range"
      :umbra="theme"
      :width="width"
      :height="height"
    />

    <ActionLabels />
  </div>
</template>

<style scoped>
.ranges {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

.labels {
  --offset: 19px;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
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
