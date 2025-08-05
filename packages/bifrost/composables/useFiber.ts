import { ref } from 'vue'
import type { Ref } from 'vue'
import type { FiberPath } from '../utils/fiberPlace'
import { fiberPlace } from '../utils/fiberPlace'
import { useRef } from './useRef'
import { getPathData } from '../utils/fiberPath'

import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(Draggable)

interface UseFiber {
  output?: HTMLDivElement
  input?: HTMLDivElement
  board?: HTMLDivElement
}

export interface UseFiberReturn {
  path: Ref<FiberPath>
  update: () => void
  set: (element: HTMLDivElement) => void
}

export function useFiber({ output, input, board }: UseFiber) {
  const [SVGPath, setSVGPath] = useRef<HTMLDivElement>()

  const path = ref<FiberPath>({
    curve: 0.0,
    stroke: 5,
    padding: 10,
    width: 200,
    height: 200,
    flipped: false,
    reversed: false
  })

  function update() {
    path.value = getPathData(path.value, {
      output: output,
      input: input
    })
    if (!SVGPath.value) return
    fiberPlace(path.value, {
      board: board,
      output: output,
      input: input,
      fiber: SVGPath.value
    })
  }

  return {
    path,
    update,
    set: setSVGPath
  } as UseFiberReturn
}
