import { colorName } from './colorName'

function getColor(hex: string) {
  colorName(hex)
}

function notSupported() {
  if (!window) return true
  if (!('EyeDropper' in window)) {
    console.log('EyeDropper API not supported')
    return true
  }
  return false
}

// @ts-ignore
const dropper = new window.EyeDropper()

function openDropper(fn = getColor) {
  dropper.open().then((result: { sRGBHex: string }) => fn(result.sRGBHex))
}

export function eyeDropper(fn = getColor) {
  if (notSupported()) return
  try {
    openDropper(fn)
  } catch (err) {
    console.log(err)
  }
}
