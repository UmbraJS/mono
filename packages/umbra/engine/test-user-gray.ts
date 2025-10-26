import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

const radixGrayHex = [
  '#fcfcfc', '#f9f9f9', '#f0f0f0', '#e8e8e8',
  '#e0e0e0', '#d9d9d9', '#cecece', '#bbbbbb',
  '#8d8d8d', '#838383', '#646464', '#202020'
]

function createAdjusted(scheme: UmbraScheme): UmbraAdjusted {
  const accents = Array.isArray(scheme.accents)
    ? scheme.accents
    : (scheme.accents ? [scheme.accents] : [])

  return {
    background: swatch(scheme.background),
    foreground: swatch(scheme.foreground),
    accents
  }
}

const radixGray = radixGrayHex.map(c => swatch(c))

console.log('=== Testing User\'s Manual Configuration ===\n')

const userConfig = [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]
const myConfig = [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]

const userScheme: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: { tints: userConfig }
}

const myScheme: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: { tints: myConfig }
}

const userResult = umbraGenerate(userScheme, createAdjusted(userScheme))[0].range
const myResult = umbraGenerate(myScheme, createAdjusted(myScheme))[0].range

console.log('User config: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]')
let userTotalDiff = 0
userResult.forEach((color, i) => {
  const generated = color.toHsl()
  const radix = radixGray[i].toHsl()
  const diff = Math.abs(generated.l - radix.l)
  userTotalDiff += diff
  console.log(`  ${i + 1}: Gen: ${color.toHex()} l:${generated.l.toFixed(1)}% | Radix: ${radixGrayHex[i]} l:${radix.l.toFixed(1)}% | Diff: ${diff.toFixed(2)}%`)
})
console.log(`\nAverage diff: ${(userTotalDiff / 12).toFixed(2)}%\n`)

console.log('My config: [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]')
let myTotalDiff = 0
myResult.forEach((color, i) => {
  const generated = color.toHsl()
  const radix = radixGray[i].toHsl()
  const diff = Math.abs(generated.l - radix.l)
  myTotalDiff += diff
  console.log(`  ${i + 1}: Gen: l:${generated.l.toFixed(1)}% | Radix: l:${radix.l.toFixed(1)}% | Diff: ${diff.toFixed(2)}%`)
})
console.log(`\nAverage diff: ${(myTotalDiff / 12).toFixed(2)}%`)

console.log('\n=== Summary ===')
console.log(`User's manual tuning: ${(userTotalDiff / 12).toFixed(2)}% average diff`)
console.log(`My smooth curve attempt: ${(myTotalDiff / 12).toFixed(2)}% average diff`)
console.log(`\nUser wins by: ${(myTotalDiff - userTotalDiff).toFixed(2)}% 🎉`)
