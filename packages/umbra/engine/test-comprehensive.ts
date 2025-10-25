/**
 * Comprehensive test showing real-world usage of absolute + relative values
 * with independent HSL channel control
 */

import { umbraGenerate } from './generator'
import type { UmbraScheme, UmbraAdjusted } from './types'
import { swatch } from '../swatch'

// Simplified adjust function for testing
function quickAdjust(scheme: UmbraScheme): UmbraAdjusted {
  const accents = Array.isArray(scheme.accents)
    ? scheme.accents
    : (scheme.accents ? [scheme.accents] : [])

  return {
    background: swatch(scheme.background),
    foreground: swatch(scheme.foreground),
    accents
  }
}

console.log('\n========================================')
console.log('  UMBRA: Absolute & Relative Test')
console.log('========================================\n')

// Test 1: Simple absolute scale
console.log('--- Test 1: Simple Absolute Scale ---')
const scheme1: UmbraScheme = {
  background: '#0f172a',
  foreground: '#e2e8f0',
  accents: [],
  settings: {
    shades: [0, 20, 40, 60, 80, 100]
  }
}

const adjusted1 = quickAdjust(scheme1)
const result1 = umbraGenerate(scheme1, adjusted1)
console.log('Shades (absolute positions):')
result1[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - l:${hsl.l.toFixed(0)}%`)
})

// Test 2: Uniform spacing with relative values
console.log('\n--- Test 2: Uniform Spacing (Relative) ---')
const scheme2: UmbraScheme = {
  background: '#1a1a1a',
  foreground: '#ffffff',
  accents: [],
  settings: {
    shades: [5, '+=12', '+=12', '+=12', '+=12', '+=12', '+=12', '+=12']
  }
}

const adjusted2 = quickAdjust(scheme2)
const result2 = umbraGenerate(scheme2, adjusted2)
console.log('Shades (uniform +=12 spacing):')
result2[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - l:${hsl.l.toFixed(0)}%`)
})

// Test 3: Early saturation boost for color hints
console.log('\n--- Test 3: Early Saturation Boost ---')
const scheme3: UmbraScheme = {
  background: '#18181b',
  foreground: '#3b82f6',
  accents: [],
  settings: {
    shades: [
      0,
      { mix: 15, saturation: 40 },  // Saturation ramps faster
      { mix: 30, saturation: 65 },
      { mix: 50, saturation: 85 },
      { mix: 70 },                  // Back to linear
      100
    ]
  }
}

const adjusted3 = quickAdjust(scheme3)
const result3 = umbraGenerate(scheme3, adjusted3)
console.log('Shades (early saturation):')
result3[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Test 4: Mixed absolute and relative with channel control
console.log('\n--- Test 4: Mixed Absolute/Relative with Channels ---')
const scheme4: UmbraScheme = {
  background: '#111827',
  foreground: '#10b981',
  accents: [],
  settings: {
    shades: [
      0,
      { mix: 20, saturation: 35 },      // Absolute positions
      { mix: '+=20', saturation: '+=25' }, // Relative: 40%, sat 60%
      { mix: '+=20', saturation: '+=20' }, // Relative: 60%, sat 80%
      { mix: 80, hue: 90 },              // Jump to 80%, hue to 90%
      100
    ]
  }
}

const adjusted4 = quickAdjust(scheme4)
const result4 = umbraGenerate(scheme4, adjusted4)
console.log('Shades (mixed absolute/relative):')
result4[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Test 5: Going backwards with -= operator
console.log('\n--- Test 5: Backwards Movement with -= ---')
const scheme5: UmbraScheme = {
  background: '#1e293b',
  foreground: '#f59e0b',
  accents: [],
  settings: {
    shades: [
      30,
      '+=25',  // 55%
      '+=20',  // 75%
      '-=20',  // 55% - go back
      '+=35',  // 90%
      100
    ]
  }
}

const adjusted5 = quickAdjust(scheme5)
const result5 = umbraGenerate(scheme5, adjusted5)
console.log('Shades (with backward -= steps):')
result5[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - l:${hsl.l.toFixed(0)}%`)
})

console.log('\n========================================')
console.log('  All tests completed successfully!')
console.log('========================================\n')
