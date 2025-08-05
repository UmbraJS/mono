<script setup lang="ts">
import { ref, watch } from 'vue'
import Carbon from './components/Carbon/Carbon.vue'
import Connections from './components/Connections.vue'
import { AddButton } from '@nobel/core'
import type { CarbonObject, Connection } from './types'
import { hooks } from './data/index'

const board = ref<HTMLDivElement>()
const connections = ref<Connection[]>([])
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

function functionRef(el: any, index: number) {
  carbons.value[index].component = el
}
</script>

<template>
  <div ref="board" id="board">
    <AddButton @click="addCarbon" />
    <Carbon v-for="(carbon, index) in carbons" :key="carbon.id" :ref="(e) => functionRef(e, index)" :carbon="carbon"
      :carbons="carbons" :bounds="board" :connections="connections" />
    <Connections :connections="connections" :bounds="board" />
  </div>
</template>

<style>
.bounds {
  height: 100%;
  width: 100%;
}

#board {
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
