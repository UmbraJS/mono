/**
 * Test to verify color stops work correctly
 * Shades should interpolate between consecutive color stops
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
console.log('  Color Stops Interpolation Test')
console.log('========================================\n')

// Test 1: No color stops - interpolate from background to foreground
console.log('--- Test 1: No Color Stops (bg -> fg) ---')
const scheme1: UmbraScheme = {
  background: '#000000',
  foreground: '#ffffff',
  accents: [],
  settings: {
    shades: [0, 25, 50, 75, 100]
  }
}

const adjusted1 = quickAdjust(scheme1)
const result1 = umbraGenerate(scheme1, adjusted1)
console.log('From #000000 to #ffffff:')
result1[0].range.forEach((color, i) => {
  console.log(`  ${i}: ${color.toHex()}`)
})

// Test 2: One color stop in the middle
console.log('\n--- Test 2: One Color Stop (bg -> stop -> fg) ---')
const scheme2: UmbraScheme = {
  background: '#000000',
  foreground: '#ffffff',
  accents: [],
  settings: {
    shades: [0, 25, '#ff0000', 50, 100]
  }
}

const adjusted2 = quickAdjust(scheme2)
const result2 = umbraGenerate(scheme2, adjusted2)
console.log('From #000000 -> #ff0000 -> #ffffff:')
result2[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}°`)
})
console.log('Expected: First 2 should be black->red, then red stop, then red->white')

// Test 3: Multiple color stops
console.log('\n--- Test 3: Multiple Color Stops ---')
const scheme3: UmbraScheme = {
  background: '#1a1a1a',
  foreground: '#f0f0f0',
  accents: [],
  settings: {
    shades: [
      0,           // Start: #1a1a1a (dark gray)
      20,          // 20% towards blue
      '#0066ff',   // STOP: Blue
      30,          // 30% from blue towards green
      '#00ff66',   // STOP: Green
      50,          // 50% from green towards end
      100          // End: #f0f0f0 (light gray)
    ]
  }
}

const adjusted3 = quickAdjust(scheme3)
const result3 = umbraGenerate(scheme3, adjusted3)
console.log('Path: dark gray -> blue -> green -> light gray:')
result3[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}%`)
})

// Test 4: Color stops with relative values
console.log('\n--- Test 4: Color Stops with Relative Values ---')
const scheme4: UmbraScheme = {
  background: '#000000',
  foreground: '#ffffff',
  accents: [],
  settings: {
    shades: [
      0,           // Start: black
      '+=15',      // 15% towards red
      '+=15',      // 30% towards red
      '#ff0000',   // STOP: Red
      '+=20',      // 20% from red towards white
      '+=20',      // 40% from red towards white
      100          // End: white
    ]
  }
}

const adjusted4 = quickAdjust(scheme4)
const result4 = umbraGenerate(scheme4, adjusted4)
console.log('Path with relative: black ->(+=15,+=15)-> red ->(+=20,+=20)-> white:')
result4[0].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° l:${hsl.l.toFixed(0)}%`)
})

// Test 5: Accent with color stop
console.log('\n--- Test 5: Accent with Color Stop ---')
const scheme5: UmbraScheme = {
  background: '#0f172a',
  foreground: '#e2e8f0',
  accents: [{
    color: '#3b82f6',
    shades: [
      0,           // Start at background
      25,          // 25% towards yellow stop
      '#fbbf24',   // STOP: Yellow
      50,          // 50% from yellow towards accent color
      100          // End at accent color (#3b82f6)
    ]
  }],
  settings: {}
}

const adjusted5 = quickAdjust(scheme5)
const result5 = umbraGenerate(scheme5, adjusted5)
console.log('Accent path: dark blue -> yellow -> blue:')
result5[1].range.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}°`)
})

console.log('\n========================================')
console.log('  All color stop tests completed!')
console.log('========================================\n')
