import { onBeforeUnmount, ref, onMounted } from 'vue'
import { generateSpline, cubic } from "../utils/spline";

export interface SplineOpts {
  start?: HTMLElement | null
  end?: HTMLElement | null
  angle?: number
  stroke?: number
  startTension?: number
  endTension?: number
  color?: string
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
    const s = getCenter(opts.start) ?? { x: 0, y: 0 }
    const e = getCenter(opts.end) ?? { x: 150, y: 150 }
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
    getCenter
  }
}


const getCenter = (el: HTMLElement | null | undefined) => {
  if (!el) return null
  const box = el.getBoundingClientRect()
  return {
    x: box.left + window.scrollX + box.width / 2,
    y: box.top + window.scrollY + box.height / 2,
  }
}
