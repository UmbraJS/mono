import { ref, computed } from 'vue'
import { useRef } from './useRef'

/** Options accepted by useBifrostFiber */
interface UseBifrostFiberOptions {
  board?: HTMLDivElement
  fiberStart?: HTMLDivElement
  fiberEnd?: HTMLDivElement
  /** Optional initial stroke width */
  stroke?: number
  /** Optional initial padding */
  padding?: number
  /** Optional initial curve override */
  curve?: number
  /** Orientation of the fiber connection (default: 'horizontal') */
  orientation?: 'horizontal' | 'vertical'
}

/** Public return contract of useBifrostFiber */
export interface UseBifrostFiberReturn {
  path: { value: FiberPath }
  pathD: { value: string }
  renderFlipped: { value: boolean }
  updateLayout: () => void
  setElement: (el: HTMLDivElement | null | undefined) => void
}

/**
 * Manage geometry + SVG path string for a visual connection ("fiber") between two anchors on a board.
 * Call updateLayout() whenever anchor positions can change (resize, drag, mount, etc.).
 */
export function useBifrostFiber({ board, fiberStart, fiberEnd, stroke, padding, curve, orientation }: UseBifrostFiberOptions): UseBifrostFiberReturn {
  const [fiberElement, setFiberElement] = useRef<HTMLDivElement>()

  const path = ref<FiberPath>(createDefaultFiberPath({ stroke, padding, curve, orientation }))

  /**
   * Updates the fiber connection by recalculating path data and repositioning the fiber element.
   * This function should be called whenever the position of connected elements changes.
   *
   * @throws Will log errors if DOM operations fail but won't crash the application
   */
  function updateLayout() {
    // Re-compute path directionality & curvature
    path.value = getPathData(path.value, { fiberStart, fiberEnd })
    // If required DOM not ready yet, bail silently
    if (!fiberElement.value || !board || !fiberStart || !fiberEnd) return
    calculateFiberPosition(path.value, {
      board,
      fiberStart,
      fiberEnd,
      fiber: fiberElement.value
    })
  }

  const renderFlipped = computed(() => {
    if (path.value.orientation === 'vertical') {
      // In vertical mode flipped means "start on right side"
      return path.value.reversed ? path.value.flipped : !path.value.flipped
    }
    // Horizontal: reversed indicates path moves leftwards, so invert flip to keep arc direction intuitive.
    return path.value.reversed ? !path.value.flipped : path.value.flipped
  })

  const pathD = computed(() => buildPathD(path.value, renderFlipped.value))

  const acceptNullable = (el: HTMLDivElement | null | undefined) => setFiberElement(el ?? undefined)

  return {
    path,
    updateLayout,
    setElement: acceptNullable,
    renderFlipped,
    pathD
  }
}

/**
 * Configuration interface for fiber path properties
 */
export interface FiberPath {
  /** Curvature of the path (0.0 to 1.0) */
  curve: number
  /** Stroke width of the path in pixels */
  stroke: number
  /** Padding around the path in pixels */
  padding: number
  /** Total width of the fiber container */
  width: number
  /** Total height of the fiber container */
  height: number
  /** Whether the path is vertically flipped */
  flipped: boolean
  /** Whether the path direction is reversed */
  reversed: boolean
  /** Orientation of the path */
  orientation: 'horizontal' | 'vertical'
}

/**
 * Interface for DOM elements involved in fiber positioning
 */
export interface CarbonFrost {
  /** The container board element */
  board?: HTMLDivElement
  /** The output (start) element */
  fiberStart?: HTMLDivElement
  /** The input (end) element */
  fiberEnd?: HTMLDivElement
  /** The fiber SVG element */
  fiber?: HTMLDivElement
}

