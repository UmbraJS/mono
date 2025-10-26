import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import {
  tomato,
  crimson,
  pink,
  plum,
  purple,
  violet,
  iris,
  indigo,
  cyan,
  teal,
  jade,
  grass,
  bronze,
  gold,
  brown,
  orange,
  amber,
  yellow,
  lime,
  mint,
  sky,
} from '@radix-ui/colors'

// Map of all Radix colors to work through
const radixColors = {
  tomato,
  crimson,
  pink,
  plum,
  purple,
  violet,
  iris,
  indigo,
  cyan,
  teal,
  jade,
  grass,
  bronze,
  gold,
  brown,
  orange,
  amber,
  yellow,
  lime,
  mint,
  sky,
}

// Get color name from command line args, default to 'tomato'
const colorName = process.argv[2] || 'tomato'
const radixColor = radixColors[colorName as keyof typeof radixColors]

if (!radixColor) {
  console.error(`Error: Unknown color "${colorName}"`)
  console.log('\nAvailable colors:')
  Object.keys(radixColors).forEach(name => console.log(`  - ${name}`))
  process.exit(1)
}

const radixValues = Object.values(radixColor)
const primaryColor = radixValues[8] // Index 8 is the primary color

console.log(`\n${'█'.repeat(60)}`)
console.log(`TUNING ${colorName.toUpperCase()}`)
console.log(`${'█'.repeat(60)}`)
console.log(`Primary color (index 8): ${primaryColor}`)
console.log('')

// Template for starting - using blue as a base
const workingMap: Accent = {
  name: colorName,
  color: primaryColor,
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    9,
    10,
    17,
    19,
    35,
    65,
    "primary",
    { mix: "+=5", hue: 0, saturation: "-=4" },
    { mix: "+=6", hue: 0, saturation: "-=12" },
    { mix: "+=35", hue: 0, saturation: "-=29" }
  ],
}

function testMap(map: Accent) {
  const theme = umbra({
    background: '#ffffff',
    foreground: '#000000',
    accents: [map]
  })

  const generated = theme.output[1].range

  let totalError = 0
  let maxError = 0
  let needsWork: number[] = []

  console.log('Index | Radix L% | Generated L% | Diff     | Status')
  console.log('-'.repeat(60))

  for (let i = 0; i < 12; i++) {
    const radixL = swatch(radixValues[i]).toHsl().l
    const generatedL = generated[i].toHsl().l
    const diff = Math.abs(radixL - generatedL)

    totalError += diff
    if (diff > maxError) {
      maxError = diff
    }

    let status = ''
    if (diff < 0.1) {
      status = '🎯 Perfect'
    } else if (diff < 0.5) {
      status = '✅ Good'
    } else if (diff < 1.0) {
      status = '⚠️  Tune'
      needsWork.push(i)
    } else {
      status = '❌ Fix'
      needsWork.push(i)
    }

    console.log(
      `  ${i.toString().padStart(2)}  | ` +
      `${radixL.toFixed(2).padStart(6)}%  | ` +
      `${generatedL.toFixed(2).padStart(6)}%       | ` +
      `${diff.toFixed(2).padStart(5)}% | ${status}`
    )
  }

  const avgError = totalError / 12
  console.log('-'.repeat(60))
  console.log(`Average error: ${avgError.toFixed(3)}%`)
  console.log(`Maximum error: ${maxError.toFixed(3)}%`)
  console.log(`Status: ${avgError < 0.1 ? '🎯 EXCELLENT' : avgError < 0.5 ? '✅ GOOD' : avgError < 1.0 ? '⚠️  NEEDS WORK' : '❌ POOR'}`)

  if (needsWork.length > 0) {
    console.log(`\nIndices to adjust: [${needsWork.join(', ')}]`)
    console.log('\nTuning tips:')
    console.log('  - Start from index 0 and work your way to 11')
    console.log('  - Adjust one value at a time')
    console.log('  - If generated L% is too high, decrease the mix value')
    console.log('  - If generated L% is too low, increase the mix value')
    console.log('  - Typical adjustments are ±1 to ±3')
  }

  console.log('\n' + '='.repeat(60))
  console.log('COPY THIS MAP WHEN DONE:')
  console.log('='.repeat(60))
  console.log(`const radix${colorName.charAt(0).toUpperCase() + colorName.slice(1)}Map: Accent = {`)
  console.log(`  name: '${colorName}',`)
  console.log(`  color: '${primaryColor}',`)
  console.log(`  tints: [`)
  console.log(`    { mix: 2, hue: "next" },`)
  console.log(`    { mix: 2, hue: "next", saturation: "+=99" },`)
  const tints = map.tints as any[]
  for (let i = 2; i < 9; i++) {
    const val = tints[i]
    console.log(`    ${typeof val === 'number' ? val : JSON.stringify(val)},`)
  }
  console.log(`    "primary",`)
  for (let i = 9; i < tints.length; i++) {
    const val = tints[i]
    const isLast = i === tints.length - 1
    console.log(`    ${typeof val === 'number' ? val : JSON.stringify(val)}${isLast ? '' : ','}`)
  }
  console.log(`  ],`)
  console.log(`}`)
  console.log('')
}

testMap(workingMap)
