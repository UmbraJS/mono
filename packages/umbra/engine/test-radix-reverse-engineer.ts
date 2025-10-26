/**
 * Reverse-engineer Radix UI Blue scale
 * Goal: Find the right tints array to match Radix's handpicked colors
 */

import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

// Radix UI Blue scale (handpicked by designers)
const radixBlue = [
  '#fbfdff',
  '#f4faff',
  '#e6f4fe',
  '#d5efff',
  '#c2e5ff',
  '#acd8fc',
  '#8ec8f6',
  '#5eb1ef',
  '#0090ff', // Brightest, most saturated
  '#0588f0',
  '#0d74ce',
  '#113264'
]

// Helper to create adjusted scheme
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

// Calculate color difference (simple Delta E approximation)
function colorDifference(c1: string, c2: string): number {
  const color1 = swatch(c1).toRgb()
  const color2 = swatch(c2).toRgb()

  const rDiff = color1.r - color2.r
  const gDiff = color1.g - color2.g
  const bDiff = color1.b - color2.b

  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff)
}

// Test a tints configuration
function testConfig(tints: any[]) {
  const scheme: UmbraScheme = {
    background: '#ffffff',  // Pure white - your system's background
    foreground: '#000000', // Pure black - your system's foreground
    accents: [],
    settings: {
      tints // These 12 values should map to the 12 Radix colors
    }
  }

  const adjusted = createAdjusted(scheme)
  const result = umbraGenerate(scheme, adjusted)
  const generated = result[0].range.map(c => c.toHex())

  // Calculate total difference
  let totalDiff = 0
  const comparisons = []

  console.log(`Generated ${generated.length} colors, Radix has ${radixBlue.length} colors`)

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

console.log('\n=== Radix UI Blue Analysis ===\n')

// First, analyze the Radix colors to understand the pattern
console.log('Radix Blue scale properties:')
radixBlue.forEach((color, i) => {
  const hsl = swatch(color).toHsl()
  console.log(`  ${i}: ${color} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Find where #0090ff is (index 8)
const accentIndex = radixBlue.indexOf('#0090ff')
console.log(`\n#0090ff is at index ${accentIndex} (position ${(accentIndex / (radixBlue.length - 1) * 100).toFixed(0)}%)`)

console.log('\n=== Testing Different Configurations ===\n')

// Test 1: Just use the exact Radix colors as color stops
const test1 = testConfig(radixBlue)
console.log('Test 1: Exact Radix colors as stops')
console.log(`  Avg Difference: ${test1.avgDiff.toFixed(2)}`)
console.log('  Comparison:')
test1.comparisons.slice(0, 12).forEach(c => {
  console.log(`    ${c.index}: ${c.radix} vs ${c.generated} (diff: ${c.diff})`)
})

// Find the best result
const tests = [test1]
const best = tests.reduce((a, b) => a.avgDiff < b.avgDiff ? a : b)

console.log('\n=== Best Configuration ===')
console.log('Tints array:')
console.log(JSON.stringify(best.tints, null, 2))
console.log(`\nGenerated ${best.generatedCount} colors (Radix has ${radixBlue.length})`)
console.log(`Average color difference: ${best.avgDiff.toFixed(2)}`)
console.log('\nDetailed comparison:')
best.comparisons.forEach(c => {
  const hslRadix = swatch(c.radix).toHsl()
  const hslGen = swatch(c.generated).toHsl()
  console.log(`  ${c.index}: ${c.radix} (l:${hslRadix.l.toFixed(0)}%) vs ${c.generated} (l:${hslGen.l.toFixed(0)}%) - diff: ${c.diff}`)
})

console.log('\n=== Suggested Config ===')
console.log(`
const scheme = {
  background: '#ffffff',  // Pure white
  foreground: '#000000',  // Pure black
  settings: {
    tints: ${JSON.stringify(best.tints, null, 6).replace(/\n/g, '\n    ')}
  }
}

This creates 14 total colors:
- Background (#ffffff)
- 12 colors matching Radix Blue
- Foreground (#000000)
`)
