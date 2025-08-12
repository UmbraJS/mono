<script setup lang="ts">
import { ref } from 'vue'
import BifrostBoard from './components/BifrostBoard.vue'
import BifrostCarbon from './components/BifrostCarbon.vue'
import BifrostFibers from './components/BifrostFibers.vue'
import { AddButton } from '@nobel/core'
import type { CarbonObject, BifrostFiberConnections, CarbonState } from './types'
import { generateId } from './utils/id'
import { hooks } from './data/index'

type BifrostCarbonType = InstanceType<typeof BifrostCarbon>

const connections = ref<BifrostFiberConnections[]>([])
const carbons = ref<CarbonObject[]>([])

function nextCarbonId() { return generateId('carbon') }

function addCarbon() {
  carbons.value.push({
    id: nextCarbonId(),
    position: [100, 100],
    component: undefined,
    state: ['idle'],
    connections: [],
    hooks
  })
}

function onAddCarbon(carbon: CarbonObject) {
  if (carbons.value.some(c => c.id === carbon.id)) carbon.id = nextCarbonId()
  carbons.value.push(carbon)
}

function onAddConnection(connection: BifrostFiberConnections) {
  connections.value.push(connection)
  console.log('Adding connection:', connection, connections.value)
}

function changeCarbon(props: {
  id: string
  state: CarbonState[]
}) {
  const index = carbons.value.findIndex(c => c.id === props.id)
  if (index === -1) return
  carbons.value[index] = { ...carbons.value[index], state: props.state }
  console.log('Changing carbon:', index, props.id, carbons.value)
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
      :connections="connections" @add-carbon="onAddCarbon" @add-connection="onAddConnection"
      @change-carbon="changeCarbon" />
    <BifrostFibers :connections="connections" :carbons="carbons" />
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
