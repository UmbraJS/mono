import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import { crimson } from '@radix-ui/colors'

const radixValues = Object.values(crimson)

// Starting with the base template (similar to red/tomato)
const testMap: Accent = {
  name: 'crimson',
  color: '#e93d82',
  tints: [
    { mix: 2, hue: "next" as const },
    { mix: 2, hue: "next" as const, saturation: "+=99" as const },
    6,  // Index 2
    10, // Index 3
    13, // Index 4 - target 89%, trying 13
    14, // Index 5 - target 85%, trying 14
    25, // Index 6 - target 80%, trying 25
    36, // Index 7 - target 73%, trying 36
    "primary" as const,
    { mix: "+=6" as const, hue: 0, saturation: "-=4" as const },
    { mix: "+=0" as const, hue: 0, saturation: "-=12" as const },
    { mix: "+=45" as const, hue: 0, saturation: "-=29" as const }
  ],
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [testMap]
})

const generated = theme.output[1].range

console.log('\nCRIMSON Tuning Results:')
console.log('Primary color: #e93d82')
console.log('Index | Radix L% | Generated L% | Diff')
console.log('-'.repeat(50))

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
    `${diff.toFixed(2).padStart(5)}% ${status}`
  )
}

console.log('-'.repeat(50))
console.log(`Average error: ${(totalError / 12).toFixed(3)}%`)
