<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
// If gsap is installed via npm: npm i gsap
// Otherwise ensure gsap is on window. Using dynamic require keeps SSR safe.
let gsap: any
try { gsap = (await import('gsap')).gsap } catch { gsap = (window as any)?.gsap }

if (!gsap) {
  console.warn('[GsapTimelineInspector] GSAP not found on import or window.gsap')
}

/** Props */
interface Props {
  root: any // a gsap.timeline() instance - required
  nested?: boolean
  bakeTimeScale?: boolean
  pxPerSec?: number
  modelValue?: boolean // v-model to show/hide
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

const pxPerSec = computed(() => props.pxPerSec)
const leftPad = 140
const rowHeight = 22
const vGap = 6

/** Internal state */
const bakeTimeScaleState = ref(!!props.bakeTimeScale)
const rows = ref<Row[]>([])
const currentTime = ref(0)
const scrollEl = ref<HTMLElement | null>(null)

/** Types */
interface Row {
  type: 'timeline' | 'tween' | 'label'
  start: number
  end: number
  duration: number
  depth: number
  node: any
  path: string
  name: string
}

function isTimeline(obj: any) {
  return obj && typeof obj.totalDuration === 'function' && typeof obj.getChildren === 'function'
}

function safeName(child: any, fallback: string) {
  return child?.vars?.id || child?.vars?.name || child?.data || child?._def?.name || fallback
}

function collectRows(root: any, nested = true, bakeTimeScale = false): Row[] {
  const out: Row[] = []
  function walk(tl: any, parentAbs = 0, scale = 1, depth = 0, path = 'root') {
    const effScale = scale * (typeof tl.timeScale === 'function' ? tl.timeScale() : 1)
    const kids = tl.getChildren(true, true, false) // all children (tweens & timelines)

    kids.forEach((c: any, i: number) => {
      const startLocal = c.startTime()
      const durLocal = c.totalDuration()
      const absStart = parentAbs + (bakeTimeScale ? startLocal * effScale : startLocal)
      const dur = bakeTimeScale ? durLocal * effScale : durLocal

      out.push({
        type: isTimeline(c) ? 'timeline' : 'tween',
        start: absStart,
        end: absStart + dur,
        duration: dur,
        depth,
        node: c,
        path: `${path}/${i}`,
        name: safeName(c, isTimeline(c) ? `timeline#${i}` : `tween#${i}`)
      })

      if (nested && isTimeline(c)) {
        walk(c, absStart, effScale, depth + 1, `${path}/${i}`)
      }
    })

    const labels = tl.labels || {}
    Object.keys(labels).forEach((label) => {
      const pos = (labels as any)[label]
      const abs = parentAbs + (bakeTimeScale ? pos * effScale : pos)
      out.push({
        type: 'label', start: abs, end: abs, duration: 0, depth, node: tl, path: `${path}/label:${label}`, name: label
      })
    })
  }
  walk(root)
  out.sort((a, b) => (a.start - b.start) || (a.depth - b.depth))
  return out
}

const maxEnd = computed(() => rows.value.reduce((m, r) => Math.max(m, r.end || 0), 0))
const totalDuration = computed(() => {
  const rootDur = props.root?.totalDuration?.() ?? 0
  return Math.max(rootDur, maxEnd.value)
})

const ticks = computed(() => {
  const total = totalDuration.value
  const step = chooseStep(total)
  const list: { key: string, left: number, label: string }[] = []
  for (let t = 0; t <= total + 1e-6; t += step) {
    list.push({ key: t.toFixed(2), left: t * pxPerSec.value, label: `${t.toFixed(2)}s` })
  }
  return list
})

function chooseStep(total: number) {
  const candidates = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20]
  let step = 1
  for (const c of candidates) {
    if (total / c <= 20) { step = c; break }
  }
  return step
}

const labelRows = computed(() => rows.value.filter(r => r.type === 'label'))
const barRows = computed(() => rows.value.filter(r => r.type !== 'label'))

function rowTop(depth: number) {
  return 28 + depth * (rowHeight + vGap)
}

function barStyle(r: Row) {
  const x = leftPad + r.start * pxPerSec.value
  const w = Math.max(2, r.duration * pxPerSec.value)
  return {
    left: x + 'px',
    width: w + 'px',
    background: r.type === 'timeline' ? 'linear-gradient(#3e7,#2a5)' : 'linear-gradient(#79f,#548)'
  } as Record<string, string>
}

function barTitle(r: Row) {
  return `${r.name}\nstart: ${r.start.toFixed(3)}s\nend: ${r.end.toFixed(3)}s\nduration: ${r.duration.toFixed(3)}s`
}

function refresh() {
  if (!props.root) return
  rows.value = collectRows(props.root, props.nested, bakeTimeScaleState.value)
}

let cancelTicker: (() => void) | null = null

onMounted(() => {
  if (!props.root) {
    console.warn('[GsapTimelineInspector] Missing root timeline prop')
    return
  }
  refresh()
  // ticker
  const tick = () => {
    try { currentTime.value = props.root.time() } catch { /* ignore */ }
  }
  if (gsap?.ticker) {
    gsap.ticker.add(tick)
    cancelTicker = () => gsap.ticker.remove(tick)
  } else {
    const id = requestAnimationFrame(function raf() {
      tick(); requestAnimationFrame(raf)
    })
    cancelTicker = () => cancelAnimationFrame(id)
  }
})

onUnmounted(() => { cancelTicker?.() })

watch([() => props.root, () => props.nested], () => refresh(), { immediate: false })
watchEffect(() => { if (bakeTimeScaleState.value) refresh() })
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
      <template v-for="lab in labelRows" :key="lab.path">
        <div class="gi-label-line" :style="{ left: leftPad + lab.start * pxPerSec + 'px' }" />
        <div class="gi-label-tag" :style="{ left: leftPad + lab.start * pxPerSec + 'px' }">{{ lab.name }}</div>
      </template>

      <!-- Bars + names -->
      <div v-for="row in barRows" :key="row.path" class="gi-row" :style="{ top: rowTop(row.depth) + 'px' }">
        <div class="gi-name" :title="row.name + ' (' + row.type + ')'">
          {{ row.name }}
          <small>({{ row.type }})</small>
        </div>
        <div class="gi-bar" :title="barTitle(row)" :style="barStyle(row)" />
      </div>

      <!-- Playhead -->
      <div class="gi-playhead" :style="{ left: leftPad + currentTime * pxPerSec + 'px' }" />
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