/**
 * Calculates and applies the position and size of a fiber element to connect two carbon elements.
 * Aligns the fiber SVG with the start carbon and adjusts the size so it reaches the end carbon.
 *
 * @param path - The fiber path configuration object
 * @param el - Object containing the DOM elements (board, output, input, fiber)
 *
 * @throws Will log errors and return early if required DOM elements are missing
 *
 * @example
 * ```typescript
 * calculateFiberPosition(pathConfig, {
 *   board: boardElement,
 *   output: startElement,
 *   input: endElement,
 *   fiber: fiberSvgElement
 * })
 * ```
 */
export function calculateFiberPosition(path: FiberPath, el: CarbonFrost) {
  if (!el.board || !el.fiberStart || !el.fiberEnd || !el.fiber) return

  const boxBoard = el.board.getBoundingClientRect()
  const bifrost = el.fiber
  const fiberStartBox = el.fiberStart.getBoundingClientRect()
  const fiberEndBox = el.fiberEnd.getBoundingClientRect()
  if (path.orientation === 'vertical') {
    // Position and size container to span between centers of start and end carbon vertically and horizontally
    const startCenterY = fiberStartBox.top + fiberStartBox.height / 2 - boxBoard.top
    const endCenterY = fiberEndBox.top + fiberEndBox.height / 2 - boxBoard.top
    const startCenterX = fiberStartBox.left + fiberStartBox.width / 2 - boxBoard.left
    const endCenterX = fiberEndBox.left + fiberEndBox.width / 2 - boxBoard.left
    const minY = Math.min(startCenterY, endCenterY)
    const minX = Math.min(startCenterX, endCenterX)
    const deltaY = Math.abs(endCenterY - startCenterY)
    const deltaX = Math.abs(endCenterX - startCenterX)
    const strokeOffset = path.stroke / 2
    const top = minY - strokeOffset - path.padding
    const left = minX - strokeOffset - path.padding
    path.height = deltaY + path.stroke + path.padding * 2
    path.width = deltaX + path.stroke + path.padding * 2
    Object.assign(bifrost.style, { top: `${top}px`, left: `${left}px`, right: 'auto', bottom: 'auto' })
  } else {
    const x = placeX(path, { board: boxBoard, fiberBox: fiberStartBox })
    const y = placeY(path, { board: boxBoard, fiberBox: fiberStartBox })
    Object.assign(bifrost.style, { left: x.left, right: x.right, bottom: y.bottom, top: y.top })
    path.width = spaceBetweenX({ fiberStartBox, fiberEndBox, board: boxBoard }) + path.padding * 2
    path.height = spaceBetweenY(path, { fiberStartBox, fiberEndBox, board: boxBoard }) + path.padding * 2
  }
}

/**
 * Interface for carbon and board positioning calculations
 */
interface CarbonBifrostOutput {
  board: DOMRect
  fiberBox: DOMRect
}

/**
 * Calculates the horizontal (X-axis) positioning for a fiber element.
 * Handles both normal and reversed fiber directions.
 *
 * @param path - The fiber path configuration
 * @param config - Object containing board and fiber bounding rectangles
 * @returns CSS positioning object with left/right values
 */
function placeX(path: FiberPath, { board, fiberBox }: CarbonBifrostOutput) {
  if (path.reversed) {
    const rightWithOffset = board.right - fiberBox.right
    const paddingOffset = rightWithOffset - path.padding
    return { right: `${paddingOffset}px`, left: 'auto' }
  }
  const leftWithOffset = fiberBox.left - board.left
  const fiberRightSide = leftWithOffset + fiberBox.width
  const paddingOffset = fiberRightSide - path.padding
  return { right: 'auto', left: `${paddingOffset}px` }
}

/**
 * Calculates the vertical (Y-axis) positioning for a fiber element.
 * Handles both normal and flipped fiber orientations.
 *
 * @param path - The fiber path configuration
 * @param config - Object containing board and fiber bounding rectangles
 * @returns CSS positioning object with top/bottom values
 */
