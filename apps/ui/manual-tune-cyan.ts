import { umbra, swatch } from '@umbrajs/core'
import type { Accent } from '@umbrajs/core'
import { cyan } from "@radix-ui/colors"

const radixValues = Object.values(cyan)

const radixCyanMap: Accent = {
  name: 'cyan',
  color: '#00a2c7',
  tints: [
    { mix: 2, hue: "next" },
    { mix: 2, hue: "next", saturation: "+=99" },
    6,
    10,
    27,
    11,
    42,
    75,
    "primary",
    { mix: "+=6", hue: 0, saturation: "-=4" },
    { mix: "+=5", hue: 0, saturation: "-=12" },
    { mix: "+=40", hue: 0, saturation: "-=29" }
  ],
}

const theme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [radixCyanMap]
})

const generated = theme.output[1].range
const target = radixValues

console.log("\n=== Cyan Color Comparison ===\n")
console.log("  #   | Radix L | Generated L  | Diff")
console.log("--------------------------------------------------")

let totalError = 0

for (let i = 0; i < 12; i++) {
  const radixL = swatch(target[i]).toHsl().l
  const generatedL = generated[i].toHsl().l
  const diff = Math.abs(radixL - generatedL)
  totalError += diff

  const status = diff < 0.01 ? '🎯' : '❌'

  console.log(
    `  ${i.toString().padStart(2)}  | ` +
    `${radixL.toFixed(2).padStart(6)}%  | ` +
    `${generatedL.toFixed(2).padStart(6)}%       | ` +
    `${diff.toFixed(2).padStart(5)}% ${status}`
  )
}

console.log("--------------------------------------------------")
console.log(`Average error: ${(totalError / 12).toFixed(3)}%`)
