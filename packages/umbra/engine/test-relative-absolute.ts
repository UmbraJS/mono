/**
 * Test file to demonstrate relative vs absolute value interpolation
 */

import { swatch } from '../swatch'
import { colorMixHSL } from './primitives/color'

const from = swatch('#1a1a1a') // Dark gray
const to = swatch('#3b82f6')   // Blue

console.log('\n=== Absolute vs Relative Mixing ===')
console.log('From:', from.toHex(), from.toHsl())
console.log('To:  ', to.toHex(), to.toHsl())

// Example 1: Absolute values (like keyframes)
console.log('\n--- Example 1: Absolute Values [10, 20, 30, 40, 50] ---')
const absoluteScale = [10, 20, 30, 40, 50]
absoluteScale.forEach((mix) => {
  const color = colorMixHSL(from, to, mix)
  const hsl = color.toHsl()
  console.log(`  ${mix}%: ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Example 2: Relative values (incremental)
console.log('\n--- Example 2: Relative Values [20, "+=20", "+=20", "+=20", "+=20"] ---')
console.log('Each step adds 20% more from the current position')

// Simulate what the generator would do
let currentPos = 0
const relativePositions = [20, '+=20', '+=20', '+=20', '+=20']
relativePositions.forEach((val) => {
  if (typeof val === 'number') {
    currentPos = val
  } else {
    const match = val.match(/^([+-])=(\d+(?:\.\d+)?)$/)
    if (match) {
      const [, operator, amount] = match
      const delta = parseFloat(amount)
      currentPos = operator === '+' ? currentPos + delta : currentPos - delta
    }
  }

  const color = colorMixHSL(from, to, currentPos)
  const hsl = color.toHsl()
  console.log(`  ${val} (pos=${currentPos}%): ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Example 3: Mixed absolute and relative
console.log('\n--- Example 3: Mixed [10, "+=15", "+=15", 70, "+=10"] ---')
console.log('Demonstrates jumping to absolute positions and relative adjustments')

currentPos = 0
const mixedPositions = [10, '+=15', '+=15', 70, '+=10']
mixedPositions.forEach((val) => {
  if (typeof val === 'number') {
    currentPos = val
  } else {
    const match = val.match(/^([+-])=(\d+(?:\.\d+)?)$/)
    if (match) {
      const [, operator, amount] = match
      const delta = parseFloat(amount)
      currentPos = operator === '+' ? currentPos + delta : currentPos - delta
    }
  }

  const color = colorMixHSL(from, to, currentPos)
  const hsl = color.toHsl()
  console.log(`  ${val} (pos=${currentPos}%): ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Example 4: Negative relative (going backwards)
console.log('\n--- Example 4: With Subtraction [40, "+=30", "-=20", "+=40"] ---')
console.log('Demonstrates going backwards with -= operator')

currentPos = 0
const backwardPositions = [40, '+=30', '-=20', '+=40']
backwardPositions.forEach((val) => {
  if (typeof val === 'number') {
    currentPos = val
  } else {
    const match = val.match(/^([+-])=(\d+(?:\.\d+)?)$/)
    if (match) {
      const [, operator, amount] = match
      const delta = parseFloat(amount)
      currentPos = operator === '+' ? currentPos + delta : currentPos - delta
    }
  }

  const color = colorMixHSL(from, to, currentPos)
  const hsl = color.toHsl()
  console.log(`  ${val} (pos=${currentPos}%): ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Example 5: Uniform spacing with relative
console.log('\n--- Example 5: Uniform Spacing [40, 40, 40, 40, 40] with += ---')
console.log('To create evenly spaced shades, you would write: [10, "+=10", "+=10", "+=10", "+=10"]')

currentPos = 0
const uniformSpacing = [10, '+=10', '+=10', '+=10', '+=10', '+=10']
uniformSpacing.forEach((val) => {
  if (typeof val === 'number') {
    currentPos = val
  } else {
    const match = val.match(/^([+-])=(\d+(?:\.\d+)?)$/)
    if (match) {
      const [, operator, amount] = match
      const delta = parseFloat(amount)
      currentPos = operator === '+' ? currentPos + delta : currentPos - delta
    }
  }

  const color = colorMixHSL(from, to, currentPos)
  const hsl = color.toHsl()
  console.log(`  ${val} (pos=${currentPos}%): ${color.toHex()} - h:${hsl.h.toFixed(0)}° s:${hsl.s.toFixed(0)}% l:${hsl.l.toFixed(0)}%`)
})

// Example 6: Channel-specific relative values
console.log('\n--- Example 6: Channel-Specific Relative Values ---')
console.log('Independent relative control per HSL channel')

// This would be used in the object syntax
console.log('Demo: { mix: 30, saturation: "+=20" }')
console.log('  mix at 30%, saturation gets extra 20% boost')
console.log('\nDemo: { mix: "+=20", saturation: "+=20" }')
console.log('  Both mix and saturation increment by 20%')
console.log('\nDemo: { mix: "+=20", hue: 70, saturation: "+=15" }')
console.log('  mix relative, hue absolute at 70%, saturation relative +15%')