function placeY(path: FiberPath, { board, fiberBox }: CarbonBifrostOutput) {
  const fiberCenter = fiberBox.height / 2
  const strokeOffset = path.stroke / 2
  const offset = fiberCenter - strokeOffset
  const paddingOffset = offset - path.padding
  if (path.flipped) {
    const topWithOffset = fiberBox.top - board.top
    return { top: `${topWithOffset + paddingOffset}px`, bottom: 'auto' }
  }
  const topWithOffset = board.bottom - fiberBox.bottom
  return { top: 'auto', bottom: `${topWithOffset + paddingOffset}px` }
}

/**
 * Interface for spacing calculations between carbon elements
 */
interface SpaceProps {
  /** Bounding rectangle of the starting carbon element */
  fiberStartBox: DOMRect
  /** Bounding rectangle of the ending carbon element */
  fiberEndBox: DOMRect
  /** Bounding rectangle of the board container */
  board: DOMRect
}

/**
 * Calculates the vertical distance between two carbon elements.
 * Takes into account the fiber path configuration and stroke offset.
 *
 * @param path - The fiber path configuration
 * @param config - Object containing bounding rectangles of both carbons and board
 * @returns Absolute vertical distance in pixels
 */
function spaceBetweenY(path: FiberPath, { fiberStartBox, fiberEndBox, board }: SpaceProps) {
  const startCarbonCenter = fiberStartBox.top + fiberStartBox.height / 2 - board.top
  const endCarbonCenter = fiberEndBox.top + fiberEndBox.height / 2 - board.top
  const offset = path.flipped ? -path.stroke : path.stroke
  return Math.abs(startCarbonCenter - endCarbonCenter + offset)
}

/**
 * Calculates the horizontal distance between two carbon elements.
 * Measures from the end of the start carbon to the beginning of the end carbon.
 *
 * @param config - Object containing bounding rectangles of both carbons and board
 * @returns Absolute horizontal distance in pixels
 */
function spaceBetweenX({ fiberStartBox, fiberEndBox, board }: SpaceProps) {
  const startCarbonEnd = fiberStartBox.left + fiberStartBox.width - board.left
  const endCarbonStart = fiberEndBox.left - board.left
  return Math.abs(startCarbonEnd - endCarbonStart)
}


/**
 * Interface for path data calculation input
 */
interface GetPathData {
  /** The output (starting) DOM element */
  fiberStart?: HTMLDivElement
  /** The input (ending) DOM element */
  fiberEnd?: HTMLDivElement
}

/**
 * Calculates path data for a fiber connection based on the positions of output and input elements.
 * Determines if the path should be flipped, reversed, and calculates the appropriate curve value.
 *
 * @param path - The current fiber path configuration
 * @param config - Object containing the output and input DOM elements
 * @returns Updated path configuration with calculated properties
 *
 * @example
 * ```typescript
 * const updatedPath = getPathData(currentPath, {
 *   output: startElement,
 *   input: endElement
 * })
 * ```
 */
export function getPathData(path: FiberPath, { fiberStart, fiberEnd }: GetPathData) {
  if (!fiberStart || !fiberEnd) return path
  const boxStart: DOMRect = fiberStart.getBoundingClientRect()
  const boxEnd: DOMRect = fiberEnd.getBoundingClientRect()
  if (!boxStart.width || !boxStart.height || !boxEnd.width || !boxEnd.height) return path
  const flipped = path.orientation === 'horizontal'
    ? checkFlipHorizontal({ boxStart, boxEnd })
    : checkFlipVertical({ boxStart, boxEnd })
  const reversed = path.orientation === 'horizontal'
    ? checkReversedHorizontal({ boxStart, boxEnd })
    : checkReversedVertical({ boxStart, boxEnd })
  const curved = reversed ? 0.1 : adjustCurve({ boxStart, boxEnd })
  return { ...path, curve: curved, flipped, reversed }
}

/**
 * Calculates the curve intensity for a fiber path based on the distance between elements.
 * The closer the elements are, the more curved the path becomes (between 0.1 and 0.6).
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns Curve value between 0.1 and 0.6
 */
