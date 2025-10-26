import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

// Radix gray colors (hardcoded since @radix-ui/colors isn't available in the package)
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

console.log('=== Analyzing Radix Gray Scale ===\n')

const radixGray = radixGrayHex.map(c => swatch(c))

console.log('Radix Gray colors:')
radixGray.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i + 1}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Calculate lightness progression
console.log('\nLightness progression:')
const lightnessValues = radixGray.map(c => c.toHsl().l)
lightnessValues.forEach((l, i) => {
  if (i > 0) {
    const diff = lightnessValues[i - 1] - l
    console.log(`  ${i} → ${i + 1}: ${lightnessValues[i - 1].toFixed(1)}% → ${l.toFixed(1)}% (diff: ${diff.toFixed(1)}%)`)
  }
})

console.log('\n=== Testing Different Configurations ===\n')

// Test 1: Pure numeric progression
console.log('Test 1: Pure numeric values [1, 2, 5, 8, 12, 17, 24, 35, 45, 60, 75, 90]')
const scheme1: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [1, 2, 5, 8, 12, 17, 24, 35, 45, 60, 75, 90]
  }
}
const test1 = umbraGenerate(scheme1, createAdjusted(scheme1))[0].range

let totalDiff1 = 0
test1.forEach((color, i) => {
  const generated = color.toHsl()
  const radix = radixGray[i].toHsl()
  const lightnessDiff = Math.abs(generated.l - radix.l)
  totalDiff1 += lightnessDiff
  console.log(`  ${i + 1}: Gen: l:${generated.l.toFixed(1)}% | Radix: l:${radix.l.toFixed(1)}% | Diff: ${lightnessDiff.toFixed(1)}%`)
})
console.log(`Average lightness diff: ${(totalDiff1 / 12).toFixed(2)}%\n`)

// Test 2: Adjusted for better early progression
console.log('Test 2: Adjusted early values [0.5, 1.5, 3, 6, 10, 15, 22, 32, 45, 60, 75, 90]')
const scheme2: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [0.5, 1.5, 3, 6, 10, 15, 22, 32, 45, 60, 75, 90]
  }
}
const test2 = umbraGenerate(scheme2, createAdjusted(scheme2))[0].range

let totalDiff2 = 0
test2.forEach((color, i) => {
  const generated = color.toHsl()
  const radix = radixGray[i].toHsl()
  const lightnessDiff = Math.abs(generated.l - radix.l)
  totalDiff2 += lightnessDiff
  console.log(`  ${i + 1}: Gen: l:${generated.l.toFixed(1)}% | Radix: l:${radix.l.toFixed(1)}% | Diff: ${lightnessDiff.toFixed(1)}%`)
})
console.log(`Average lightness diff: ${(totalDiff2 / 12).toFixed(2)}%\n`)

// Test 3: Fine-tuned based on analysis
console.log('Test 3: Fine-tuned [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]')
const scheme3: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88]
  }
}
const test3 = umbraGenerate(scheme3, createAdjusted(scheme3))[0].range

let totalDiff3 = 0
test3.forEach((color, i) => {
  const generated = color.toHsl()
  const radix = radixGray[i].toHsl()
  const lightnessDiff = Math.abs(generated.l - radix.l)
  totalDiff3 += lightnessDiff
  console.log(`  ${i + 1}: Gen: l:${generated.l.toFixed(1)}% | Radix: l:${radix.l.toFixed(1)}% | Diff: ${lightnessDiff.toFixed(1)}%`)
})
console.log(`Average lightness diff: ${(totalDiff3 / 12).toFixed(2)}%\n`)

console.log('=== Summary ===')
console.log(`Test 1 avg diff: ${(totalDiff1 / 12).toFixed(2)}%`)
console.log(`Test 2 avg diff: ${(totalDiff2 / 12).toFixed(2)}%`)
console.log(`Test 3 avg diff: ${(totalDiff3 / 12).toFixed(2)}%`)

