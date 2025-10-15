<script setup lang="ts">
/**
 * GSAPInspector - A visual timeline inspector for GSAP animations
 *
 * This component provides a visual representation of GSAP timelines, showing:
 * - Timeline and tween bars with duration visualization
 * - Labels as vertical markers
 * - Real-time playhead position
 * - Nested timeline structure
 *
 * Features:
 * - Interactive timeline visualization
 * - Support for nested timelines
 * - Real-time playback tracking
 * - Configurable time scale and pixel density
 */
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'

// GSAP Integration
// If gsap is installed via npm: npm i gsap
// Otherwise ensure gsap is on window. Using dynamic require keeps SSR safe.
let gsap: any
try {
  gsap = (await import('gsap')).gsap
} catch {
  gsap = (window as any)?.gsap
}

if (!gsap) {
  console.warn('[GSAPInspector] GSAP not found on import or window.gsap')
}

/**
 * Component Props Interface
 */
interface Props {
  /** The root GSAP timeline instance to inspect (required) */
  root: any // GSAP Timeline instance
  /** Whether to show nested timelines recursively */
  nested?: boolean
  /** Whether to apply timeScale to timing calculations */
  bakeTimeScale?: boolean
  /** Pixels per second for timeline visualization */
  pxPerSec?: number
  /** v-model for controlling component visibility */
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  nested: true,
  bakeTimeScale: false,
  pxPerSec: 120,
  modelValue: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'closed'): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

/** Visual layout constants */
const LAYOUT_CONFIG = {
  /** Padding from left edge to timeline start */
  LEFT_PADDING: 140,
  /** Height of each timeline row */
  ROW_HEIGHT: 22,
  /** Vertical gap between rows */
  VERTICAL_GAP: 6,
  /** Height of the timeline ruler */
  RULER_HEIGHT: 20,
  /** Minimum bar width for visibility */
  MIN_BAR_WIDTH: 2,
  /** Playhead width */
  PLAYHEAD_WIDTH: 2
} as const

/** Timeline ruler configuration */
const RULER_CONFIG = {
  /** Maximum number of ticks to show */
  MAX_TICKS: 20,
  /** Available step sizes for ruler ticks */
  TICK_STEPS: [0.1, 0.2, 0.5, 1, 2, 5, 10, 20] as const
} as const

const pxPerSec = computed(() => props.pxPerSec)

/** Internal state */
const bakeTimeScaleState = ref(!!props.bakeTimeScale)
const rows = ref<Row[]>([])
const currentTime = ref(0)
const scrollEl = ref<HTMLElement | null>(null)

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Basic interface for GSAP elements (both timelines and tweens)
 * This provides type safety while still allowing for GSAP's dynamic nature
 */
interface GSAPElement {
  startTime(): number
  totalDuration(): number
  vars?: {
    id?: string
    name?: string
  }
  data?: string
  _def?: {
    name?: string
  }
}

/**
 * Extended interface for GSAP Timeline objects
 */
interface GSAPTimeline extends GSAPElement {
  getChildren(includeTimelines?: boolean, includeTweens?: boolean, includeLabels?: boolean): GSAPElement[]
  timeScale(): number
  labels?: Record<string, number>
  time(): number
}

/**
 * Represents a single row in the timeline visualization
 * Each row can be a timeline, tween, or label marker
 */
interface Row {
  /** The type of GSAP element this row represents */
  type: 'timeline' | 'tween' | 'label'
  /** Start time in seconds */
  start: number
  /** End time in seconds */
  end: number
  /** Duration in seconds */
  duration: number
  /** Nesting depth for visual indentation */
  depth: number
  /** Reference to the original GSAP node */
  node: GSAPElement | GSAPTimeline
  /** Unique path identifier for the element */
  path: string
  /** Display name for the element */
  name: string
}

/**
 * Represents a tick mark on the timeline ruler
 */
