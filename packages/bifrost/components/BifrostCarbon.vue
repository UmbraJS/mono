<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef, computed, inject, watch, nextTick, type Ref } from 'vue'
import type { CarbonObject, BifrostFiberConnections, HookType } from '../types'
import BifrostCarbonHooks from './BifrostCarbonHooks.vue'
import { hooks } from '../data/index'
import { useMouse } from '@vueuse/core'
import { generateId } from '../utils/id'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

// ---------------------------
// Constants & Utilities
// ---------------------------
const RECENT_CLASS = 'recently-born'
const DRAGGING_CLASS = 'bifrost-dragging'


const boardRef = inject<Ref<HTMLDivElement | undefined>>('BifrostBoard')

const title = 'Carbon Node'
const props = defineProps<{
  carbon: CarbonObject
  carbons: CarbonObject[] // Provided by parent (read-only from this component perspective)
  connections: BifrostFiberConnections[] // Provided by parent (read-only here)
}>()

const emit = defineEmits<{
  (e: 'add-carbon', carbon: CarbonObject): void
  (e: 'add-connection', connection: BifrostFiberConnections): void
}>()

const carbonref = ref<HTMLDivElement>()
const dragHandle = ref<HTMLDivElement>()
const inputs = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()
const outputs = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()
const sources = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()
const sinks = shallowRef<InstanceType<typeof BifrostCarbonHooks>>()

// Will hold the Draggable instance for cleanup
// Draggable.create returns an array of Draggable instances (untyped here to avoid gsap type coupling)
let draggableInstance: any | undefined

function updateReferences() {
  relatedConnections.value.forEach((connection) => {
    const isFrom = connection.start.carbon === props.carbon.id
    if (isFrom) connection.start.component = props.carbon.component
    else connection.end.component = props.carbon.component
  })
}

defineExpose({ inputs, outputs, sources, sinks, updateReferences })

// We only work with connections related to this carbon
const relatedConnections = computed(() => props.connections.filter(isRelatedConnection))

onMounted(() => {
  gsap.registerPlugin(Draggable)
  if (!carbonref.value) return
  updateReferences()
  const bounds = boardRef?.value
  draggableInstance = Draggable.create(carbonref.value, {
    bounds: bounds || undefined,
    trigger: dragHandle.value,
    inertia: false,
    edgeResistance: 0.9,
    onDrag: scheduleUpdateFibers,
    onRelease: scheduleUpdateFibers
  })[0]
})

onBeforeUnmount(() => {
  draggableInstance?.kill()
})

// ---------------------------
// Fiber Update (throttled)
// ---------------------------
let fiberUpdateScheduled = false
function doUpdateFibers() {
  relatedConnections.value.forEach((connection) => {
    connection.component?.update()
  })
}
function scheduleUpdateFibers() {
  if (fiberUpdateScheduled) return
  fiberUpdateScheduled = true
  requestAnimationFrame(() => {
    fiberUpdateScheduled = false
    doUpdateFibers()
  })
}

function setFibers(carbonId: string) {
  const parentCarbon = props.carbons.find((carbon) => carbon.id === carbonId)
  parentCarbon?.component?.updateReferences?.()
  queueMicrotask(() => scheduleUpdateFibers())
}

const { x, y } = useMouse()

const xFromBoardBounds = computed(() => {
  const bounds = boardRef?.value?.getBoundingClientRect()
  return bounds ? x.value - (bounds.left || 0) : 0
})

const yFromBoardBounds = computed(() => {
  const bounds = boardRef?.value?.getBoundingClientRect()
  return bounds ? y.value - (bounds.top || 0) : 0
})

function createCarbonFromNode(newNode: NewNode) {
  const childId = generateId('carbon')
  emit('add-carbon', {
    id: childId,
    position: [xFromBoardBounds.value, yFromBoardBounds.value],
    component: undefined,
    connections: [newNode.id],
    state: ['born'],
    class: RECENT_CLASS,
    hooks
  })
  addConnection(newNode.id, childId, newNode.type, newNode.index)
  setFibers(newNode.id)
  return childId
}

