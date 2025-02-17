import { defineConfig } from 'unocss'
import presetMini from '@unocss/preset-mini'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import { definePreset } from '@unocss/core'
import type { PresetMiniOptions } from '@unocss/preset-mini'

function spaceUtil(key = 'm', property = 'margin') {
  const rules = []
  for (let i = 1; i <= 10; i++) {
    rules.push([`${key}-${i}`, { [property]: `var(--space-${i})` }])
  }
  return rules
}

export const presetNobel = definePreset((options: PresetMiniOptions) => {
  return {
    ...presetMini(options),
    name: '@unocss/preset-wind',
    rules: [...spaceUtil('m', 'margin'), ...spaceUtil('p', 'padding')],
    transformers: [transformerVariantGroup()],
    theme: {
      colors: {
        base: {
          0: 'var(--base, #16121f)',
          10: 'var(--base-10, #1f1b27)',
          20: 'var(--base-20, #28242f)',
          30: 'var(--base-30, #312d37)',
          40: 'var(--base-40, #39363f)',
          50: 'var(--base-50, #524f56)',
          60: 'var(--base-60,   #615e64)',
          70: 'var(--base-70, #6e6c70)',
          80: 'var(--base-80, #8d8d8d)',
          90: 'var(--base-90, #ababa8)',
          100: 'var(--base-100, #bdbdb8)',
          110: 'var(--base-110, #cacbc4)',
          120: 'rgb(255 100 0)',
          contrast: 'var(--base-contrast, #f3f6ea)',
        },
        accent: {
          0: 'var(--accent)',
          10: 'var(--accent-10)',
          20: 'var(--accent-20)',
          30: 'var(--accent-30)',
          40: 'var(--accent-40)',
          50: 'var(--accent-50)',
          60: 'var(--accent-60)',
          70: 'var(--accent-70)',
          80: 'var(--accent-80)',
          90: 'var(--accent-90)',
          100: 'var(--accent-100)',
          110: 'var(--accent-110)',
          120: 'var(--accent-120)',
          contrast: 'var(--accent-contrast)',
        },
        warning: {
          0: 'var(--warning)',
          10: 'var(--warning-10)',
          20: 'var(--warning-20)',
          30: 'var(--warning-30)',
          40: 'var(--warning-40)',
          50: 'var(--warning-50)',
          60: 'var(--warning-60)',
          70: 'var(--warning-70)',
          80: 'var(--warning-80)',
          90: 'var(--warning-90)',
          100: 'var(--warning-100)',
          110: 'var(--warning-110)',
          120: 'var(--warning-120)',
          contrast: 'var(--warning-contrast)',
        },
        success: {
          0: 'var(--success)',
          10: 'var(--success-10)',
          20: 'var(--success-20)',
          30: 'var(--success-30)',
          40: 'var(--success-40)',
          50: 'var(--success-50)',
          60: 'var(--success-60)',
          70: 'var(--success-70)',
          80: 'var(--success-80)',
          90: 'var(--success-90)',
          100: 'var(--success-100)',
          110: 'var(--success-110)',
          120: 'var(--success-120)',
          contrast: 'var(--success-contrast)',
        },
        notice: {
          0: 'var(--notice)',
          10: 'var(--notice-10)',
          20: 'var(--notice-20)',
          30: 'var(--notice-30)',
          40: 'var(--notice-40)',
          50: 'var(--notice-50)',
          60: 'var(--notice-60)',
          70: 'var(--notice-70)',
          80: 'var(--notice-80)',
          90: 'var(--notice-90)',
          100: 'var(--notice-100)',
          110: 'var(--notice-110)',
          120: 'var(--notice-120)',
          contrast: 'var(--notice-contrast)',
        },
      },
    },
  }
})

export default defineConfig({
  presets: [presetNobel],
})
