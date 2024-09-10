import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin(Draggable)

export interface FiberPath {
  curve: number
  stroke: number
  padding: number
  width: number
  height: number
  flipped: boolean
  reversed: boolean
}

export interface CarbonFrost {
  board?: HTMLDivElement
  output?: HTMLDivElement
  input?: HTMLDivElement
  fiber?: HTMLDivElement
}

export function fiberPlace(path: FiberPath, el: CarbonFrost) {
  // Aligns the fiber SVG with the start carbon and adjusts the size of the fiber so it reaches the end carbon
  if (!el.board || !el.output || !el.input || !el.fiber) return
  const boxBoard = el.board.getBoundingClientRect()

  const bifrost = el.fiber
  const boxStartCarbon = el.output.getBoundingClientRect()
  const boxEndCarbon = el.input.getBoundingClientRect()

  const x = placeX(path, {
    board: boxBoard,
    carbon: boxStartCarbon
  })

  const y = placeY(path, {
    board: boxBoard,
    carbon: boxStartCarbon
  })

  // Position is used to sync the start of the bifrost with the output of the start carbon
  bifrost.style.left = x.left
  bifrost.style.right = x.right
  bifrost.style.bottom = y.bottom
  bifrost.style.top = y.top

  // Sizes are used to sync the end of the bifrost to the input of the next carbons
  const width = spaceBetweenX({
    startCarbon: boxStartCarbon,
    endCarbon: boxEndCarbon,
    board: boxBoard
  })

  path.width = width + path.padding * 2

  const height = spaceBetweenY(path, {
    startCarbon: boxStartCarbon,
    endCarbon: boxEndCarbon,
    board: boxBoard
  })

  path.height = height + path.padding * 2
}

interface CarbonBifrostOutput {
  board: DOMRect
  carbon: DOMRect
}

function placeX(path: FiberPath, { board, carbon }: CarbonBifrostOutput) {
  if (path.reversed) {
    const rigthWithOffset = board.right - carbon.right
    const paddingOffset = rigthWithOffset - path.padding
    return { right: `${paddingOffset}px`, left: 'auto' }
  } else {
    const leftWithOffset = carbon.left - board.left
    const carbonRightSide = leftWithOffset + carbon.width
    const paddingOffset = carbonRightSide - path.padding
    return { right: 'auto', left: `${paddingOffset}px` }
  }
}

function placeY(path: FiberPath, { board, carbon }: CarbonBifrostOutput) {
  const carbonCenter = carbon.height / 2
  const strokeOffset = path.stroke / 2
  const offset = carbonCenter - strokeOffset
  const paddingOffset = offset - path.padding

  if (path.flipped) {
    const topWithOffset = carbon.top - board.top
    return { top: `${topWithOffset + paddingOffset}px`, bottom: 'auto' }
  } else {
    const topWithOffset = board.bottom - carbon.bottom
    return { top: 'auto', bottom: `${topWithOffset + paddingOffset}px` }
  }
}

interface SpaceProps {
  startCarbon: DOMRect
  endCarbon: DOMRect
  board: DOMRect
}

function spaceBetweenY(path: FiberPath, { startCarbon, endCarbon, board }: SpaceProps) {
  const startCarbonCenter = startCarbon.top + startCarbon.height / 2 - board.top
  const endCarbonCenter = endCarbon.top + endCarbon.height / 2 - board.top
  const offset = path.flipped ? -path.stroke : path.stroke
  return Math.abs(startCarbonCenter - endCarbonCenter + offset)
}

function spaceBetweenX({ startCarbon, endCarbon, board }: SpaceProps) {
  const startCarbonEnd = startCarbon.left + startCarbon.width - board.left
  const endCarbonStart = endCarbon.left - board.left
  return Math.abs(startCarbonEnd - endCarbonStart)
}
