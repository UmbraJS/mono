import { useDebounceFn } from '@vueuse/core'
import { OutputColor } from './canvas'

export function rgbToHex(orig: any) {
  var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : orig
  return '#' + hex
}

export function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num
}

export function useDebounce(
  callback: (dye: OutputColor) => void,
  wait = 4
): ReturnType<typeof useDebounceFn> {
  return useDebounceFn((dye: OutputColor) => callback(dye), wait, {
    maxWait: 200
  })
}
