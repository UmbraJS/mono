import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import {
  tomato, crimson, pink, plum, purple, violet, iris, indigo,
  cyan, teal, jade, grass, bronze, gold, brown, orange,
  amber, yellow, lime, mint, sky,
} from '@radix-ui/colors'

const radixColors = { tomato, crimson, pink, plum, purple, violet, iris, indigo, cyan, teal, jade, grass, bronze, gold, brown, orange, amber, yellow, lime, mint, sky }

const colorName = process.argv[2] || 'tomato'
const radixColor = radixColors[colorName as keyof typeof radixColors]

if (!radixColor) {
  console.error(`Error: Unknown color "${colorName}"`)
  process.exit(1)
}

const radixValues = Object.values(radixColor)
const primaryColor = radixValues[8]

// Start with a working map from command line args or default
let currentTints = [
  { mix: 2, hue: "next" },
  { mix: 2, hue: "next", saturation: "+=99" },
  9, 10, 17, 19, 35, 65,
  "primary",
  { mix: "+=5", hue: 0, saturation: "-=4" },
  { mix: "+=6", hue: 0, saturation: "-=12" },
  { mix: "+=35", hue: 0, saturation: "-=29" }
]

// Try to auto-tune by iteratively adjusting values
function autoTune(): Accent {
  const map: Accent = {
    name: colorName,
    color: primaryColor,
    tints: [...currentTints]
  }

  const theme = umbra({
    background: '#ffffff',
    foreground: '#000000',
    accents: [map]
  })

  const generated = theme.output[1].range

  // Indices 2-7 are the numeric values we can tune
  const tunableIndices = [2, 3, 4, 5, 6, 7]

  for (const i of tunableIndices) {
    const radixL = swatch(radixValues[i]).toHsl().l
    const generatedL = generated[i].toHsl().l
    const diff = radixL - generatedL // Positive = need to increase

    if (Math.abs(diff) > 0.1) {
      const currentValue = map.tints[i] as number
      // Rough heuristic: 1% lightness ≈ 0.2-0.3 mix points, but varies by position
      const adjustment = Math.round(diff * 0.5)
      const newValue = Math.max(0, Math.min(100, currentValue + adjustment))
      map.tints[i] = newValue

      console.log(`Index ${i}: ${radixL.toFixed(2)}% target, ${generatedL.toFixed(2)}% current, diff ${diff.toFixed(2)}% → adjusting ${currentValue} to ${newValue}`)
    }
  }

  return map
}

// Run multiple tuning iterations
console.log(`\nAuto-tuning ${colorName}...\n`)
let bestMap: Accent = { name: colorName, color: primaryColor, tints: currentTints }

for (let iteration = 0; iteration < 5; iteration++) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Iteration ${iteration + 1}`)
  console.log('='.repeat(60))

  bestMap = autoTune()
  currentTints = [...bestMap.tints]

  // Test current map
  const theme = umbra({
    background: '#ffffff',
    foreground: '#000000',
    accents: [bestMap]
  })

  const generated = theme.output[1].range
  let totalError = 0
  let maxError = 0

  for (let i = 0; i < 12; i++) {
    const radixL = swatch(radixValues[i]).toHsl().l
    const generatedL = generated[i].toHsl().l
    const diff = Math.abs(radixL - generatedL)
    totalError += diff
    if (diff > maxError) maxError = diff
  }

  const avgError = totalError / 12
  console.log(`\nAverage error: ${avgError.toFixed(3)}%`)
  console.log(`Maximum error: ${maxError.toFixed(3)}%`)

  if (avgError < 0.1) {
    console.log('🎯 Excellent! Target achieved.')
    break
  }
}

// Final output
console.log(`\n${'█'.repeat(60)}`)
console.log(`FINAL TUNED MAP FOR ${colorName.toUpperCase()}`)
console.log('█'.repeat(60))

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [bestMap]
})

const generated = theme.output[1].range

console.log('\nIndex | Radix L% | Generated L% | Diff     | Status')
console.log('-'.repeat(60))

let totalError = 0
for (let i = 0; i < 12; i++) {
  const radixL = swatch(radixValues[i]).toHsl().l
  const generatedL = generated[i].toHsl().l
  const diff = Math.abs(radixL - generatedL)
  totalError += diff

  const status = diff < 0.1 ? '🎯' : diff < 0.5 ? '✅' : diff < 1.0 ? '⚠️' : '❌'

  console.log(
    `  ${i.toString().padStart(2)}  | ` +
    `${radixL.toFixed(2).padStart(6)}%  | ` +
    `${generatedL.toFixed(2).padStart(6)}%       | ` +
    `${diff.toFixed(2).padStart(5)}% | ${status}`
  )
}

console.log('-'.repeat(60))
console.log(`Average error: ${(totalError / 12).toFixed(3)}%\n`)

console.log('='.repeat(60))
console.log('COPY THIS CODE:')
console.log('='.repeat(60))
console.log(`const radix${colorName.charAt(0).toUpperCase() + colorName.slice(1)}Map: Accent = {`)
console.log(`  name: '${colorName}',`)
console.log(`  color: '${primaryColor}',`)
console.log(`  tints: [`)
const tints = bestMap.tints as any[]
for (let i = 0; i < tints.length; i++) {
  const val = tints[i]
  const isLast = i === tints.length - 1
  const valStr = typeof val === 'number' ? val : val === 'primary' ? '"primary"' : JSON.stringify(val)
  console.log(`    ${valStr}${isLast ? '' : ','}`)
}
console.log(`  ],`)
console.log(`}\n`)
