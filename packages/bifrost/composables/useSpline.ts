import { onMounted, onBeforeUnmount, ref } from 'vue'

// Minimal HMR type (avoids needing a global env definition here)
interface ImportMetaHot {
  dispose(cb: () => void): void
}
interface HMRImportMeta extends ImportMeta {
  hot?: ImportMetaHot
}
import { generateSpline, cubic } from "../utils/spline";

/** Options accepted by useSpline */
interface UseSplineOptions {
  /** Starting element */
  start?: HTMLDivElement
  /** Ending element */
  end?: HTMLDivElement
  /** Control angle for spline handle */
  angle?: number
  /** Stroke width */
  stroke?: number
  /** Automatically re-render when start/end refs change (default true) */
  auto?: boolean
}

export function useSpline({ start, end, angle = 90, stroke = 1.5 }: UseSplineOptions) {
  // Keep track of the SVG we create so we can clean it up (avoids HMR duplicates)
  const svgId = ref<string | null>(null)

  function createSVG(id: string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.pointerEvents = "none"; // Prevents interfering with other elements
    svg.setAttribute("id", id);
    document.body.appendChild(svg);

    const pins = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pins.setAttribute("id", "pins");
    pins.setAttribute("stroke", "#ff0000");
    pins.setAttribute("stroke-width", stroke.toString());
    pins.setAttribute("fill", "none");
    svg.appendChild(pins);

    const spline = document.createElementNS("http://www.w3.org/2000/svg", "path");
    spline.setAttribute("id", "spline");
    spline.setAttribute("stroke", "#00ff00");
    spline.setAttribute("stroke-width", stroke.toString());
    spline.setAttribute("fill", "none");
    svg.appendChild(spline);
  }

  function adjustSVGPath(id: string) {
    const svgElement = document.getElementById(id)
    const splinePath = svgElement?.querySelector('#spline')

    const startCenter = start ? getCenter(start) : { x: 0, y: 0 }
    const endCenter = end ? getCenter(end) : { x: 150, y: 150 }

    const spline = generateSpline({
      curve: cubic.with({ startTension: 6, endTension: 6 }),
      pins: [
        { x: startCenter.x, y: startCenter.y, angle, length: 10 },
        { x: endCenter.x, y: endCenter.y, angle: -angle, length: 10 }
      ],
    })

    splinePath?.setAttribute('d', spline.d)
  }

  onMounted(() => {
    // If an SVG from a previous hot-reload still exists, remove it first
    if (svgId.value) {
      document.getElementById(svgId.value)?.remove()
    }

    const generatedID = `bifrost-spline-${crypto.randomUUID()}`
    svgId.value = generatedID
    createSVG(generatedID)
    adjustSVGPath(generatedID)
  })

  // // Recalculate when inputs move (consumer can still call update manually)
  // if (auto) {
  //   const interval = setInterval(() => {
  //     if (svgId.value) adjustSVGPath(svgId.value)
  //   }, 100) // lightweight polling; can be replaced with observers later
  //   onBeforeUnmount(() => clearInterval(interval))
  // }

  function getCenter(element: HTMLDivElement): { x: number; y: number } {
    const box = element.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    return { x, y }
  }

  onBeforeUnmount(() => {
    if (svgId.value) {
      document.getElementById(svgId.value)?.remove()
      svgId.value = null
    }
  })

  // Handle Vite / HMR dispose (component may be replaced without unmount lifecycle firing for detached nodes)
  const _importMeta = import.meta as HMRImportMeta
  if (_importMeta.hot) {
    _importMeta.hot.dispose(() => {
      if (!svgId.value) return
      document.getElementById(svgId.value)?.remove()
      svgId.value = null
    })
  }

  function update() {
    if (svgId.value) adjustSVGPath(svgId.value)
  }

  return { update }
}
