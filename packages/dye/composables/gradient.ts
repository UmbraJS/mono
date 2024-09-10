import { colord } from 'colord'
import { getDimentions } from './canvas'

type dimentionsType = {
  left: number
  top: number
  right: number
  bottom: number
}

type Sizes = {
  height: number
  width: number
  dimentions: dimentionsType
}

type ColorWheel = {
  color: {
    hue?: string
    saturation?: number
    lightness?: number
  }
  options?: {
    max?: number
    min?: number
  }
}

//shared canvas functions
export function fillRect(ctx: CanvasRenderingContext2D, dimentions: dimentionsType) {
  ctx.fillRect(dimentions.left, dimentions.top, dimentions.right, dimentions.bottom)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

interface Draw {
  hue: string
  ctx: CanvasRenderingContext2D
  sizes: Sizes
  options?: {
    max?: number
    min?: number
  }
}

function draw({ hue, ctx, sizes, options }: Draw) {
  const { width, height, dimentions } = sizes
  var color = colord(hue)
  const hsl = color.toHsl()
  for (var row = 0; row < 100; row++) {
    var grad = ctx.createLinearGradient(0, 0, width, 0)
    const lightness = clamp(100 - row, options?.min || 0, options?.max || 100)
    grad.addColorStop(0, `hsl(${hsl.h}, 0%, ${lightness}%)`)
    grad.addColorStop(1, `hsl(${hsl.h}, 100%, ${lightness}%)`)
    ctx.fillStyle = grad
    fillRect(ctx, {
      left: dimentions.left,
      top: dimentions.top + (row * height) / 100,
      right: dimentions.right,
      bottom: dimentions.bottom
    })
  }
}

//composition
export function fillColorCanvas(props: ColorWheel, canvas?: HTMLCanvasElement | null) {
  if (!canvas) return

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (ctx === null) return

  const sizes = getDimentions(canvas, {
    height: props.color.lightness || 100,
    width: props.color.saturation || 100
  })

  draw({ hue: props.color.hue || 'red', ctx, sizes, options: props?.options })
}