function addConnection(carbonId: string, childId: string, type: HookType, hookIndex: number) {
  const fromOutputSide = type === 'input' || type === 'source'
  const connectionType = (type === 'output' || type === 'input') ? 'output-input' : 'source-sink'
  emit('add-connection', {
    id: generateId('connection'),
    type: connectionType,
    orientation: connectionType === 'output-input' ? 'horizontal' : 'vertical',
    start: {
      carbon: fromOutputSide ? carbonId : childId,
      hook: fromOutputSide ? hookIndex : 0
    },
    end: {
      carbon: fromOutputSide ? childId : carbonId,
      hook: fromOutputSide ? 0 : hookIndex
    }
  })
  // Schedule fiber update after parent applies emitted change
  nextTick(() => scheduleUpdateFibers())
}

function isRelatedConnection(connection: BifrostFiberConnections) {
  const isFrom = connection.start.carbon === props.carbon.id
  const isTo = connection.end.carbon === props.carbon.id
  return isFrom || isTo
}

interface NewNode { id: string; index: number; type: HookType }

function moveElement(id: string) {
  const element = document.querySelector(`.${CSS.escape(id)}`)
  element?.classList.remove(RECENT_CLASS)
  if (!element) return
  gsap.to(element, {
    x: xFromBoardBounds.value,
    y: yFromBoardBounds.value,
    duration: 0,
    ease: 'power1.out'
  })
  scheduleUpdateFibers()
}

function clickCarbonHandle(node: NewNode) {
  const newCarbonId = createCarbonFromNode(node)
  const htmlElement = document.documentElement
  htmlElement.classList.add(DRAGGING_CLASS)

  // Defer so the element exists in DOM
  requestAnimationFrame(() => {
    const ctrl = new AbortController()
    const move = () => moveElement(newCarbonId)
    const stop = () => {
      moveElement(newCarbonId)
      ctrl.abort()
      htmlElement.classList.remove(DRAGGING_CLASS)
    }
    document.addEventListener('pointermove', move, { signal: ctrl.signal })
    document.addEventListener('pointerup', stop, { once: true, signal: ctrl.signal })
    document.addEventListener('pointercancel', stop, { signal: ctrl.signal })
    onBeforeUnmount(() => ctrl.abort())
  })
}

// React when external connection list changes (e.g., parent applied emitted additions)
watch(() => props.connections, () => updateReferences(), { deep: true })
</script>

<template>
  <div ref="carbonref" class="bifrost-carbon border" :class="[carbon.id, carbon.class]" role="group"
    :data-carbon-id="carbon.id" :aria-label="carbon.id">
    <!-- Horizontal Left Side (outputs) -->
    <BifrostCarbonHooks ref="outputs" :carbon="carbon" type="output"
      @hookMouseDown="(index: number) => clickCarbonHandle({ id: carbon.id, type: 'output', index })" />
    <div id="BifrostCore">
      <!-- Vertical Top (sources) -->
      <BifrostCarbonHooks ref="sources" :carbon="carbon" type="source"
        @hookMouseDown="(index: number) => clickCarbonHandle({ id: carbon.id, type: 'source', index })" />
      <div id="BifrostCarbonContent" ref="dragHandle">
        <p><strong>{{ title }}</strong></p>
      </div>
      <!-- Vertical Bottom (sinks) -->
      <BifrostCarbonHooks ref="sinks" :carbon="carbon" type="sink"
        @hookMouseDown="(index: number) => clickCarbonHandle({ id: carbon.id, type: 'sink', index })" />
    </div>
    <!-- Horizontal Right Side (inputs) -->
    <BifrostCarbonHooks ref="inputs" :carbon="carbon" type="input"
      @hookMouseDown="(index: number) => clickCarbonHandle({ id: carbon.id, type: 'input', index })" />
  </div>
</template>

<style>
html.bifrost-dragging {
  /* Keep pointer events but disable selection so user can still interact with other UI if needed */
  user-select: none;
  cursor: grabbing;
}

.bifrost-carbon {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  justify-items: center;
  align-items: center;
  background: var(--accent);
  color: var(--accent-120);
  border-radius: var(--radius);
  border-color: var(--accent-100);
  opacity: 1;

  /* transform: translate3d(v-bind(xFromBoardBounds),
      v-bind(yFromBoardBounds)); */
  transition: opacity .15s ease;
}

.bifrost-carbon.recently-born {
  opacity: 0;
}

.bifrost-carbon #BifrostCore {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.bifrost-carbon #BifrostCore p {
  line-height: 1;
  margin: 0;
}

.bifrost-carbon #BifrostCore #BifrostCarbonEdges {
  flex-direction: row;
}

.bifrost-carbon #BifrostCore #BifrostCarbonContent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius);
  min-width: var(--space-6);
}
</style>
