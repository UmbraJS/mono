<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisCrosshair } from '@unovis/vue'

type DataRecord = {
  x: number
  y: number
  y1: number
  y2: number
}

defineProps<{ data: DataRecord[] }>()
const padding = {
  top: 0,
  bottom: 0
}
const x = (d: DataRecord) => d.x
const y = [
  (d: DataRecord) => d.y,
  (d: DataRecord) => d.y1,
  (d: DataRecord) => d.y2
]

// const attributes = [
//   { key: 'y', type: 'line' },
//   { key: 'y1', type: 'line' },
//   { key: 'y2', type: 'line' },
// ]

// const tooltipContent = (items: any[]) => {
//   // items will include all lines hovered at that x
//   return `
//     <div>
//       ${items.map((item) => {
//     return `<div><strong>${item.key || 'Value'}:</strong> ${item.datum[item.attribute]}</div>`
//   }).join('')}
//     </div>
//   `
// }
</script>

<template>
  <VisXYContainer class="NobleGraph" :padding="padding" :data="data">
    <!-- <VisTooltip :content="tooltipContent" /> -->
    <VisLine :x="x" :y="y" />
    <VisAxis type="x" />
    <VisAxis type="y" />
    <VisCrosshair />
  </VisXYContainer>
</template>

<style>
.NobleGraph {
  --vis-font-family: Inter, Arial, "Helvetica Neue", Helvetica, sans-serif;
  --vis-color-main: #4D8CFD;
  --vis-color-main-light: #d0e0fe;
  --vis-color-main-dark: #3c588a;
  --vis-color-grey: #2a2a2a;

  --vis-color0: var(--warning-100);
  --vis-color1: var(--success-100);
  --vis-color2: var(--info-100);
  --vis-color3: var(--yellow-100);
  --vis-color4: #00C19A;
  --vis-color5: #6859BE;
}

.NobleGraph {
  --vis-axis-tick-color: #e8e9ef;
  --vis-axis-grid-color: var(--base-40);
  --vis-axis-label-color: #6c778c;
  --vis-axis-tick-label-color: #6c778c;
  --vis-dark-axis-tick-color: #6c778c;
  --vis-dark-axis-tick-label-color: #e8e9ef;
  --vis-dark-axis-grid-color: var(--base-30);
  --vis-dark-axis-label-color: #fefefe;
}
</style>
