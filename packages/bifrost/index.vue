<script setup lang="ts">
import { ref, provide } from 'vue'
import BifrostBoard from './components/BifrostBoard.vue'
import BifrostCarbon from './components/BifrostCarbon.vue'
import BifrostFibers from './components/BifrostFibers.vue'
import { AddButton } from '@nobel/core'
import type { CarbonObject, BifrostFiberConnections } from './types'
import { hooks } from './data/index'

type BifrostCarbonType = InstanceType<typeof BifrostCarbon>

const connections = ref<BifrostFiberConnections[]>([])
const carbons = ref<CarbonObject[]>([])

// Central ID generation to avoid collisions with child-emitted carbons
let carbonIdCounter = 0
function nextCarbonId() {
  // Ensure uniqueness even if counter lags behind manual additions
  while (carbons.value.some(c => c.id === `carbon-${carbonIdCounter}`)) carbonIdCounter++
  return `carbon-${carbonIdCounter++}`
}
provide('BifrostNextCarbonId', nextCarbonId)

function addCarbon() {
  const id = nextCarbonId()
  carbons.value.push({
    id,
    position: [100, 100],
    component: undefined,
    state: ['idle'],
    connections: [],
    hooks
  })
}

function onAddCarbon(carbon: CarbonObject) {
  carbons.value.push(carbon)
  // Sync counter if needed
  const emittedIndex = Number(carbon.id.replace('carbon-', ''))
  if (!Number.isNaN(emittedIndex) && emittedIndex >= carbonIdCounter) {
    carbonIdCounter = emittedIndex + 1
  }
}

function onAddConnection(connection: BifrostFiberConnections) {
  connections.value.push(connection)
}

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
      :connections="connections" @add-carbon="onAddCarbon" @add-connection="onAddConnection" />
    <BifrostFibers :connections="connections" />
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
