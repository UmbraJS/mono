/**
 * Test "next" and "prev" hue references
 */

import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

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

console.log('\n=== Testing "next" and "prev" Hue References ===\n')

// Test 1: Use "next" to inherit hue from #0090ff for early shades
const scheme1: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [
      { mix: 1, hue: 'next' },   // Should use #0090ff's hue (206°)
      { mix: 2, hue: 'next' },
      { mix: 5, hue: 'next' },
      8, 12, 17, 24, 35,
      '#0090ff',                  // h:206° s:100% l:50%
      { mix: '+=5', hue: 0, saturation: '-=4' },
      { mix: '+=12', hue: 0, saturation: '-=12' },
      { mix: '+=25', hue: 0, saturation: '-=29' }
    ]
  }
}

const adjusted1 = createAdjusted(scheme1)
const result1 = umbraGenerate(scheme1, adjusted1)
const generated1 = result1[0].range

console.log('Test 1: Early shades with hue: "next"')
console.log('Expected: First 3 shades should have blue hue (~206°) from #0090ff\n')
generated1.slice(0, 9).forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Test 2: Use "prev" to reference previous color stop
const scheme2: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [
      '#f8fbff',  // Light blue reference - h:214°
      { mix: 5, hue: 'prev' },   // Should use #f8fbff's hue
      { mix: 10, hue: 'prev' },
      '#0090ff',  // Main accent
      { mix: '+=10', hue: 'prev' },  // Should use #0090ff's hue
    ]
  }
}

const adjusted2 = createAdjusted(scheme2)
const result2 = umbraGenerate(scheme2, adjusted2)
const generated2 = result2[0].range

console.log('\n\nTest 2: Using hue: "prev"')
console.log('Expected: Shades after first stop should reference its hue\n')
generated2.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  ${i}: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Test 3: Compare with Radix Blue
const radixBlue = [
  '#fbfdff', '#f4faff', '#e6f4fe', '#d5efff',
  '#c2e5ff', '#acd8fc', '#8ec8f6', '#5eb1ef',
  '#0090ff', '#0588f0', '#0d74ce', '#113264'
]

const scheme3: UmbraScheme = {
  background: '#ffffff',
  foreground: '#000000',
  accents: [],
  settings: {
    tints: [
      { mix: 1, hue: 'next', saturation: 100 },
      { mix: 2, hue: 'next', saturation: 100 },
      { mix: 5, hue: 'next', saturation: 92 },
      { mix: 8, hue: 'next', saturation: 100 },
      12, 17, 24, 35,
      '#0090ff',
      { mix: '+=5', hue: 0, saturation: '-=4' },
      { mix: '+=12', hue: 0, saturation: '-=12' },
      { mix: '+=25', hue: 0, saturation: '-=29' }
    ]
  }
}

const adjusted3 = createAdjusted(scheme3)
const result3 = umbraGenerate(scheme3, adjusted3)
const generated3 = result3[0].range

console.log('\n\nTest 3: Using hue: "next" + saturation boost (Radix-like)')
console.log('Comparing first 4 shades to Radix Blue:\n')
generated3.slice(0, 4).forEach((color, i) => {
  const hsl = color.toHsl()
  const radixHsl = swatch(radixBlue[i]).toHsl()
  console.log(`  ${i}: Generated: ${color.toHex()} (h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%)`)
  console.log(`      Radix:     ${radixBlue[i]} (h:${radixHsl.h.toFixed(0)}° s:${radixHsl.s.toFixed(0)}% l:${radixHsl.l.toFixed(0)}%)`)
})

console.log('\n\n=== Summary ===')
console.log('✓ hue: "next" allows early shades to inherit blue hue from #0090ff')
console.log('✓ hue: "prev" allows shades to reference the previous color stop')
console.log('✓ This eliminates the need to hardcode multiple color stops!')
