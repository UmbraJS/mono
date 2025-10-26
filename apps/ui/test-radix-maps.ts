import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import {
  gray,
  blue,
  red,
  green,
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

// Your existing maps
const radixGrayMap: Accent = {
  name: 'gray',
  tints: [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70],
}

const radixBlueMap: Accent = {
  name: 'blue',
  color: '#0090ff',
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

const radixRedMap: Accent = {
  name: 'red',
  color: '#e5484d',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    10,
    11,
    24,
    35,
    "primary",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const radixGreenMap: Accent = {
  name: 'green',
  color: '#30a46c',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 3, hue: "next", saturation: "+=99" },
    9,
    8,
    10,
    20,
    28,
    55,
    "primary",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=12", hue: 0, saturation: "-=12" },
    { mix: "+=31", hue: 0, saturation: "-=29" }
  ],
}

function testRadixMap(map: Accent, radixColors: Record<string, string>, colorName: string) {
  const radixValues = Object.values(radixColors)

  // Generate theme with this map
  const theme = umbra({
    background: '#ffffff',
    foreground: '#000000',
    accents: [map]
  })

  const generated = theme.output[1].range // [0] is base, [1] is our accent

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Testing ${colorName.toUpperCase()} Map`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Primary color: ${map.color}`)
  console.log(`Radix primary (index 8): ${radixValues[8]}`)
  console.log('')

  let totalError = 0
  let maxError = 0
  let maxErrorIndex = -1

  console.log('Index | Radix L% | Generated L% | Diff     | Radix Hex | Generated Hex')
  console.log('-'.repeat(80))

  for (let i = 0; i < 12; i++) {
    const radixColor = swatch(radixValues[i])
    const generatedColor = generated[i]

    const radixL = radixColor.toHsl().l
    const generatedL = generatedColor.toHsl().l
    const diff = Math.abs(radixL - generatedL)

    totalError += diff
    if (diff > maxError) {
      maxError = diff
      maxErrorIndex = i
    }

    const status = diff < 0.5 ? '✓' : diff < 1.0 ? '~' : '✗'
    console.log(
      `  ${i.toString().padStart(2)}  | ` +
      `${radixL.toFixed(2).padStart(6)}%  | ` +
      `${generatedL.toFixed(2).padStart(6)}%       | ` +
      `${status} ${diff.toFixed(2).padStart(5)}% | ` +
      `${radixValues[i]} | ${generatedColor.toHex()}`
    )
  }

  const avgError = totalError / 12
  console.log('-'.repeat(80))
  console.log(`Average error: ${avgError.toFixed(3)}%`)
  console.log(`Maximum error: ${maxError.toFixed(3)}% at index ${maxErrorIndex}`)
  console.log(`Status: ${avgError < 0.1 ? '🎯 EXCELLENT' : avgError < 0.5 ? '✅ GOOD' : avgError < 1.0 ? '⚠️  NEEDS WORK' : '❌ POOR'}`)

  return { avgError, maxError, maxErrorIndex }
}

// Test all existing maps
console.log('\n' + '█'.repeat(60))
console.log('RADIX COLOR MAP VALIDATION')
console.log('█'.repeat(60))

testRadixMap(radixGrayMap, gray, 'Gray')
testRadixMap(radixBlueMap, blue, 'Blue')
testRadixMap(radixRedMap, red, 'Red')
testRadixMap(radixGreenMap, green, 'Green')

console.log('\n' + '█'.repeat(60))
console.log('RADIX COLORS TO MAP (Light Theme)')
console.log('█'.repeat(60))
console.log('\nColors to analyze and create maps for:')
console.log('- Tomato (primary: ' + Object.values(tomato)[8] + ')')
console.log('- Crimson (primary: ' + Object.values(crimson)[8] + ')')
console.log('- Pink (primary: ' + Object.values(pink)[8] + ')')
console.log('- Plum (primary: ' + Object.values(plum)[8] + ')')
console.log('- Purple (primary: ' + Object.values(purple)[8] + ')')
console.log('- Violet (primary: ' + Object.values(violet)[8] + ')')
console.log('- Iris (primary: ' + Object.values(iris)[8] + ')')
console.log('- Indigo (primary: ' + Object.values(indigo)[8] + ')')
console.log('- Cyan (primary: ' + Object.values(cyan)[8] + ')')
console.log('- Teal (primary: ' + Object.values(teal)[8] + ')')
console.log('- Jade (primary: ' + Object.values(jade)[8] + ')')
console.log('- Grass (primary: ' + Object.values(grass)[8] + ')')
console.log('- Bronze (primary: ' + Object.values(bronze)[8] + ')')
console.log('- Gold (primary: ' + Object.values(gold)[8] + ')')
console.log('- Brown (primary: ' + Object.values(brown)[8] + ')')
console.log('- Orange (primary: ' + Object.values(orange)[8] + ')')
console.log('- Amber (primary: ' + Object.values(amber)[8] + ')')
console.log('- Yellow (primary: ' + Object.values(yellow)[8] + ')')
console.log('- Lime (primary: ' + Object.values(lime)[8] + ')')
console.log('- Mint (primary: ' + Object.values(mint)[8] + ')')
console.log('- Sky (primary: ' + Object.values(sky)[8] + ')')

console.log('\n')