interface TimelineTick {
  key: string
  left: number
  label: string
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Checks if an object is a GSAP timeline
 * @param obj - Object to check
 * @returns True if object has timeline characteristics
 */
function isTimeline(obj: unknown): obj is GSAPTimeline {
  return obj != null &&
    typeof (obj as GSAPElement).totalDuration === 'function' &&
    typeof (obj as GSAPTimeline).getChildren === 'function'
}

/**
 * Extracts a safe display name from a GSAP element
 * @param child - GSAP element (timeline or tween)
 * @param fallback - Fallback name if no name is found
 * @returns Display name for the element
 */
function getSafeDisplayName(child: GSAPElement, fallback: string): string {
  return child?.vars?.id || child?.vars?.name || child?.data || child?._def?.name || fallback
}

// =============================================================================
// DATA COLLECTION & PROCESSING
// =============================================================================

/**
 * Collects all timeline elements into a flat array of Row objects
 * @param rootTimeline - The root GSAP timeline to analyze
 * @param includeNested - Whether to recursively include nested timelines
 * @param bakeTimeScale - Whether to apply timeScale to calculations
 * @returns Array of Row objects representing timeline elements
 */
function collectRows(rootTimeline: GSAPTimeline, includeNested = true, bakeTimeScale = false): Row[] {
  const collectedRows: Row[] = []

  /**
   * Recursively walks through timeline hierarchy
   * @param timeline - Current timeline being processed
   * @param parentAbsoluteTime - Absolute time offset from parent
   * @param timeScale - Accumulated time scale factor
   * @param nestingDepth - Current depth in timeline hierarchy
   * @param elementPath - Path identifier for the current element
   */
  function walkTimeline(
    timeline: GSAPTimeline,
    parentAbsoluteTime = 0,
    timeScale = 1,
    nestingDepth = 0,
    elementPath = 'root'
  ) {
    const effectiveScale = timeScale * (typeof timeline.timeScale === 'function' ? timeline.timeScale() : 1)
    const children = timeline.getChildren(true, true, false) // all children (tweens & timelines)

    children.forEach((child: GSAPElement, childIndex: number) => {
      const localStartTime = child.startTime()
      const localDuration = child.totalDuration()
      const absoluteStart = parentAbsoluteTime + (bakeTimeScale ? localStartTime * effectiveScale : localStartTime)
      const effectiveDuration = bakeTimeScale ? localDuration * effectiveScale : localDuration

      collectedRows.push({
        type: isTimeline(child) ? 'timeline' : 'tween',
        start: absoluteStart,
        end: absoluteStart + effectiveDuration,
        duration: effectiveDuration,
        depth: nestingDepth,
        node: child,
        path: `${elementPath}/${childIndex}`,
        name: getSafeDisplayName(child, isTimeline(child) ? `timeline#${childIndex}` : `tween#${childIndex}`)
      })

      if (includeNested && isTimeline(child)) {
        walkTimeline(child as GSAPTimeline, absoluteStart, effectiveScale, nestingDepth + 1, `${elementPath}/${childIndex}`)
      }
    })

    // Process timeline labels
    const timelineLabels = timeline.labels || {}
    Object.keys(timelineLabels).forEach((labelName) => {
      const labelPosition = timelineLabels[labelName]
      if (typeof labelPosition === 'number') {
        const absolutePosition = parentAbsoluteTime + (bakeTimeScale ? labelPosition * effectiveScale : labelPosition)
        collectedRows.push({
          type: 'label',
          start: absolutePosition,
          end: absolutePosition,
          duration: 0,
          depth: nestingDepth,
          node: timeline,
          path: `${elementPath}/label:${labelName}`,
          name: labelName
        })
      }
    })
  }

  walkTimeline(rootTimeline)
  collectedRows.sort((a, b) => (a.start - b.start) || (a.depth - b.depth))
  return collectedRows
}

// =============================================================================
// COMPUTED PROPERTIES
// =============================================================================

/**
 * Helper function to find the maximum end time among all rows
 */
function findMaxEndTime(timelineRows: Row[]): number {
  return timelineRows.reduce((max, row) => Math.max(max, row.end || 0), 0)
}

/**
 * Helper function to get the root timeline duration safely
 */
function getRootTimelineDuration(rootTimeline: GSAPTimeline | null): number {
  return rootTimeline?.totalDuration?.() ?? 0
}

const maxEnd = computed(() => findMaxEndTime(rows.value))

const totalDuration = computed(() => {
  const rootDuration = getRootTimelineDuration(props.root)
  return Math.max(rootDuration, maxEnd.value)
})

/**
 * Helper function to generate ruler tick marks
 */
function generateRulerTicks(totalTime: number, pixelsPerSecond: number): Array<{ key: string, left: number, label: string }> {
  const stepSize = chooseStep(totalTime)
  const tickList: Array<{ key: string, left: number, label: string }> = []

  for (let time = 0; time <= totalTime + 1e-6; time += stepSize) {
    tickList.push({
      key: time.toFixed(2),
      left: time * pixelsPerSecond,
      label: `${time.toFixed(2)}s`
    })
  }
  return tickList
}

const ticks = computed(() => generateRulerTicks(totalDuration.value, pxPerSec.value))

const labelRows = computed(() => rows.value.filter(row => row.type === 'label'))
const barRows = computed(() => rows.value.filter(row => row.type !== 'label'))

/**
 * Chooses an appropriate step size for timeline ruler ticks
 * @param total - Total timeline duration
 * @returns Optimal step size for ruler marks
 */
function chooseStep(total: number): number {
  let step = 1
  for (const candidate of RULER_CONFIG.TICK_STEPS) {
    if (total / candidate <= RULER_CONFIG.MAX_TICKS) {
      step = candidate
      break
    }
  }
  return step
}



// =============================================================================
// VISUAL LAYOUT & STYLING FUNCTIONS
// =============================================================================

/**
 * Calculates the vertical position for a timeline row
 * @param depth - Nesting depth of the timeline element
 * @returns Top position in pixels
 */
function rowTop(depth: number): number {
  return LAYOUT_CONFIG.RULER_HEIGHT + 8 + depth * (LAYOUT_CONFIG.ROW_HEIGHT + LAYOUT_CONFIG.VERTICAL_GAP)
}

/**
 * Generates CSS styles for timeline bar visualization
 * @param row - The row data to style
 * @returns CSS style object for the bar element
 */
function getBarStyle(row: Row) {
  const leftPosition = LAYOUT_CONFIG.LEFT_PADDING + row.start * pxPerSec.value
  const barWidth = Math.max(LAYOUT_CONFIG.MIN_BAR_WIDTH, row.duration * pxPerSec.value)
  return {
    left: leftPosition + 'px',
    width: barWidth + 'px',
    background: row.type === 'timeline' ? 'linear-gradient(#3e7,#2a5)' : 'linear-gradient(#79f,#548)'
  } as Record<string, string>
}

/**
 * Generates tooltip text for timeline bars
 * @param row - The row data to describe
 * @returns Formatted tooltip string
 */
function getBarTooltip(row: Row): string {
  return `${row.name}\nstart: ${row.start.toFixed(3)}s\nend: ${row.end.toFixed(3)}s\nduration: ${row.duration.toFixed(3)}s`
}

// =============================================================================
// COMPONENT LOGIC & LIFECYCLE
// =============================================================================

/**
 * Validates that the provided root timeline is valid
 */
function validateRootTimeline(rootTimeline: unknown): rootTimeline is GSAPTimeline {
  if (!rootTimeline) {
    console.warn('[GSAPInspector] No root timeline provided')
    return false
  }

  if (!isTimeline(rootTimeline)) {
    console.error('[GSAPInspector] Root must be a valid GSAP timeline instance')
    return false
  }

  return true
}

/**
 * Refreshes the timeline data by re-collecting rows from the root timeline
 */
function refresh(): void {
  if (!validateRootTimeline(props.root)) {
    rows.value = []
    return
  }

  try {
    rows.value = collectRows(props.root, props.nested, bakeTimeScaleState.value)
  } catch (error) {
    console.error('[GSAPInspector] Error collecting timeline data:', error)
    rows.value = []
  }
}

let cancelTicker: (() => void) | null = null

onMounted(() => {

  if (!validateRootTimeline(props.root)) {
    return
  }

  refresh()

  // Setup timeline playback ticker
  const updateCurrentTime = () => {
    try {
      if (props.root && typeof props.root.time === 'function') {
        currentTime.value = props.root.time()
      }
    } catch (error) {
      console.warn('[GSAPInspector] Error reading timeline time:', error)
    }
  }

  // Use GSAP ticker if available, otherwise fallback to requestAnimationFrame
  if (gsap?.ticker) {
    gsap.ticker.add(updateCurrentTime)
    cancelTicker = () => gsap.ticker.remove(updateCurrentTime)
  } else {
    const animationId = requestAnimationFrame(function tickerLoop() {
      updateCurrentTime()
      requestAnimationFrame(tickerLoop)
    })
    cancelTicker = () => cancelAnimationFrame(animationId)
  }
})

onUnmounted(() => { cancelTicker?.() })

// Watch for changes to root timeline or nested setting
watch([() => props.root, () => props.nested], () => {
  try {
    refresh()
  } catch (error) {
    console.error('[GSAPInspector] Error refreshing timeline data:', error)
  }
}, { immediate: false })

// Watch for changes to bake time scale setting
watchEffect(() => {
  if (bakeTimeScaleState.value) {
    try {
      refresh()
    } catch (error) {
      console.error('[GSAPInspector] Error refreshing with baked time scale:', error)
    }
  }
})

watch(rows, () => {
  console.log('rex: [GSAPInspector] Initialized with root:', rows.value)
})

</script>

<template>
  <div v-if="visible" class="gi-wrap" role="dialog" aria-label="GSAP Inspector">
    <!-- <div class="gi-header">
      <label class="gi-check">
        <input v-model="bakeTimeScaleState" type="checkbox">
        <span>bake timeScale</span>
      </label>
      <button class="gi-btn" @click="onClose">Close</button>
    </div> -->

