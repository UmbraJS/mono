<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import { onMounted, ref, computed, inject, watch, type Ref } from 'vue'
import type { CarbonObject, BifrostFiberConnections, HookType } from '../types'
import BifrostCarbonHooks from './BifrostCarbonHooks.vue'
import { hooks } from '../data/index'
import { useMouse, useMousePressed } from '@vueuse/core'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

const boardRef = inject<Ref<HTMLDivElement | undefined>>('BifrostBoard')

const title = 'Carbon Node'
const props = defineProps<{
  carbon: CarbonObject
  carbons: CarbonObject[]
  connections: BifrostFiberConnections[]
}>()

const carbonref = ref<HTMLDivElement>()
const dragHandle = ref<HTMLDivElement>()
const inputs = ref<InstanceType<typeof BifrostCarbonHooks>>()
const outputs = ref<InstanceType<typeof BifrostCarbonHooks>>()
const sources = ref<InstanceType<typeof BifrostCarbonHooks>>()
const sinks = ref<InstanceType<typeof BifrostCarbonHooks>>()

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

defineExpose({ inputs, outputs, sources, sinks, updateReferences })

const connections = computed(() => props.connections.filter(isRelatedConnection))

onMounted(() => {
  gsap.registerPlugin(InertiaPlugin)
  gsap.registerPlugin(Draggable)

  if (!carbonref.value) return
  updateReferences()

  const bounds = boardRef?.value
  if (!bounds) console.warn('BifrostBoard not yet mounted; drag bounds disabled until available')

  Draggable.create(carbonref.value, {
    bounds: bounds,
    trigger: dragHandle.value,
    inertia: false,
    edgeResistance: 0.9,
    onDrag: updateFibers,
    onRelease: updateFibers
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

const { x, y } = useMouse()
const { pressed } = useMousePressed()

const xFromBoardBounds = computed(() => {
  const bounds = boardRef?.value?.getBoundingClientRect()
  return bounds ? x.value - bounds.left : 0
})

const yFromBoardBounds = computed(() => {
  const bounds = boardRef?.value?.getBoundingClientRect()
  return bounds ? y.value - bounds.top : 0
})

function addHorizontallyHookedCarbon(newNode: NewNode) {
  const childId = 'carbon-' + props.carbons.length
  props.carbons.push({
    id: childId,
    position: [xFromBoardBounds.value, yFromBoardBounds.value],
    component: undefined,
    connections: [newNode.id],
    hooks: hooks
  })
  addConnection(newNode.id, childId, newNode.type, newNode.index)
  setFibers(newNode.id)
}

function addVerticallyHookedCarbon(newNode: NewNode) {
  const childId = 'carbon-' + props.carbons.length
  props.carbons.push({
    id: childId,
    position: [xFromBoardBounds.value, yFromBoardBounds.value],
    component: undefined,
    connections: [newNode.id],
    hooks: hooks
  })
  addConnection(newNode.id, childId, newNode.type, newNode.index)
  setFibers(newNode.id)
}

function addConnection(carbonId: string, childId: string, type: HookType, hookIndex: number) {
  const fromOutput = type === 'input' || type === 'source' // Is this connection being started from an emitting side?
  const connectionType = type === 'output' || type === 'input' ? 'output-input' : 'source-sink'

  props.connections.push({
    id: 'connection-' + props.connections.length,
    type: connectionType,
    orientation: connectionType === 'output-input' ? 'horizontal' : 'vertical',
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

interface NewNode {
  id: string
  index: number
  type: HookType
}

const newNode = ref<NewNode | null>(null)
watch(newNode, (node) => {
  if (!node) return
  if (node.type === 'input' || node.type === 'output') {
    addHorizontallyHookedCarbon(node)
  } else {
    addVerticallyHookedCarbon(node)
  }
  newNode.value = null
})

const skeletonNode = ref<NewNode | null>(null)
function addSkeletonNode(node: NewNode) {
  skeletonNode.value = node
}

watch(pressed, (isPressed) => {
  if (isPressed) return
  newNode.value = skeletonNode.value
  skeletonNode.value = null
})

</script>

<template>
  <div ref="carbonref" id="BifrostCarbon" class="border">
    <!-- Horizontal Left Side (outputs) -->
    <BifrostCarbonHooks ref="outputs" :carbon="carbon" type="output"
      @hookMouseDown="(index: number) => addSkeletonNode({ id: carbon.id, type: 'output', index })" />
    <div id="BifrostCore">
      <!-- Vertical Top (sources) -->
      <BifrostCarbonHooks ref="sources" :carbon="carbon" type="source"
        @hookMouseDown="(index: number) => addSkeletonNode({ id: carbon.id, type: 'source', index })" />
      <div id="BifrostCarbonContent" ref="dragHandle">
        <p><strong>{{ title }}</strong></p>
      </div>
      <!-- Vertical Bottom (sinks) -->
      <BifrostCarbonHooks ref="sinks" :carbon="carbon" type="sink"
        @hookMouseDown="(index: number) => addSkeletonNode({ id: carbon.id, type: 'sink', index })" />
    </div>
    <!-- Horizontal Right Side (inputs) -->
    <BifrostCarbonHooks ref="inputs" :carbon="carbon" type="input"
      @hookMouseDown="(index: number) => addSkeletonNode({ id: carbon.id, type: 'input', index })" />
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

  background: var(--accent);
  color: var(--accent-120);
  border-radius: var(--radius);
  border-color: var(--accent-100);
}

#BifrostCarbon #BifrostCore {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

#BifrostCarbon #BifrostCore p {
  line-height: 1;
}

#BifrostCarbon #BifrostCore #BifrostCarbonEdges {
  flex-direction: row;
}

#BifrostCarbon #BifrostCore #BifrostCarbonContent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius);
  min-width: var(--space-6);
}
</style>
