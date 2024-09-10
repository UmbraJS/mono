import type { FiberPath } from './fiberPlace'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap-trial/InertiaPlugin'
gsap.registerPlugin(InertiaPlugin)
gsap.registerPlugin(Draggable)

interface GetPathData {
  output?: HTMLDivElement
  input?: HTMLDivElement
}

export function getPathData(path: FiberPath, { output, input }: GetPathData) {
  if (!output || !input) return path
  const boxOutput: DOMRect | undefined = output.getBoundingClientRect()
  const boxInput: DOMRect | undefined = input.getBoundingClientRect()

  const flipped = checkFlip({ boxOutput, boxInput })
  const reversed = checkRevesed({ boxOutput, boxInput })
  const curved = reversed ? 0.1 : adjustCurve({ boxOutput, boxInput })
  return {
    ...path,
    curve: curved,
    flipped: flipped,
    reversed: reversed
  }
}

function adjustCurve({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  // The closer the carbons are to each other the more the curve (between 0.1 and 1.0)
  const distanceHeight = Math.abs(boxOutput.top - boxInput.top)
  const distanceWidth = Math.abs(boxOutput.left - boxInput.left)
  const distance = Math.min(distanceHeight, distanceWidth) / 500
  if (distance > 0.6) return 0.6
  return distance
}

function checkFlip({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  // If center of carbon2 is higher than the center of carbon1 turn flipped to false
  const center1 = boxOutput.top + boxOutput.height / 2
  const center2 = boxInput.top + boxInput.height / 2
  if (center2 < center1) return false
  return true
}

function checkRevesed({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  // If carbon2 left is less than carbon1 right turn reversed to true
  if (boxInput.left < boxOutput.left + boxOutput.width) return true
  return false
}
