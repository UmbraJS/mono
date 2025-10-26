/**
 * Optimize the early shades to have more blue tint
 * Problem: First shades too close to white background
 */

import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

const radixBlue = [
  '#fbfdff', // 0 - h:210° s:100% l:99%
  '#f4faff', // 1 - h:207° s:100% l:98%
  '#e6f4fe', // 2 - h:205° s:92% l:95%
  '#d5efff', // 3 - h:203° s:100% l:92%
  '#c2e5ff', // 4 - h:206° s:100% l:88%
  '#acd8fc', // 5 - h:207° s:93% l:83%
  '#8ec8f6', // 6 - h:207° s:85% l:76%
  '#5eb1ef', // 7 - h:206° s:82% l:65%
  '#0090ff', // 8 - h:206° s:100% l:50%
  '#0588f0', // 9 - h:207° s:96% l:48%
  '#0d74ce', // 10 - h:208° s:88% l:43%
  '#113264'  // 11 - h:216° s:71% l:23%
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

function testConfig(tints: any[], label: string) {
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
      diff: diff.toFixed(2),
      hslRadix: swatch(radixBlue[i]).toHsl(),
      hslGen: swatch(generated[i]).toHsl()
    })
  }

  console.log(`\n${label}`)
  console.log(`  Avg Difference: ${(totalDiff / radixBlue.length).toFixed(2)}`)
  console.log('  First 4 shades comparison:')
  comparisons.slice(0, 4).forEach(c => {
    console.log(`    ${c.index}: ${c.radix} (h:${c.hslRadix.h.toFixed(0)}° s:${c.hslRadix.s.toFixed(0)}% l:${c.hslRadix.l.toFixed(0)}%)`)
    console.log(`        vs ${c.generated} (h:${c.hslGen.h.toFixed(0)}° s:${c.hslGen.s.toFixed(0)}% l:${c.hslGen.l.toFixed(0)}%) - diff: ${c.diff}`)
  })

  return {
    tints,
    avgDiff: totalDiff / radixBlue.length,
    comparisons
  }
}

console.log('\n=== Optimizing Early Blue Tints ===\n')
console.log('Problem: First shades (1, 2, 5...) are too close to white')
console.log('Goal: Add more blue character to early shades\n')

// Analyze Radix early shades
console.log('Radix Blue first 4 shades:')
radixBlue.slice(0, 4).forEach((color, i) => {
  const hsl = swatch(color).toHsl()
  console.log(`  ${i}: ${color} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

console.log('\n=== Testing Configurations ===')

// Current (baseline)
const current = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Current (baseline)')

// Test 1: Add hue shift to early shades
const test1 = testConfig([
  { mix: 1, hue: 4 },   // Push toward 210° (Radix blue-0)
  { mix: 2, hue: 1 },   // Push toward 207°
  { mix: 5, hue: -1 },  // Push toward 205°
  { mix: 8, hue: -3 },  // Push toward 203°
  12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 1: Hue shifts in early shades')

// Test 2: Boost saturation early
const test2 = testConfig([
  { mix: 1, saturation: 100 },
  { mix: 2, saturation: 100 },
  { mix: 5, saturation: 92 },
  { mix: 8, saturation: 100 },
  12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 2: Boost saturation early')

// Test 3: Both hue and saturation
const test3 = testConfig([
  { mix: 1, hue: 4, saturation: 100 },
  { mix: 2, hue: 1, saturation: 100 },
  { mix: 5, hue: -1, saturation: 92 },
  { mix: 8, hue: -3, saturation: 100 },
  12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 3: Both hue and saturation control')

// Test 4: Use relative hue values
const test4 = testConfig([
  { mix: 1, hue: "+=4", saturation: "+=0" },
  { mix: 2, hue: "+=1", saturation: "+=0" },
  { mix: 5, hue: "-=1", saturation: "-=8" },
  { mix: 8, hue: "-=3", saturation: "+=0" },
  12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 4: Relative hue adjustments')

// Test 5: Start from a light blue color stop instead of mix value
const test5 = testConfig([
  '#f8fbff',  // Very light blue as first stop
  2, 5, 8, 12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 5: Light blue color stop at start')

// Test 6: Two early color stops
const test6 = testConfig([
  '#fbfdff',  // Radix blue-0
  '#f4faff',  // Radix blue-1
  5, 8, 12, 17, 24, 35,
  "#0090ff",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=12", hue: 0, saturation: "-=12" },
  { mix: "+=25", hue: 0, saturation: "-=29" }
], 'Test 6: Two Radix color stops early')

const tests = [current, test1, test2, test3, test4, test5, test6]
const best = tests.reduce((a, b) => a.avgDiff < b.avgDiff ? a : b)

console.log('\n\n=== Best Configuration ===')
console.log(`Average difference: ${best.avgDiff.toFixed(2)}\n`)
console.log('Tints array:')
console.log(JSON.stringify(best.tints, null, 2))

console.log('\n\nFull comparison:')
best.comparisons.forEach(c => {
  console.log(`  ${c.index}: ${c.radix} vs ${c.generated} - diff: ${c.diff}`)
})
