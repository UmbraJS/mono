import tinycolor from "tinycolor2"
import { getDimentions } from "./canvas"

type dimentionsType = {
  left: number, 
  top: number, 
  right: number, 
  bottom: number
}

type sizesType = {
  height: number, 
  width: number,
  dimentions: dimentionsType,
}

type colorWheelType = { 
  hue?: string, 
  saturation? : number,
  lightness?: number
}

//shared canvas functions
export function fillRect(ctx: CanvasRenderingContext2D, dimentions: dimentionsType) {
  ctx.fillRect(
    dimentions.left, 
    dimentions.top, 
    dimentions.right, 
    dimentions.bottom
  )
}

function draw(hue: string, ctx: CanvasRenderingContext2D, sizes: sizesType) {
  const { width, height, dimentions } = sizes
  var color = tinycolor(hue);
  const hsl = color.toHsl();
	for(var row = 0; row < 100; row++){
		var grad = ctx.createLinearGradient(0, 0, width, 0);
		grad.addColorStop(0, 'hsl('+hsl.h+', 0%, '+(100-row)+'%)');
		grad.addColorStop(1, 'hsl('+hsl.h+', 100%, '+(100-row)+'%)');
		ctx.fillStyle=grad;
    fillRect(ctx, {
      left: dimentions.left,
      top: dimentions.top + row * height / 100,
      right: dimentions.right,
      bottom: dimentions.bottom
    })
	}	
}

//composition
export function fillColorCanvas(props?: colorWheelType, canvas?: HTMLCanvasElement | null) {
  if(!canvas) return
  const {hue = 'red', saturation = 100, lightness = 100} = props || {}

  const ctx = canvas.getContext('2d')
  if(ctx === null) return
  
  const sizes = getDimentions(canvas, {
    height: lightness,
    width: saturation
  })

  draw(hue, ctx, sizes)
}