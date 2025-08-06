<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import type { CarbonObject, BifrostFiberConnections, HookType } from '../types'
import CarbonHooks from './CarbonHooks.vue'
import { hooks } from '../data/index'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

const title = 'Carbon'
const props = defineProps<{
  carbon: CarbonObject
  carbons: CarbonObject[]
  bounds?: HTMLDivElement
  connections: BifrostFiberConnections[]
}>()

const carbonref = ref<HTMLDivElement>()
const dragHandle = ref<HTMLDivElement>()
const inputs = ref<InstanceType<typeof CarbonHooks>>()
const outputs = ref<InstanceType<typeof CarbonHooks>>()

const top = computed(() => `${props.carbon.position[1]}px`)
const left = computed(() => `${props.carbon.position[0]}px`)

function updateReferences() {
  connections.value.forEach((connection) => {
    // Stores carbon reference in connection object
    const isFrom = connection.output.carbon === props.carbon.id
    isFrom
      ? (connection.output.component = props.carbon.component)
      : (connection.input.component = props.carbon.component)
  })
}

defineExpose({ inputs, outputs, updateReferences })

const connections = computed(() => props.connections.filter(isRelatedConnection))

onMounted(() => {
  gsap.registerPlugin(InertiaPlugin)
  gsap.registerPlugin(Draggable)

  const carbonEl = carbonref.value
  if (!carbonEl) return
  updateReferences()

  Draggable.create(carbonEl, {
    bounds: props.bounds,
    trigger: dragHandle.value,
    inertia: false,
    edgeResistance: 0.9,
    onDrag: updateFibers
  })
})

function updateFibers() {
  // Updates the path out of and into the carbon
  connections.value.forEach((connection) => {
    connection.component?.update()
  })
}

function setFibers(carbonId: string) {
  const parentCarbon = props.carbons.find((carbon) => carbon.id === carbonId)
  parentCarbon?.component?.updateReferences()
  setTimeout(() => updateFibers(), 0)
}

function addHookedCarbon(carbonId: string, type: HookType, hookIndex: number) {
  const childId = 'carbon-' + props.carbons.length
  props.carbons.push({
    id: childId,
    position: [200, 200],
    component: undefined,
    connections: [carbonId],
    hooks: hooks
  })
  addConnection(carbonId, childId, type, hookIndex)
  setFibers(carbonId)
}

function addConnection(carbonId: string, childId: string, type: HookType, hookIndex: number) {
  const fromOutput = type === 'output' || type === 'sink' // Is this connection being dragged out from a carbon output?
  const isOutputInout = type === 'output' || type === 'input' // Is this connection an output to input connection?

  props.connections.push({
    id: 'connection-' + props.connections.length,
    type: isOutputInout ? 'output-input' : 'source-sink',
    output: {
      carbon: fromOutput ? carbonId : childId,
      hook: fromOutput ? hookIndex : 0
    },
    input: {
      carbon: fromOutput ? childId : carbonId,
      hook: fromOutput ? 0 : hookIndex
    }
  })
}

function isRelatedConnection(connection: BifrostFiberConnections) {
  const isFrom = connection.output.carbon === props.carbon.id
  const isTo = connection.input.carbon === props.carbon.id
  return isFrom || isTo
}
</script>

<template>
  <div ref="carbonref" id="BifrostCarbon">
    <CarbonHooks ref="inputs" :carbon="carbon" type="input"
      @hookClick="(index: number) => addHookedCarbon(carbon.id, 'input', index)" />
    <div class="core">
      <CarbonHooks :carbon="carbon" type="input"
        @hookClick="(index: number) => addHookedCarbon(carbon.id, 'input', index)" />
      <div class="content">
        <p><strong>{{ title }}</strong></p>
      </div>
      <CarbonHooks :carbon="carbon" type="output"
        @hookClick="(index: number) => addHookedCarbon(carbon.id, 'output', index)" />
    </div>
    <CarbonHooks ref="outputs" :carbon="carbon" type="output"
      @hookClick="(index: number) => addHookedCarbon(carbon.id, 'output', index)" />
  </div>
</template>

<style>
#BifrostCarbon {
  position: absolute;
  top: v-bind(top);
  left: v-bind(left);
  z-index: 1;

  display: grid;
  grid-template-columns: auto 1fr auto;
  justify-items: center;
  align-items: center;

  background-color: var(--accent-120);
  color: var(--base-20);
  border-radius: var(--radius);
}

#BifrostCarbon .core {
  display: grid;
  min-height: var(--space-6);
}

#BifrostCarbon .core p {
  line-height: 1;
}

#BifrostCarbon .core .edges {
  flex-direction: row;
}

#BifrostCarbon .core .content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-2);
  min-height: var(--space-5);
  border: 2px solid var(--accent-60);
  border-radius: var(--radius);
  height: 100%;
  width: 100%;
}
</style>
