import { onBeforeUnmount, ref, onMounted, type ShallowRef } from 'vue'
import { generateSpline, cubic } from '@nobel/bifrost';

export interface SplineOpts {
  start: Readonly<ShallowRef<HTMLElement | null>>
  end: Readonly<ShallowRef<HTMLElement | null>>
  angle?: number
  stroke?: number
  startTension?: number
  endTension?: number
  color?: string
  svgContainer?: Readonly<ShallowRef<HTMLElement | null>>
}

function useRafSchedule(callback: () => void) {
  let pending = false
  return () => {
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      callback()
    })
  }
}

export function useSplinePath(opts: SplineOpts) {
  const splineId = crypto.randomUUID()

  const angle = opts.angle ?? 90
  const stroke = opts.stroke ?? 1.5
  const startTension = opts.startTension ?? 22
  const endTension = opts.endTension ?? 22
  const color = opts.color ?? '#ffffff'

  const d = ref('') // path d attribute
  const startCoords = ref<{ x: number; y: number } | null>(null)
  const endCoords = ref<{ x: number; y: number } | null>(null)

  const recalc = () => {
    const svgContainer = opts.svgContainer?.value
    const s = svgContainer
      ? getCenterRelativeTo(opts.start.value, svgContainer) ?? { x: 0, y: 0 }
      : getCenter(opts.start.value) ?? { x: 0, y: 0 }
    const e = svgContainer
      ? getCenterRelativeTo(opts.end.value, svgContainer) ?? { x: 150, y: 150 }
      : getCenter(opts.end.value) ?? { x: 150, y: 150 }

    startCoords.value = s
    endCoords.value = e
    d.value = generateSpline({
      curve: cubic.with({ startTension, endTension }),
      pins: [
        { x: s.x, y: s.y, angle, length: 10 },
        { x: e.x, y: e.y, angle: -angle, length: 10 },
      ],
    }).d
  }

  const scheduleRecalc = useRafSchedule(recalc)

  function createSpline() {
    recalc()
    window.addEventListener('scroll', scheduleRecalc, { passive: true })
    window.addEventListener('resize', scheduleRecalc)
  }

  function destroySpline() {
    window.removeEventListener('scroll', scheduleRecalc)
    window.removeEventListener('resize', scheduleRecalc)
  }

  onMounted(() => {
    recalc()
    window.addEventListener('scroll', scheduleRecalc, { passive: true })
    window.addEventListener('resize', scheduleRecalc)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scheduleRecalc)
    window.removeEventListener('resize', scheduleRecalc)
  })

  return {
    d, stroke, color, startCoords, endCoords, recalc,
    createSpline,
    destroySpline,
    id: splineId,
    getCenter,
    getCenterRelativeTo
  }
}


type Point = { x: number; y: number }

// overloads visible to callers
export function getCenter(el: HTMLElement): Point
export function getCenter(el: null | undefined): null
export function getCenter(el: HTMLElement | null | undefined): Point | null

// implementation (not externally visible)
export function getCenter(el: HTMLElement | null | undefined) {
  if (!el) return null
  const box = el.getBoundingClientRect()
  return {
    x: box.left + window.scrollX + box.width / 2,
    y: box.top + window.scrollY + box.height / 2,
  }
}

// overloads for getCenterRelativeTo
export function getCenterRelativeTo(el: HTMLElement, container: HTMLElement): Point
export function getCenterRelativeTo(el: null | undefined, container: HTMLElement): null
export function getCenterRelativeTo(el: HTMLElement | null | undefined, container: HTMLElement): Point | null

// Get center coordinates of an element relative to a container element
export function getCenterRelativeTo(el: HTMLElement | null | undefined, container: HTMLElement) {
  if (!el) return null

  const elBox = el.getBoundingClientRect()
  const containerBox = container.getBoundingClientRect()

  return {
    x: elBox.left - containerBox.left + elBox.width / 2,
    y: elBox.top - containerBox.top + elBox.height / 2,
  }
}
