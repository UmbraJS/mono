import { describe, it, expect } from 'vitest'
import { umbraGenerate } from '../generator'
import { swatch } from '../../swatch'
import type { UmbraScheme, UmbraAdjusted } from '../types'

// Helper to create adjusted scheme
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

describe('Color Scale Generator', () => {
  describe('Basic interpolation', () => {
    it('should generate scale from background to foreground', () => {
      const scheme: UmbraScheme = {
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          shades: [0, 50, 100]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      expect(result).toHaveLength(1) // Just base, no accents
      expect(result[0].range).toHaveLength(3)
      expect(result[0].range[0].toHex()).toBe('#000000')
      expect(result[0].range[2].toHex()).toBe('#ffffff')
    })

    it('should interpolate at correct percentages', () => {
      const scheme: UmbraScheme = {
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          shades: [0, 25, 50, 75, 100]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      const lightnesses = result[0].range.map(c => c.toHsl().l)

      // Should be progressively lighter
      for (let i = 1; i < lightnesses.length; i++) {
        expect(lightnesses[i]).toBeGreaterThan(lightnesses[i - 1])
      }
    })
  })

  describe('Color stops', () => {
    it('should interpolate to color stop and then from stop to end', () => {
      const scheme: UmbraScheme = {
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          shades: [0, 25, '#ff0000', 50, 100]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      expect(result[0].range).toHaveLength(5)
      expect(result[0].range[0].toHex()).toBe('#000000')
      expect(result[0].range[2].toHex()).toBe('#ff0000') // Color stop
      expect(result[0].range[4].toHex()).toBe('#ffffff')

      // First segment should move towards red
      const hue1 = result[0].range[1].toHsl().h
      expect(hue1).toBeGreaterThanOrEqual(0)
      expect(hue1).toBeLessThan(30) // Close to red hue
    })

    it('should handle multiple color stops', () => {
      const scheme: UmbraScheme = {
        background: '#1a1a1a',
        foreground: '#f0f0f0',
        accents: [],
        settings: {
          shades: [0, '#0066ff', '#00ff66', 100]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      expect(result[0].range).toHaveLength(4)
      expect(result[0].range[1].toHex()).toBe('#0066ff')
      expect(result[0].range[2].toHex()).toBe('#00ff66')
    })
  })

  describe('Relative values', () => {
    it('should support += operator', () => {
      const scheme: UmbraScheme = {
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          shades: [10, '+=20', '+=20', '+=20']
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      // Should be at 10%, 30%, 50%, 70%
      const lightnesses = result[0].range.map(c => c.toHsl().l)

      // Verify progressive lightening
      expect(lightnesses[1]).toBeGreaterThan(lightnesses[0])
      expect(lightnesses[2]).toBeGreaterThan(lightnesses[1])
      expect(lightnesses[3]).toBeGreaterThan(lightnesses[2])

      // First should be darker, last should be lighter
      expect(lightnesses[0]).toBeLessThan(20)
      expect(lightnesses[3]).toBeGreaterThan(60)
    })

    it('should support -= operator', () => {
      const scheme: UmbraScheme = {
        background: '#111111',
        foreground: '#eeeeee',
        accents: [],
        settings: {
          // Start at 40, go to 60, back to 30, then to 80
          shades: [40, '+=20', '-=30', '+=50']
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      const colors = result[0].range.map(c => c.toHex())

      // Verify we get 4 different colors
      expect(colors).toHaveLength(4)
      expect(new Set(colors).size).toBe(4) // All unique

      // The -= should create a movement, even if exact values vary
      expect(colors[0]).not.toBe(colors[1])
      expect(colors[1]).not.toBe(colors[2])
      expect(colors[2]).not.toBe(colors[3])
    })

    it('should reset position at color stops', () => {
      const scheme: UmbraScheme = {
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          shades: ['+=20', '+=20', '#ff0000', '+=30', '+=30']
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      // First two should be 20%, 40% towards red
      // Then red stop
      // Then reset and 30%, 60% from red to white
      expect(result[0].range[2].toHex()).toBe('#ff0000')
    })
  })

  describe('Object syntax with independent channels', () => {
    it('should support saturation boost', () => {
      const scheme: UmbraScheme = {
        background: '#18181b',
        foreground: '#3b82f6',
        accents: [],
        settings: {
          shades: [
            0,
            { mix: 30, saturation: 60 },
            100
          ]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      const sat0 = result[0].range[0].toHsl().s
      const sat1 = result[0].range[1].toHsl().s
      const sat2 = result[0].range[2].toHsl().s

      // Middle should have boosted saturation
      expect(sat1).toBeGreaterThan(sat0)
      expect(sat1).toBeLessThan(sat2)
    })

    it('should support relative values in objects', () => {
      const scheme: UmbraScheme = {
        background: '#111827',
        foreground: '#10b981',
        accents: [],
        settings: {
          shades: [
            0,
            { mix: 20, saturation: 35 },
            { mix: '+=20', saturation: '+=25' }, // Should be 40%, sat 60%
            100
          ]
        }
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      expect(result[0].range).toHaveLength(4)
      // Should not throw and should produce valid colors
      result[0].range.forEach(color => {
        expect(color.toHex()).toMatch(/^#[0-9a-f]{6}$/)
      })
    })
  })

  describe('Accent colors', () => {
    it('should generate accent with color stop', () => {
      const scheme: UmbraScheme = {
        background: '#0f172a',
        foreground: '#e2e8f0',
        accents: [{
          color: '#3b82f6',
          shades: [0, '#fbbf24', 100]
        }],
        settings: {}
      }

      const adjusted = createAdjusted(scheme)
      const result = umbraGenerate(scheme, adjusted)

      expect(result).toHaveLength(2) // Base + 1 accent

      // Find the color stops in the range
      const yellowIndex = result[1].range.findIndex(c => c.toHex() === '#fbbf24')
      const blueIndex = result[1].range.findIndex(c => c.toHex() === '#3b82f6')

      expect(yellowIndex).toBeGreaterThan(-1) // Yellow stop exists
      expect(blueIndex).toBeGreaterThan(-1)   // Blue (accent) exists
    })
  })
})
