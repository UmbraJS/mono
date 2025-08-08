<script setup lang="ts">
import { ref, watch } from 'vue'
import BifrostBoard from './components/BifrostBoard.vue'
import BifrostCarbon from './components/BifrostCarbon.vue'
import BifrostFiber from './components/BifrostFibers.vue'
import { AddButton } from '@nobel/core'
import type { CarbonObject, BifrostFiberConnections } from './types'
import { hooks } from './data/index'

type BifrostCarbonType = InstanceType<typeof BifrostCarbon>

const connections = ref<BifrostFiberConnections[]>([])
const carbons = ref<CarbonObject[]>([])

function addCarbon() {
  carbons.value.push({
    id: 'carbon-' + carbons.value.length,
    position: [100, 100],
    component: undefined,
    connections: [],
    hooks: hooks
  })
}

watch(
  connections,
  (newConnections) => {
    console.log('connections', newConnections)
  },
  { deep: true }
)

watch(
  carbons,
  (newConnections) => {
    console.log('carbons', newConnections)
  },
  { deep: true }
)

function functionRef(el: BifrostCarbonType, index: number) {
  if (!el) return
  carbons.value[index].component = el
}
</script>

<template>
  <BifrostBoard>
    <AddButton @click="addCarbon" />
    <BifrostCarbon v-for="(carbon, index) in carbons" :key="carbon.id"
      :ref="(e) => functionRef(e as BifrostCarbonType, index)" :carbon="carbon" :carbons="carbons"
      :connections="connections" />
    <BifrostFiber :connections="connections" />
  </BifrostBoard>
</template>

<style>
#BifrostBoard {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background: var(--accent-20);

  border-radius: var(--radius);
  width: 60em;
  height: 100%;
  max-width: 90dvw;
}
</style>