    <div ref="scrollEl" class="gi-trackWrap">
      <!-- Ruler -->
      <div class="gi-ruler">
        <div v-for="tick in ticks" :key="tick.key" class="gi-tick" :style="{ left: tick.left + 'px' }">
          {{ tick.label }}
        </div>
      </div>

      <!-- Labels as dashed lines and tags -->
      <template v-for="labelRow in labelRows" :key="labelRow.path">
        <div class="gi-label-line" :style="{ left: LAYOUT_CONFIG.LEFT_PADDING + labelRow.start * pxPerSec + 'px' }" />
        <div class="gi-label-tag" :style="{ left: LAYOUT_CONFIG.LEFT_PADDING + labelRow.start * pxPerSec + 'px' }">
          {{ labelRow.name }}
        </div>
      </template>

      <!-- Bars + names -->
      <div v-for="row in barRows" :key="row.path" class="gi-row" :style="{ top: rowTop(row.depth) + 'px' }">
        <div class="gi-name" :title="row.name + ' (' + row.type + ')'">
          {{ row.name }}
          <small>({{ row.type }}) {{ row.start }} {{ row.end }}</small>
        </div>
        <div class="gi-bar" :title="getBarTooltip(row)" :style="getBarStyle(row)" />
      </div>

      <!-- Playhead -->
      <div class="gi-playhead" :style="{ left: LAYOUT_CONFIG.LEFT_PADDING + currentTime * pxPerSec + 'px' }" />
    </div>
  </div>
</template>

<style scoped>
.gi-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 20, 26, 0.92);
  color: #e6e6e6;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 999999;
  overflow: scroll;
  max-height: 40vh;
}

.gi-header {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  position: sticky;
  top: 0;
  background: inherit;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.gi-check {
  margin-left: auto;
  display: flex;
  gap: 6px;
  align-items: center;
}

.gi-btn {
  background: #2b2b33;
  color: #fff;
  border: 0;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}

.gi-trackWrap {
  position: relative;
  overflow: auto;
  padding: 10px 12px 16px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.gi-ruler {
  position: relative;
  height: 20px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.gi-tick {
  position: absolute;
  bottom: 0;
  height: 100%;
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  padding-left: 4px;
  transform: translateX(-0.5px);
  font-size: 11px;
}

.gi-playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ff4d4f;
  pointer-events: none;
}

.gi-row {
  display: flex;
  align-items: center;
  gap: 8px;
  left: 8px;
}

.gi-name {
  width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.9;
}

.gi-bar {
  height: 4px;
  border-radius: 6px;
  position: absolute;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
}

.gi-label-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed rgba(255, 255, 255, 0.3);
  pointer-events: none;
  opacity: 0.8;
}

.gi-label-tag {
  position: absolute;
  transform: translate(-50%, 0);
  font-size: 11px;
  opacity: 0.85;
  background: #3a3a46;
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
  top: 2px;
}
</style>
