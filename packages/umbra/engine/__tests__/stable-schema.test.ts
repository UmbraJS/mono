import { describe, it, expect } from 'vitest'
import { umbra } from '../index'
import type { StableScheme } from '../types'

describe('Stable Schema', () => {
  describe('Serialization', () => {
    it('should generate a stable schema with only strings', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{ name: 'primary', color: 'blue' }]
      })

      const { stable } = theme.format()

      // All top-level properties should be strings or arrays
      expect(typeof stable.background).toBe('string')
      expect(typeof stable.foreground).toBe('string')
      expect(Array.isArray(stable.baseRange)).toBe(true)
      expect(Array.isArray(stable.accents)).toBe(true)

      // Base range should contain only strings
      stable.baseRange.forEach(color => {
        expect(typeof color).toBe('string')
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })

      // Accents should have proper structure
      stable.accents.forEach(accent => {
        expect(typeof accent.name).toBe('string')
        expect(typeof accent.color).toBe('string')
        expect(accent.color).toMatch(/^#[0-9a-f]{6}$/i)
        expect(Array.isArray(accent.range)).toBe(true)
        accent.range.forEach(color => {
          expect(typeof color).toBe('string')
          expect(color).toMatch(/^#[0-9a-f]{6}$/i)
        })
      })
    })

    it('should be JSON serializable', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['blue', 'red']
      })

      const { stable } = theme.format()

      // Should serialize and deserialize without errors
      const serialized = JSON.stringify(stable)
      expect(serialized).toBeTruthy()

      const deserialized = JSON.parse(serialized) as StableScheme
      expect(deserialized).toEqual(stable)
    })
  })

  describe('Round-trip consistency', () => {
    it('should produce identical colors when loaded from stable schema', () => {
      // Generate original theme
      const original = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{ name: 'primary', color: 'blue' }]
      })

      const { stable } = original.format()

      // Load from stable schema
      const restored = umbra(stable)

      // Compare output colors directly (not formatted, to avoid any formatting differences)
      const originalBase = original.output[0].range.map(c => c.swatch.toHex())
      const restoredBase = restored.output[0].range.map(c => c.swatch.toHex())

      const originalAccent = original.output[1].range.map(c => c.swatch.toHex())
      const restoredAccent = restored.output[1].range.map(c => c.swatch.toHex())

      // Base ranges should match
      expect(restoredBase).toEqual(originalBase)

      // Accent ranges should match
      expect(restoredAccent).toEqual(originalAccent)
    })

    it('should handle complex themes with multiple accents', () => {
      const original = umbra({
        background: '#1a1a1a',
        foreground: '#f0f0f0',
        accents: [
          { name: 'primary', color: 'blue' },
          { name: 'danger', color: 'red' },
          { name: 'success', color: 'green' }
        ]
      })

      const { stable } = original.format()

      // Serialize and deserialize
      const serialized = JSON.stringify(stable)
      const deserialized = JSON.parse(serialized)

      const restored = umbra(deserialized)

      // Compare all output ranges directly
      original.output.forEach((range, i) => {
        const originalColors = range.range.map(c => c.swatch.toHex())
        const restoredColors = restored.output[i].range.map(c => c.swatch.toHex())
        expect(restoredColors).toEqual(originalColors)
      })
    })

    it('should preserve custom baseRange', () => {
      const original = umbra({
        background: '#ffffff',
        foreground: '#000000',
        baseRange: ['#f5f5f5', '#e0e0e0', '#cccccc', '#999999', '#666666', '#333333'],
        accents: []
      })

      const { stable } = original.format()

      const restored = umbra(stable)

      const originalBase = original.output[0].range.map(c => c.swatch.toHex())
      const restoredBase = restored.output[0].range.map(c => c.swatch.toHex())

      expect(restoredBase).toEqual(originalBase)
    })
  })

  describe('Accent color detection', () => {
    it('should identify the most saturated color as the accent color', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{ name: 'primary', color: 'blue' }]
      })

      const { stable } = theme.format()

      // The accent color should be a saturated blue
      const accentColor = stable.accents[0].color
      expect(accentColor).toMatch(/^#[0-9a-f]{6}$/i)

      // It should be blue-ish (hue around 210-240)
      const theme2 = umbra({ background: '#fff', foreground: '#000', accents: [{ color: accentColor }] })
      const hsl = theme2.output[1].range[0].swatch.toHsl()
      expect(hsl.h).toBeGreaterThan(180)
      expect(hsl.h).toBeLessThan(260)
    })

    it('should preserve accent names', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [
          { name: 'primary', color: 'blue' },
          { name: 'danger', color: 'red' },
          { name: 'success', color: 'green' }
        ]
      })

      const { stable } = theme.format()

      expect(stable.accents).toHaveLength(3)
      expect(stable.accents[0].name).toBe('primary')
      expect(stable.accents[1].name).toBe('danger')
      expect(stable.accents[2].name).toBe('success')
    })
  })

  describe('Edge cases', () => {
    it('should handle theme with no accents', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: []
      })

      const { stable } = theme.format()

      expect(stable.accents).toHaveLength(0)
      expect(stable.baseRange.length).toBeGreaterThan(0)
    })

    it('should handle dark themes', () => {
      const theme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{ name: 'accent', color: 'blue' }]
      })

      const { stable } = theme.format()

      // Should serialize dark theme correctly
      const serialized = JSON.stringify(stable)
      const restored = umbra(JSON.parse(serialized))

      const originalColors = theme.output[0].range.map(c => c.swatch.toHex())
      const restoredColors = restored.output[0].range.map(c => c.swatch.toHex())

      expect(restoredColors).toEqual(originalColors)
    })

    it('should handle themes with string accents (no name)', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['blue', 'red']
      })

      const { stable } = theme.format()

      expect(stable.accents).toHaveLength(2)
      stable.accents.forEach(accent => {
        expect(typeof accent.name).toBe('string')
        expect(accent.name).toBeTruthy()
      })
    })
  })

  describe('Version stability', () => {
    it('should maintain exact color values across regeneration', () => {
      // Generate with dynamic config
      const dynamic = umbra({
        background: '#ffffff',
        foreground: '#000000',
        baseRange: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        accents: [{ name: 'primary', color: 'blue' }]
      })

      const { stable } = dynamic.format()

      // Store colors
      const originalColors = {
        base: dynamic.output[0].range.map(c => c.swatch.toHex()),
        accent: dynamic.output[1].range.map(c => c.swatch.toHex())
      }

      // Load from stable schema
      const fromStable = umbra(stable)

      const stableColors = {
        base: fromStable.output[0].range.map(c => c.swatch.toHex()),
        accent: fromStable.output[1].range.map(c => c.swatch.toHex())
      }

      // Colors should be identical
      expect(stableColors.base).toEqual(originalColors.base)
      expect(stableColors.accent).toEqual(originalColors.accent)

      // Generate again from stable (simulating version update scenario)
      const fromStableAgain = umbra(stable)

      const stableColors2 = {
        base: fromStableAgain.output[0].range.map(c => c.swatch.toHex()),
        accent: fromStableAgain.output[1].range.map(c => c.swatch.toHex())
      }

      // Should still be identical
      expect(stableColors2.base).toEqual(originalColors.base)
      expect(stableColors2.accent).toEqual(originalColors.accent)
    })
  })

  describe('Type safety', () => {
    it('should match StableScheme interface', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{ name: 'primary', color: 'blue' }]
      })

      const { stable } = theme.format()

      // TypeScript should accept this as StableScheme
      const typed: StableScheme = stable
      expect(typed).toBeDefined()

      // All required properties should exist
      expect(typed.background).toBeDefined()
      expect(typed.foreground).toBeDefined()
      expect(typed.baseRange).toBeDefined()
      expect(typed.accents).toBeDefined()
    })
  })
})