function adjustCurve({ boxStart, boxEnd }: { boxStart: DOMRect; boxEnd: DOMRect }) {
  const distanceHeight = Math.abs(boxStart.top - boxEnd.top)
  const distanceWidth = Math.abs(boxStart.left - boxEnd.left)
  const raw = Math.min(distanceHeight, distanceWidth) / 500
  if (!isFinite(raw)) return 0.1
  return clamp(raw, 0.1, 0.6)
}

/**
 * Determines if the fiber path should be vertically flipped.
 * Flips the path if the input element's center is below the output element's center.
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns True if the path should be flipped, false otherwise
 */
function checkFlipHorizontal({ boxStart, boxEnd }: { boxStart: DOMRect; boxEnd: DOMRect }) {
  const center1 = boxStart.top + boxStart.height / 2
  const center2 = boxEnd.top + boxEnd.height / 2
  return center2 >= center1
}

/**
 * Determines if the fiber path direction should be reversed.
 * Reverses the path if the input element overlaps horizontally with the output element.
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns True if the path should be reversed, false otherwise
 */
function checkReversedHorizontal({ boxStart, boxEnd }: { boxStart: DOMRect; boxEnd: DOMRect }) {
  return boxEnd.left < boxStart.left + boxStart.width
}

// For vertical orientation, flipped indicates input is to the right of output center.
function checkFlipVertical({ boxStart, boxEnd }: { boxStart: DOMRect; boxEnd: DOMRect }) {
  // const center1 = boxOutput.top + boxOutput.height / 2
  // const center2 = boxInput.top + boxInput.height / 2
  const center1 = boxStart.left + boxStart.width / 2
  const center2 = boxEnd.left + boxEnd.width / 2
  return center2 >= center1
}

function checkReversedVertical({ boxStart, boxEnd }: { boxStart: DOMRect; boxEnd: DOMRect }) {
  //  // Reversed for vertical means the connection travels upward (input above output)
  // return boxInput.top + boxInput.height / 2 < boxOutput.top + boxOutput.height / 2
  return boxEnd.top < boxStart.top + boxStart.height
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)) }

/** Build an SVG path string for current fiber path geometry */
export function buildPathD(p: FiberPath, flipped: boolean) {
  if (p.orientation === 'vertical') {
    const height = p.height - p.padding
    const width = p.width
    const curve = height * p.curve
    const strokeOffset = p.stroke / 2
    const left = strokeOffset + p.padding
    const right = width - strokeOffset - p.padding
    const startX = flipped ? right : left
    const endX = flipped ? left : right
    const startY = p.padding
    const endY = height - p.padding
    const c1 = `${startX}, ${startY + curve}`
    const c2 = `${endX}, ${endY - curve}`
    return `M${startX}, ${startY} C${c1}, ${c2}, ${endX}, ${endY}`
  }
  const width = p.width - p.padding
  const height = p.height
  const curve = width * p.curve
  const strokeOffset = p.stroke / 2
  const top = strokeOffset + p.padding
  const bottom = height - strokeOffset - p.padding
  const start = flipped ? top : bottom
  const end = `${width}, ${flipped ? bottom : top}`
  const startCurve = `${curve}, ${flipped ? top : bottom}`
  const endCurve = `${width - curve}, ${flipped ? bottom : top}`

  console.log("rex curve: ", { curve, width, pCurve: p.curve })

  return `M${p.padding}, ${start} C${startCurve}, ${endCurve}, ${end}`
}

/** Create a default FiberPath with optional overrides */
export function createDefaultFiberPath(overrides: Partial<Pick<FiberPath, 'stroke' | 'padding' | 'curve' | 'orientation'>> = {}): FiberPath {
  return {
    curve: overrides.curve ?? 0.0,
    stroke: overrides.stroke ?? 5,
    padding: overrides.padding ?? 10,
    width: 200,
    height: 200,
    flipped: false,
    reversed: false,
    orientation: overrides.orientation ?? 'horizontal'
  }
}
