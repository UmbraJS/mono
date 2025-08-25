import { onBeforeUnmount, ref, watchEffect, type Ref, watch } from 'vue'

// Minimal HMR type (avoids needing a global env definition here)
interface ImportMetaHot { dispose(cb: () => void): void }
interface HMRImportMeta extends ImportMeta { hot?: ImportMetaHot }
import { generateSpline, cubic } from "../utils/spline";

/** Options accepted by useSpline */
export interface UseSplineOptions {
  start?: HTMLElement | null
  end?: HTMLElement | null
  angle?: number
  stroke?: number
  svgClass?: Ref<string>
  startTension?: number
  endTension?: number
  color?: string
}

export interface UseSplineReturn {
  update: () => void
  applyClasses: () => void
  id: Ref<string | null>
}

export function useSpline({ start, end, angle = 90, stroke = 1.5, svgClass, startTension, endTension, color }: UseSplineOptions): UseSplineReturn {
  const svgId = ref<string | null>(null)
  const created = ref(false)

  /** Ensure SVG covers entire scrollable document */
  function resizeSVG(svg: SVGSVGElement) {
    const docEl = document.documentElement
    const width = Math.max(docEl.scrollWidth, docEl.clientWidth)
    const height = Math.max(docEl.scrollHeight, docEl.clientHeight)
    svg.style.width = width + 'px'
    svg.style.height = height + 'px'
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }

  function createSVG(id: string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute"; // anchored at document origin
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "2"
    resizeSVG(svg) // initial sizing to full document
    svg.style.pointerEvents = "none";
    svg.setAttribute("id", id);
    document.body.appendChild(svg);

    const pins = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pins.setAttribute("id", "pins");
    pins.setAttribute("stroke", color || "#ffffff");
    pins.setAttribute("stroke-width", stroke.toString());
    pins.setAttribute("fill", "none");
    svg.appendChild(pins);

    const spline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    spline.setAttribute("id", "spline");
    spline.setAttribute("stroke", color || "#ffffff");
    spline.setAttribute("stroke-width", stroke.toString());
    spline.setAttribute("fill", "none");
    svg.appendChild(spline);
    created.value = true
    applyClasses()
  }

  function adjustSVGPath(id: string) {
    const svgElement = document.getElementById(id)
    const splinePath = svgElement?.querySelector('#spline')

    const startCenter = start ? getCenter(start) : { x: 0, y: 0 }
    const endCenter = end ? getCenter(end) : { x: 150, y: 150 }

    const spline = generateSpline({
      curve: cubic.with({ startTension, endTension }),
      pins: [
        { x: startCenter.x, y: startCenter.y, angle, length: 10 },
        { x: endCenter.x, y: endCenter.y, angle: -angle, length: 10 }
      ],
    })

    splinePath?.setAttribute('d', spline.d)
  }

  function applyClasses() {
    if (!svgId.value) return
    const svgElement = document.getElementById(svgId.value)
    if (!svgElement) return
    if (svgClass?.value !== undefined) svgElement.setAttribute('class', "BifrostSpline " + svgClass.value)
  }

  function getCenter(element: HTMLElement): { x: number; y: number } {
    const box = element.getBoundingClientRect()
    const x = box.left + window.scrollX + box.width / 2
    const y = box.top + window.scrollY + box.height / 2
    return { x, y }
  }

  // rAF throttled scroll/resize handler
  let pending = false
  function scheduleRecalc() {
    if (pending) return
    pending = true
    requestAnimationFrame(() => {
      pending = false
      if (!svgId.value) return
      const svg = document.getElementById(svgId.value) as SVGSVGElement | null
      if (svg) resizeSVG(svg)
      update()
    })
  }

  if (svgId.value) document.getElementById(svgId.value)?.remove()
  const generatedID = `bifrost-spline-${crypto.randomUUID()}`
  svgId.value = generatedID
  createSVG(generatedID)
  adjustSVGPath(generatedID)
  window.addEventListener('scroll', scheduleRecalc, { passive: true })
  window.addEventListener('resize', scheduleRecalc)

  watchEffect(() => { if (created.value) applyClasses() })
  if (svgClass) {
    watch(svgClass, () => {
      if (!created.value) return
      applyClasses()
    })
  }

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scheduleRecalc)
    window.removeEventListener('resize', scheduleRecalc)
    if (svgId.value) {
      document.getElementById(svgId.value)?.remove()
      svgId.value = null
    }
  })

  const _importMeta = import.meta as HMRImportMeta
  if (_importMeta.hot) {
    _importMeta.hot.dispose(() => {
      if (!svgId.value) return
      window.removeEventListener('scroll', scheduleRecalc)
      window.removeEventListener('resize', scheduleRecalc)
      document.getElementById(svgId.value)?.remove()
      svgId.value = null
    })
  }

  function update() {
    if (svgId.value) adjustSVGPath(svgId.value)
    applyClasses()
  }

  return { update, applyClasses, id: svgId }
}
