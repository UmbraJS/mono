/**
 * Find tints array to match Radix Blue while using pure white/black endpoints
 * Strategy: Preserve #0090ff hue in darker shades using independent channel control
 */

import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

const radixBlue = [
  '#fbfdff', // 0
  '#f4faff', // 1
  '#e6f4fe', // 2
  '#d5efff', // 3
  '#c2e5ff', // 4
  '#acd8fc', // 5
  '#8ec8f6', // 6
  '#5eb1ef', // 7
  '#0090ff', // 8 - The accent color
  '#0588f0', // 9
  '#0d74ce', // 10
  '#113264'  // 11
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
    background: '#ffffff', // Pure white (shared with all accents)
    foreground: '#000000', // Pure black (shared with all accents)
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
    generated
  }
}

console.log('\n=== Goal: Match Radix Blue with white/black endpoints ===\n')
console.log('Background: #ffffff (pure white - shared across accents)')
console.log('Foreground: #000000 (pure black - shared across accents)')
console.log('Challenge: Preserve blue hue after #0090ff while darkening\n')

// Analyze Radix Blue
const radixHSL = radixBlue.map(c => swatch(c).toHsl())
const accentHue = radixHSL[8].h // #0090ff hue (206°)

console.log('Radix Blue HSL analysis:')
radixHSL.forEach((hsl, i) => {
  console.log(`  ${i}: h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}% - ${radixBlue[i]}`)
})
console.log(`\nAccent color #0090ff has hue: ${accentHue.toFixed(0)}°\n`)

// Calculate lightness positions
const radixLightness = radixBlue.map(c => swatch(c).toHsl().l)
const lightnessPositions = radixLightness.map(l => 100 - l)

console.log('=== Testing Configurations ===\n')

// Test 1: Use lightness-based positions, preserve hue after accent
const test1 = testConfig([
  1,  // blue-0
  2,  // blue-1
  5,  // blue-2
  8,  // blue-3
  12, // blue-4
  17, // blue-5
  24, // blue-6
  35, // blue-7
  '#0090ff', // blue-8 - anchor
  { mix: 52, hue: 0 }, // blue-9 - keep accent hue, but darken
  { mix: 57, hue: 0 }, // blue-10
  { mix: 77, hue: 0 }  // blue-11
])
console.log('Test 1: Preserve accent hue with hue:0 (no change from #0090ff)')
console.log(`  Avg Difference: ${test1.avgDiff.toFixed(2)}`)

// Test 2: Use small hue adjustments
const test2 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: 52, hue: 1 },  // Slight hue shift
  { mix: 57, hue: 2 },
  { mix: 77, hue: 10 }
])
console.log('\nTest 2: Small hue shifts after accent')
console.log(`  Avg Difference: ${test2.avgDiff.toFixed(2)}`)

// Test 3: Control saturation AND hue
const test3 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: 52, hue: 0, saturation: 96 },  // Match Radix blue-9 saturation
  { mix: 57, hue: 1, saturation: 88 },  // Match Radix blue-10 saturation
  { mix: 77, hue: 10, saturation: 71 }  // Match Radix blue-11 saturation
])
console.log('\nTest 3: Control both hue and saturation')
console.log(`  Avg Difference: ${test3.avgDiff.toFixed(2)}`)

// Test 4: Fine-tune the mix positions too
const test4 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: 52, hue: 1, saturation: 96, lightness: 52 },
  { mix: 57, hue: 2, saturation: 88, lightness: 57 },
  { mix: 77, hue: 10, saturation: 71, lightness: 77 }
])
console.log('\nTest 4: Full HSL control after accent')
console.log(`  Avg Difference: ${test4.avgDiff.toFixed(2)}`)

// Test 5: Use relative values to adjust from accent
const test5 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: '+=2', hue: '+=1', saturation: '-=4' },
  { mix: '+=5', hue: '+=2', saturation: '-=12' },
  { mix: '+=20', hue: '+=10', saturation: '-=29' }
])
console.log('\nTest 5: Relative adjustments from #0090ff')
console.log(`  Avg Difference: ${test5.avgDiff.toFixed(2)}`)

// Test 6: Optimize before accent colors too
const test6 = testConfig([
  { mix: 1, hue: 4 },   // blue-0: h:210 (accent is 206, so +4)
  { mix: 2, hue: 1 },   // blue-1: h:207
  { mix: 5, hue: -1 },  // blue-2: h:205
  { mix: 8, hue: -3 },  // blue-3: h:203
  { mix: 12, hue: 0 },  // blue-4: h:206
  { mix: 17, hue: 1 },  // blue-5: h:207
  { mix: 24, hue: 1 },  // blue-6: h:207
  { mix: 35, hue: 0 },  // blue-7: h:206
  '#0090ff',            // blue-8: h:206
  { mix: 52, hue: 1, saturation: 96 },
  { mix: 57, hue: 2, saturation: 88 },
  { mix: 77, hue: 10, saturation: 71 }
])
console.log('\nTest 6: Fine-tune hue throughout entire range')
console.log(`  Avg Difference: ${test6.avgDiff.toFixed(2)}`)

// Test 7: Refine the relative values - adjust the last one more
const test7 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: '+=2', hue: '+=1', saturation: '-=4' },
  { mix: '+=5', hue: '+=2', saturation: '-=12' },
  { mix: '+=25', hue: '+=10', saturation: '-=29' }  // Increased mix from +=20
])
console.log('\nTest 7: Adjust final mix position')
console.log(`  Avg Difference: ${test7.avgDiff.toFixed(2)}`)

// Test 8: Try keeping even more saturation
const test8 = testConfig([
  1, 2, 5, 8, 12, 17, 24, 35,
  '#0090ff',
  { mix: '+=2', hue: '+=1', saturation: '-=4', lightness: '+=0' },
  { mix: '+=7', hue: '+=2', saturation: '-=12', lightness: '+=0' },
  { mix: '+=27', hue: '+=10', saturation: '-=29', lightness: '+=0' }
])
console.log('\nTest 8: Keep lightness tied to mix')
console.log(`  Avg Difference: ${test8.avgDiff.toFixed(2)}`)

const tests = [test1, test2, test3, test4, test5, test6, test7, test8]
const best = tests.reduce((a, b) => a.avgDiff < b.avgDiff ? a : b)

console.log('\n\n=== Best Configuration ===')
console.log(`Average difference: ${best.avgDiff.toFixed(2)}\n`)
console.log('Tints array:')
console.log(JSON.stringify(best.tints, null, 2))

console.log('\n\nDetailed comparison:')
best.comparisons.forEach(c => {
  const hslRadix = swatch(c.radix).toHsl()
  const hslGen = swatch(c.generated).toHsl()
  console.log(`  ${c.index}: ${c.radix} (h:${hslRadix.h.toFixed(0)}° s:${hslRadix.s.toFixed(0)}% l:${hslRadix.l.toFixed(0)}%)`)
  console.log(`      vs ${c.generated} (h:${hslGen.h.toFixed(0)}° s:${hslGen.s.toFixed(0)}% l:${hslGen.l.toFixed(0)}%) - diff: ${c.diff}`)
})

console.log('\n\n=== Key Insight ===')
console.log('After #0090ff color stop, use object syntax to:')
console.log('  - mix: continue darkening toward foreground')
console.log('  - hue: stay close to #0090ff hue (206°) with small shifts')
console.log('  - saturation: decrease gradually (100% → 96% → 88% → 71%)')
console.log('\nThis preserves the blue character while darkening!')
