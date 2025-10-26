import { umbraGenerate } from './generator'
import { swatch } from '../swatch'
import type { UmbraScheme, UmbraAdjusted } from './types'

// Radix gray lightness values
const radixLightness = [99, 98, 94, 91, 88, 85, 81, 73, 55, 51, 39, 13]

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

function testConfig(config: number[], label: string) {
  const scheme: UmbraScheme = {
    background: '#ffffff',
    foreground: '#000000',
    accents: [],
    settings: { tints: config }
  }
  const result = umbraGenerate(scheme, createAdjusted(scheme))[0].range

  let totalDiff = 0
  const diffs: number[] = []

  result.forEach((color, i) => {
    const generated = color.toHsl().l
    const radix = radixLightness[i]
    const diff = Math.abs(generated - radix)
    totalDiff += diff
    diffs.push(diff)
  })

  const avgDiff = totalDiff / 12
  console.log(`${label}: ${avgDiff.toFixed(2)}%`)
  console.log(`  Config: [${config.join(', ')}]`)
  console.log(`  Diffs: [${diffs.map(d => d.toFixed(1)).join(', ')}]`)

  return avgDiff
}

console.log('=== Optimizing for Radix Gray ===\n')

// The pattern I see: very slow progression at start, then accelerates dramatically
// Let's try to match this curve more precisely

const tests = [
  { config: [0.3, 1, 2.5, 5, 9, 14, 21, 30, 42, 58, 73, 88], label: 'Previous best' },
  { config: [0.3, 1, 3, 5.5, 9, 14, 20, 28, 44, 58, 70, 87], label: 'Optimized 1' },
  { config: [0.3, 1, 3.5, 6, 10, 15, 20, 28, 45, 58, 68, 87], label: 'Optimized 2' },
  { config: [0.3, 1, 3.5, 6.5, 10.5, 15.5, 20, 27, 45, 57, 66, 87], label: 'Optimized 3' },
  { config: [0.3, 1, 3.5, 6.5, 11, 16, 20, 27, 45, 56, 64, 87], label: 'Optimized 4' },
]

let bestAvg = Infinity
let bestConfig: number[] = []
let bestLabel = ''

tests.forEach(({ config, label }) => {
  const avg = testConfig(config, label)
  if (avg < bestAvg) {
    bestAvg = avg
    bestConfig = config
    bestLabel = label
  }
  console.log()
})

console.log('=== Best Result ===')
console.log(`${bestLabel}: ${bestAvg.toFixed(2)}% average difference`)
console.log(`Config: [${bestConfig.join(', ')}]`)
