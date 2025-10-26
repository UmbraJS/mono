/**
 * Find the tints array VALUES (not colors) to auto-generate Radix Blue
 * Goal: Use ONE color string (#0090ff) and find the numeric progression
 */

import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

// Radix UI Blue scale
const radixBlue = [
  '#fbfdff',
  '#f4faff',
  '#e6f4fe',
  '#d5efff',
  '#c2e5ff',
  '#acd8fc',
  '#8ec8f6',
  '#5eb1ef',
  '#0090ff', // Index 8 - brightest, most saturated
  '#0588f0',
  '#0d74ce',
  '#113264'
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

function colorDifference(c1: string, c2: string): number {
  const color1 = swatch(c1).toRgb()
  const color2 = swatch(c2).toRgb()

  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
}

function testConfig(tints: any[]) {
  const scheme: UmbraScheme = {
    background: '#ffffff',
    foreground: '#000000',
    accents: [],
    settings: { tints }
  }

  const adjusted = createAdjusted(scheme)
  const result = umbraGenerate(scheme, adjusted)
  const generated = result[0].range.map(c => c.toHex())

  let totalDiff = 0
  const comparisons = []

  for (let i = 0; i < Math.min(generated.length, radixBlue.length); i++) {
    const diff = colorDifference(generated[i], radixBlue[i])
    totalDiff += diff
    comparisons.push({
      index: i,
      radix: radixBlue[i],
      generated: generated[i],
      diff: diff.toFixed(2)
    })
  }

  return {
    tints,
    totalDiff,
    avgDiff: totalDiff / radixBlue.length,
    comparisons,
    generated,
    generatedCount: generated.length
  }
}

console.log('\n=== Goal: Auto-generate Radix Blue with numeric progression ===\n')
console.log('Using background: #ffffff, foreground: #000000')
console.log('ONE color string allowed: #0090ff at index 8\n')

// Strategy: Build up the array piece by piece
// Before #0090ff: indices 0-7 (8 values)
// After #0090ff: indices 9-11 (3 values)

console.log('=== Testing Configurations ===\n')

// Test 1: Simple percentage positions
const positions = radixBlue.map((_, i) => (i / 11) * 100)
const test1 = testConfig([
  positions[0], positions[1], positions[2], positions[3],
  positions[4], positions[5], positions[6], positions[7],
  '#0090ff',
  positions[9], positions[10], positions[11]
])
console.log('Test 1: Even percentage spacing')
console.log(`  Avg Difference: ${test1.avgDiff.toFixed(2)}\n`)

// Test 2: Use relative values
const test2 = testConfig([
  '+=8', '+=8', '+=9', '+=9', '+=9', '+=9', '+=9', '+=9',
  '#0090ff',
  '+=4', '+=4', '+=8'
])
console.log('Test 2: Relative values')
console.log(`  Avg Difference: ${test2.avgDiff.toFixed(2)}\n`)

// Test 3: Analyze actual lightness progression
const radixLightness = radixBlue.map(c => swatch(c).toHsl().l)
console.log('Radix lightness values:', radixLightness.map(l => l.toFixed(1)).join(', '))

// Calculate what percentages would give us those lightnesses
// bg=#fff is l:100, fg=#000 is l:0
// So position% should correlate with lightness
const lightnessPositions = radixLightness.map(l => 100 - l) // Invert since we go light→dark
console.log('Lightness-based positions:', lightnessPositions.map(p => p.toFixed(1)).join(', '), '\n')

const test3 = testConfig([
  lightnessPositions[0], lightnessPositions[1], lightnessPositions[2], lightnessPositions[3],
  lightnessPositions[4], lightnessPositions[5], lightnessPositions[6], lightnessPositions[7],
  '#0090ff',
  lightnessPositions[9], lightnessPositions[10], lightnessPositions[11]
])
console.log('Test 3: Lightness-based positions')
console.log(`  Avg Difference: ${test3.avgDiff.toFixed(2)}\n`)

// Test 4: Fine-tune with independent lightness control
const test4 = testConfig([
  { mix: lightnessPositions[0], lightness: lightnessPositions[0] },
  { mix: lightnessPositions[1], lightness: lightnessPositions[1] },
  { mix: lightnessPositions[2], lightness: lightnessPositions[2] },
  { mix: lightnessPositions[3], lightness: lightnessPositions[3] },
  { mix: lightnessPositions[4], lightness: lightnessPositions[4] },
  { mix: lightnessPositions[5], lightness: lightnessPositions[5] },
  { mix: lightnessPositions[6], lightness: lightnessPositions[6] },
  { mix: lightnessPositions[7], lightness: lightnessPositions[7] },
  '#0090ff',
  { mix: lightnessPositions[9], lightness: lightnessPositions[9] },
  { mix: lightnessPositions[10], lightness: lightnessPositions[10] },
  { mix: lightnessPositions[11], lightness: lightnessPositions[11] }
])
console.log('Test 4: Independent lightness control')
console.log(`  Avg Difference: ${test4.avgDiff.toFixed(2)}\n`)

// Test 5: Try to match saturation too
const radixHSL = radixBlue.map(c => swatch(c).toHsl())
console.log('Radix HSL values:')
radixHSL.forEach((hsl, i) => {
  console.log(`  ${i}: h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Test 6: Match all three channels
const test6 = testConfig([
  { mix: lightnessPositions[0], hue: lightnessPositions[0], saturation: radixHSL[0].s, lightness: lightnessPositions[0] },
  { mix: lightnessPositions[1], hue: lightnessPositions[1], saturation: radixHSL[1].s, lightness: lightnessPositions[1] },
  { mix: lightnessPositions[2], hue: lightnessPositions[2], saturation: radixHSL[2].s, lightness: lightnessPositions[2] },
  { mix: lightnessPositions[3], hue: lightnessPositions[3], saturation: radixHSL[3].s, lightness: lightnessPositions[3] },
  { mix: lightnessPositions[4], hue: lightnessPositions[4], saturation: radixHSL[4].s, lightness: lightnessPositions[4] },
  { mix: lightnessPositions[5], hue: lightnessPositions[5], saturation: radixHSL[5].s, lightness: lightnessPositions[5] },
  { mix: lightnessPositions[6], hue: lightnessPositions[6], saturation: radixHSL[6].s, lightness: lightnessPositions[6] },
  { mix: lightnessPositions[7], hue: lightnessPositions[7], saturation: radixHSL[7].s, lightness: lightnessPositions[7] },
  '#0090ff',
  { mix: lightnessPositions[9], hue: lightnessPositions[9], saturation: radixHSL[9].s, lightness: lightnessPositions[9] },
  { mix: lightnessPositions[10], hue: lightnessPositions[10], saturation: radixHSL[10].s, lightness: lightnessPositions[10] },
  { mix: lightnessPositions[11], hue: lightnessPositions[11], saturation: radixHSL[11].s, lightness: lightnessPositions[11] }
])
console.log('\nTest 6: Full HSL channel control')
console.log(`  Avg Difference: ${test6.avgDiff.toFixed(2)}\n`)

const tests = [test1, test2, test3, test4, test6]
const best = tests.reduce((a, b) => a.avgDiff < b.avgDiff ? a : b)

console.log('\n=== Best Configuration ===')
console.log(`Average difference: ${best.avgDiff.toFixed(2)}`)
console.log('\nTints array:')
console.log(JSON.stringify(best.tints, null, 2))

console.log('\n\nDetailed comparison:')
best.comparisons.forEach(c => {
  const hslRadix = swatch(c.radix).toHsl()
  const hslGen = swatch(c.generated).toHsl()
  console.log(`  ${c.index}: ${c.radix} (h:${hslRadix.h.toFixed(0)}° s:${hslRadix.s.toFixed(0)}% l:${hslRadix.l.toFixed(0)}%)`)
  console.log(`      vs ${c.generated} (h:${hslGen.h.toFixed(0)}° s:${hslGen.s.toFixed(0)}% l:${hslGen.l.toFixed(0)}%) - diff: ${c.diff}`)
})

console.log('\n=== Insight ===')
console.log('The challenge: Radix colors have varying saturation AND varying hue.')
console.log('Your #0090ff anchor helps with hue, but you may need to tune saturation')
console.log('for each step to get an exact match.')
