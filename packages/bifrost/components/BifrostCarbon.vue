<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, shallowRef, computed, inject, watch, nextTick, type Ref } from 'vue'
import type { CarbonObject, BifrostFiberConnections, HookType, NewNode, CarbonState } from '../types'
import BifrostCarbonVerticalHooks from './BifrostCarbonHooks/BifrostCarbonVerticalHooks.vue'
import BifrostCarbonHorizontalHooks from './BifrostCarbonHooks/BifrostCarbonHorizontalHooks.vue'
import { hooks } from '../data/index'
import { useMouse } from '@vueuse/core'
import { generateId } from '../utils/id'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

// ---------------------------
// Constants & Utilities
// ---------------------------
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
  (e: "change-carbon", props: {
    id: string
    state: CarbonState[]
  }): void
}>()

const carbonref = ref<HTMLDivElement>()
const dragHandle = ref<HTMLDivElement>()

const horizontalHooks = shallowRef<InstanceType<typeof BifrostCarbonHorizontalHooks>>()
const verticalHooks = shallowRef<InstanceType<typeof BifrostCarbonVerticalHooks>>()

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

defineExpose({ horizontalHooks, verticalHooks, updateReferences })

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

onBeforeUnmount(() => draggableInstance?.kill())

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

function moveElement(id: string) {
  const element = document.querySelector(`.${CSS.escape(id)}`)
  emit("change-carbon", { id, state: ['idle'] })
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
  <div ref="carbonref" class="bifrost-carbon border" :class="[carbon.id, carbon.state]" role="group"
    :data-carbon-id="carbon.id" :aria-label="carbon.id">
    <BifrostCarbonHorizontalHooks ref="horizontalHooks" :carbon="carbon" @clickCarbonHandle="clickCarbonHandle">
      <BifrostCarbonVerticalHooks ref="verticalHooks" :carbon="carbon" @clickCarbonHandle="clickCarbonHandle">
        <div id="BifrostCarbonContent" ref="dragHandle">
          <p><strong>{{ title }}</strong></p>
        </div>
      </BifrostCarbonVerticalHooks>
    </BifrostCarbonHorizontalHooks>
  </div>
</template>

<style>
html.bifrost-dragging {
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
  transition: opacity .15s ease;
}

.bifrost-carbon.born {
  opacity: 0;
}

#BifrostCarbonContent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-1);
  border-radius: var(--radius);
  min-width: var(--space-6);
}

#BifrostCarbonContent p {
  line-height: 1;
  margin: 0;
}
</style>
