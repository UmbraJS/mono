import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import { tomato } from '@radix-ui/colors'

const radixValues = Object.values(tomato)

// Manual tuning for tomato - let's try each value carefully
const testMap: Accent = {
  name: 'tomato',
  color: '#e54d2e',
  tints: [
    { mix: 2, hue: "next" as const },
    { mix: 2, hue: "next" as const, saturation: "+=99" as const },
    4,  // Index 2: target 95%, trying 4
    10, // Index 3: target 91%, back to 10
    12.5, // Index 4: target 88%, trying 12.5
    8, // Index 5: target 84%, trying 8
    24, // Index 6: target 78%
    36, // Index 7: target 70%, trying 36
    "primary" as const,
    { mix: "+=6" as const, hue: 0, saturation: "-=4" as const },
    { mix: "+=5" as const, hue: 0, saturation: "-=12" as const },
    { mix: "+=39" as const, hue: 0, saturation: "-=29" as const }
  ],
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [testMap]
})

const generated = theme.output[1].range

console.log('\nTOMATO Tuning Results:')
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
