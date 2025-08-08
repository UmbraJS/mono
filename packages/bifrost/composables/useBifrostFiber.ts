import { ref } from 'vue'
import { useRef } from './useRef'

/**
 * Configuration interface for the Bifrost fiber composable
 */
interface UseBifrostFiberOptions {
  /** Board container element */
  board?: HTMLDivElement
  fiberStart?: HTMLDivElement
  fiberEnd?: HTMLDivElement
}

/**
 * Vue composable for managing Bifrost fiber connections between UI elements.
 * Creates and manages SVG paths that connect output and input elements on a board.
 *
 * @param config - Configuration object containing DOM elements
 * @param config.output - The output element (starting point of the connection)
 * @param config.input - The input element (ending point of the connection)
 * @param config.board - The board element (container for positioning)
 * @returns Object with path state, update function, and setter for SVG element
 *
 * @example
 * ```typescript
 * const { path, update, set } = useBifrostFiber({
 *   output: outputElement,
 *   input: inputElement,
 *   board: boardElement
 * })
 * ```
 */
export function useBifrostFiber({ board, fiberStart, fiberEnd }: UseBifrostFiberOptions) {
  // Support new prop names with fallback to legacy ones
  if (!fiberStart) {
    console.warn('[useBifrostFiber] "output" is deprecated. Use "fiberStart" instead.')
  }
  if (!fiberEnd) {
    console.warn('[useBifrostFiber] "input" is deprecated. Use "fiberEnd" instead.')
  }
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

  /**
   * Updates the fiber connection by recalculating path data and repositioning the fiber element.
   * This function should be called whenever the position of connected elements changes.
   *
   * @throws Will log errors if DOM operations fail but won't crash the application
   */
  function update() {
    try {
      path.value = getPathData(path.value, {
        fiberStart,
        fiberEnd
      })

      if (!SVGPath.value) {
        console.warn('update: SVGPath not available')
        return
      }

      calculateFiberPosition(path.value, {
        board: board,
        fiberStart: fiberStart,
        fiberEnd: fiberEnd,
        fiber: SVGPath.value
      })
    } catch (error) {
      console.error('update: Error updating fiber position', error)
    }
  }

  return {
    path,
    update,
    set: setSVGPath
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
  // Aligns the fiber SVG with the start carbon and adjusts the size of the fiber so it reaches the end carbon
  if (!el.board || !el.fiberStart || !el.fiberEnd || !el.fiber) {
    console.warn('calculateFiberPosition: Missing required DOM elements', {
      board: !!el.board,
      fiberStart: !!el.fiberStart,
      fiberEnd: !!el.fiberEnd
    })
    return
  }

  try {
    const boxBoard = el.board.getBoundingClientRect()
    const bifrost = el.fiber
    const fiberStartBox = el.fiberStart.getBoundingClientRect()
    const fiberEndBox = el.fiberEnd.getBoundingClientRect()

    const x = placeX(path, {
      board: boxBoard,
      fiberBox: fiberStartBox
    })

    const y = placeY(path, {
      board: boxBoard,
      fiberBox: fiberStartBox
    })

    // Position is used to sync the start of the bifrost with the output of the start carbon
    Object.assign(bifrost.style, {
      left: x.left,
      right: x.right,
      bottom: y.bottom,
      top: y.top
    })

    // Sizes are used to sync the end of the bifrost to the input of the next carbons
    const width = spaceBetweenX({
      fiberStartBox,
      fiberEndBox,
      board: boxBoard
    })

    path.width = width + path.padding * 2

    const height = spaceBetweenY(path, {
      fiberStartBox,
      fiberEndBox,
      board: boxBoard
    })

    path.height = height + path.padding * 2
  } catch (error) {
    console.error('calculateFiberPosition: Error calculating fiber position', error)
  }
}

/**
 * Interface for carbon and board positioning calculations
 */
interface CarbonBifrostOutput {
  /** Bounding rectangle of the board element */
  board: DOMRect
  /** Bounding rectangle of the fiber element */
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
  try {
    if (path.reversed) {
      const rightWithOffset = board.right - fiberBox.right
      const paddingOffset = rightWithOffset - path.padding
      return { right: `${paddingOffset}px`, left: 'auto' }
    }

    const leftWithOffset = fiberBox.left - board.left
    const fiberRightSide = leftWithOffset + fiberBox.width
    const paddingOffset = fiberRightSide - path.padding
    return { right: 'auto', left: `${paddingOffset}px` }
  } catch (error) {
    console.error('placeX: Error calculating X position', error)
    return { right: 'auto', left: '0px' }
  }
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
  try {
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
  } catch (error) {
    console.error('placeY: Error calculating Y position', error)
    return { top: 'auto', bottom: '0px' }
  }
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
  if (!fiberStart || !fiberEnd) {
    console.warn('getPathData: Missing fiberStart or fiberEnd elements', { fiberStart: !!fiberStart, fiberEnd: !!fiberEnd })
    return path
  }

  try {
    const boxOutput: DOMRect = fiberStart.getBoundingClientRect()
    const boxInput: DOMRect = fiberEnd.getBoundingClientRect()

    // Validate bounding rectangles
    if (boxOutput.width === 0 || boxOutput.height === 0 || boxInput.width === 0 || boxInput.height === 0) {
      console.warn('getPathData: Elements have zero dimensions', {
        outputSize: { width: boxOutput.width, height: boxOutput.height },
        inputSize: { width: boxInput.width, height: boxInput.height }
      })
      return path
    }

    const flipped = checkFlip({ boxOutput, boxInput })
    const reversed = checkReversed({ boxOutput, boxInput })
    const curved = reversed ? 0.1 : adjustCurve({ boxOutput, boxInput })

    return {
      ...path,
      curve: curved,
      flipped: flipped,
      reversed: reversed
    }
  } catch (error) {
    console.error('getPathData: Error calculating path data', error)
    return path
  }
}

/**
 * Calculates the curve intensity for a fiber path based on the distance between elements.
 * The closer the elements are, the more curved the path becomes (between 0.1 and 0.6).
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns Curve value between 0.1 and 0.6
 */
function adjustCurve({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  try {
    // The closer the carbons are to each other the more the curve (between 0.1 and 1.0)
    const distanceHeight = Math.abs(boxOutput.top - boxInput.top)
    const distanceWidth = Math.abs(boxOutput.left - boxInput.left)
    const distance = Math.min(distanceHeight, distanceWidth) / 500

    // Ensure we return a valid number
    if (!isFinite(distance)) {
      console.warn('adjustCurve: Invalid distance calculated', { distanceHeight, distanceWidth })
      return 0.1
    }

    if (distance > 0.6) return 0.6
    return Math.max(distance, 0.1) // Ensure minimum curve value
  } catch (error) {
    console.error('adjustCurve: Error calculating curve', error)
    return 0.1
  }
}

/**
 * Determines if the fiber path should be vertically flipped.
 * Flips the path if the input element's center is below the output element's center.
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns True if the path should be flipped, false otherwise
 */
function checkFlip({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  // If center of carbon2 is higher than the center of carbon1 turn flipped to false
  const center1 = boxOutput.top + boxOutput.height / 2
  const center2 = boxInput.top + boxInput.height / 2

  if (center2 < center1) return false
  return true
}

/**
 * Determines if the fiber path direction should be reversed.
 * Reverses the path if the input element overlaps horizontally with the output element.
 *
 * @param config - Object containing bounding rectangles of output and input elements
 * @returns True if the path should be reversed, false otherwise
 */
function checkReversed({ boxOutput, boxInput }: { boxOutput: DOMRect; boxInput: DOMRect }) {
  // If carbon2 left is less than carbon1 right turn reversed to true
  if (boxInput.left < boxOutput.left + boxOutput.width) return true
  return false
}
