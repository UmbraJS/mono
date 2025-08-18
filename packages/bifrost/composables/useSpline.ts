import { onMounted } from 'vue'
import { generateSpline, cubic } from "../utils/spline";

/** Options accepted by useBifrostFiber */
interface UseBifrostFiberOptions {
  start?: HTMLDivElement
  end?: HTMLDivElement
  stroke?: number
}

export function useSpline({ start, end, stroke = 1.5 }: UseBifrostFiberOptions) {

  function placeSVG(svgID: string) {
    const svg = document.getElementById(svgID);
    if (!svg) return
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
  }

  function createSVG(id: string) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
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

  onMounted(() => {
    const generatedID = crypto.randomUUID();
    createSVG(generatedID);
    placeSVG(generatedID);
    const svgElement = document.getElementById(generatedID);
    const splinePath = svgElement?.querySelector("#spline");

    const spline = generateSpline({
      curve: cubic.with({ startTension: 6, endTension: 6 }),
      pins: [
        { x: 0, y: 0, angle: 90, length: 10 }, // start pin at origin
        { x: 100, y: 100, angle: 90, length: 10 } // end pin at origin
      ],
    })

    splinePath?.setAttribute("d", spline.d);
  })
}
