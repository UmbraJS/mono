/**
 * Test file to demonstrate independent HSL channel interpolation
 */

import { swatch } from '../swatch'
import { colorMixHSL } from './primitives/color'

// Example 1: Basic usage
console.log('\n=== Example 1: Basic HSL Mixing ===')
const from1 = swatch('#000000') // Black
const to1 = swatch('#0066ff')   // Blue

// Standard 50% mix
const standard = colorMixHSL(from1, to1, 50)
console.log('Standard 50% mix:', standard.toHex())
console.log('  HSL:', standard.toHsl())

// HSL mix with boosted saturation
const boostedSat = colorMixHSL(from1, to1, {
  mix: 50,
  saturation: 80  // Saturation at 80% towards target
})
console.log('\n50% mix with saturation at 80%:', boostedSat.toHex())
console.log('  HSL:', boostedSat.toHsl())

// Example 2: Creating early color hints
console.log('\n\n=== Example 2: Early Color Hints ===')
const from2 = swatch('#1a1a1a') // Dark gray
const to2 = swatch('#ff6b6b')   // Red

const earlyHints = [
  colorMixHSL(from2, to2, 0),
  colorMixHSL(from2, to2, { mix: 10, saturation: 30 }),  // Quick saturation
  colorMixHSL(from2, to2, { mix: 20, saturation: 50 }),
  colorMixHSL(from2, to2, { mix: 30, saturation: 65 }),
  colorMixHSL(from2, to2, 50),
  colorMixHSL(from2, to2, 100),
]

console.log('Scale with early saturation ramp:')
earlyHints.forEach((color, i) => {
  const hsl = color.toHsl()
  console.log(`  Step ${i}: ${color.toHex()} - s:${hsl.s.toFixed(1)}% l:${hsl.l.toFixed(1)}%`)
})

// Example 3: Independent control of all channels
console.log('\n\n=== Example 3: All Channels Independent ===')
const from3 = swatch('#2d3748') // Dark blue-gray
const to3 = swatch('#48bb78')   // Green

const independent = colorMixHSL(from3, to3, {
  mix: 50,        // Base
  hue: 30,        // Hue shifts slowly
  saturation: 70, // Saturation shifts faster
  lightness: 50   // Lightness steady
})

const from3Hsl = from3.toHsl()
const to3Hsl = to3.toHsl()
const indHsl = independent.toHsl()

console.log('From:', from3.toHex(), `h:${from3Hsl.h.toFixed(1)}° s:${from3Hsl.s.toFixed(1)}% l:${from3Hsl.l.toFixed(1)}%`)
console.log('To:  ', to3.toHex(), `h:${to3Hsl.h.toFixed(1)}° s:${to3Hsl.s.toFixed(1)}% l:${to3Hsl.l.toFixed(1)}%`)
console.log('Mix: ', independent.toHex(), `h:${indHsl.h.toFixed(1)}° s:${indHsl.s.toFixed(1)}% l:${indHsl.l.toFixed(1)}%`)
console.log('\nChannel progression:')
console.log(`  Hue:        30% (${from3Hsl.h.toFixed(1)}° -> ${indHsl.h.toFixed(1)}° -> ${to3Hsl.h.toFixed(1)}°)`)
console.log(`  Saturation: 70% (${from3Hsl.s.toFixed(1)}% -> ${indHsl.s.toFixed(1)}% -> ${to3Hsl.s.toFixed(1)}%)`)
console.log(`  Lightness:  50% (${from3Hsl.l.toFixed(1)}% -> ${indHsl.l.toFixed(1)}% -> ${to3Hsl.l.toFixed(1)}%)`)

// Example 4: Comparing approaches
console.log('\n\n=== Example 4: Standard vs HSL Mixing ===')
const from4 = swatch('#f0f0f0') // Light gray
const to4 = swatch('#3b82f6')   // Blue

const standardMix = colorMixHSL(from4, to4, 40)
const customMix = colorMixHSL(from4, to4, { mix: 40, saturation: 70 })

console.log('Standard 40% mix:', standardMix.toHex())
console.log('  HSL:', standardMix.toHsl())
console.log('\nCustom (40% mix, 70% saturation):', customMix.toHex())
console.log('  HSL:', customMix.toHsl())
console.log('\nDifference: More saturated color at same overall mix percentage')
