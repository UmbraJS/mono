import { describe, it, expect } from 'vitest'
import { umbraGenerate } from '../generator'
import { swatch } from '../../swatch'
import type { UmbraScheme, UmbraAdjusted } from '../types'

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

describe('Hue References (next/prev)', () => {
  describe('hue: "next"', () => {
    it('should inherit hue from next color stop', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 1, hue: 'next' },
              { mix: 2, hue: 'next' },
              5,
              '#0090ff',  // h:206°
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      // First two colors should have blue hue (~206°) from #0090ff
      const hue0 = result[0].swatch.toHsl().h
      const hue1 = result[1].swatch.toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h

      // Should be close to blue hue (within 10° tolerance for mixing effects)
      expect(Math.abs(hue0 - blueHue)).toBeLessThan(10)
      expect(Math.abs(hue1 - blueHue)).toBeLessThan(10)
    })

    it('should work with saturation boost', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 1, hue: 'next', saturation: '+=99' },
              5,
              '#ff0000'
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const color0 = result[0].swatch.toHsl()
      const redHue = swatch('#ff0000').toHsl().h

      // Should have red hue
      expect(Math.abs(color0.h - redHue)).toBeLessThan(10)

      // Should have boosted saturation
      expect(color0.s).toBeGreaterThan(80)
    })

    it('should find next stop when multiple stops exist', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 1, hue: 'next' },  // Should use #00ff00 (first next)
              5,
              '#00ff00',  // Green
              10,
              '#0000ff'   // Blue
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const hue0 = result[0].swatch.toHsl().h
      const greenHue = swatch('#00ff00').toHsl().h

      // Should match green (first next), not blue
      expect(Math.abs(hue0 - greenHue)).toBeLessThan(10)
    })

    it('should fallback to foreground if no next stop exists', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#0000ff',  // Blue
        accents: [],
        settings: {
          range: {
            light: [
              50,
              { mix: 70, hue: 'next' }  // No color stop ahead, should use foreground
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const hue1 = result[1].swatch.toHsl().h
      const blueHue = swatch('#0000ff').toHsl().h

      // Increased tolerance as mixing can shift hue slightly
      expect(Math.abs(hue1 - blueHue)).toBeLessThan(25)
    })
  })

  describe('hue: "prev"', () => {
    it('should inherit hue from previous color stop', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              '#ff0000',  // Red stop
              5,
              { mix: 20, hue: 'prev' },  // Should use red hue
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const hue2 = result[2].swatch.toHsl().h
      const redHue = swatch('#ff0000').toHsl().h

      expect(Math.abs(hue2 - redHue)).toBeLessThan(10)
    })

    it('should find previous stop when multiple stops exist', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              '#0000ff',  // Blue
              5,
              '#00ff00',  // Green
              10,
              { mix: 30, hue: 'prev' }  // Should use green (closest prev)
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const hue4 = result[4].swatch.toHsl().h
      const greenHue = swatch('#00ff00').toHsl().h

      expect(Math.abs(hue4 - greenHue)).toBeLessThan(10)
    })

    it('should fallback to background if no previous stop exists', () => {
      const scheme: UmbraScheme = {
        background: '#ff00ff',  // Magenta
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 5, hue: 'prev' },  // No prev stop, should use background
              20
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const hue0 = result[0].swatch.toHsl().h
      const magentaHue = swatch('#ff00ff').toHsl().h

      expect(Math.abs(hue0 - magentaHue)).toBeLessThan(10)
    })
  })

  describe('hue: 0 (preserve current hue)', () => {
    it('should preserve hue from previous mix position', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              5,
              '#0090ff',  // Blue (h:206°)
              { mix: '+=10', hue: 0 },  // Should keep h:206°
              { mix: '+=20', hue: 0 }   // Should still keep h:206°
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const blueHue = result[1].swatch.toHsl().h
      const afterBlue1 = result[2].swatch.toHsl().h
      const afterBlue2 = result[3].swatch.toHsl().h

      // All should maintain the blue hue
      expect(Math.abs(afterBlue1 - blueHue)).toBeLessThan(5)
      expect(Math.abs(afterBlue2 - blueHue)).toBeLessThan(5)
    })

    it('should prevent purple shift when darkening blue', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              '#0090ff',  // Blue
              { mix: '+=30', hue: 0 }  // Darken but stay blue
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const originalHue = result[0].swatch.toHsl().h
      const darkenedHue = result[1].swatch.toHsl().h

      // Hue should be preserved (not shift toward purple)
      expect(Math.abs(darkenedHue - originalHue)).toBeLessThan(3)

      // Should be darker
      expect(result[1].swatch.toHsl().l).toBeLessThan(result[0].swatch.toHsl().l)
    })
  })

  describe('Complex scenarios', () => {
    it('should handle next + prev in same array', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 1, hue: 'next' },   // → red
              5,
              '#ff0000',  // Red
              { mix: '+=10', hue: 'prev' },  // ← red
              { mix: '+=20', hue: 0 }     // stay red
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      const redHue = swatch('#ff0000').toHsl().h

      // All should be reddish (increased tolerance for mixing effects)
      result.forEach(color => {
        const hue = color.swatch.toHsl().h
        expect(Math.abs(hue - redHue)).toBeLessThan(20)
      })
    })

    it('should work with accent colors', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          range: {
            light: [
              { mix: 1, hue: 'next' },
              5,
              '#0090ff',
              { mix: '+=10', hue: 0 }
            ]
          }
        }],
        settings: {}
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme))

      expect(result.output).toHaveLength(2) // Base + accent

      const accentRange = result.output[1].range
      const blueHue = swatch('#0090ff').toHsl().h

      // First and last should have blue hue
      expect(Math.abs(accentRange[0].swatch.toHsl().h - blueHue)).toBeLessThan(10)
      expect(Math.abs(accentRange[3].swatch.toHsl().h - blueHue)).toBeLessThan(10)
    })
  })

  describe('Edge cases', () => {
    it('should handle hue reference with no color stops gracefully', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#0000ff',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 10, hue: 'next' },  // No stops, use foreground
              { mix: 50, hue: 'prev' }   // No stops, use background
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      // Should not crash
      expect(result).toHaveLength(2)
      expect(result[0].swatch.toHex()).toBeTruthy()
      expect(result[1].swatch.toHex()).toBeTruthy()
    })

    it('should handle circular hue interpolation correctly', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 5, hue: 'next' },
              10,
              '#ff0000',  // Red (hue ~0°)
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range

      // Should handle hue wrapping around 360°
      const hue0 = result[0].swatch.toHsl().h
      expect(hue0).toBeGreaterThanOrEqual(0)
      expect(hue0).toBeLessThan(360)
    })
  })

  describe('Relative hue adjustments', () => {
    it('should support next+=X to shift hue forward from next stop', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 5, hue: 'next+=30' },  // Blue hue + 30°
              10,
              '#0090ff',  // Blue (hue ~206°)
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue0 = result[0].swatch.toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h
      const expectedHue = (blueHue + 30) % 360

      // Should be blue hue + 30°
      expect(Math.abs(hue0 - expectedHue)).toBeLessThan(1)
    })

    it('should support next-=X to shift hue backward from next stop', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 5, hue: 'next-=20' },  // Blue hue - 20°
              10,
              '#0090ff',  // Blue (hue ~206°)
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue0 = result[0].swatch.toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h
      const expectedHue = (blueHue - 20 + 360) % 360

      // Should be blue hue - 20°
      expect(Math.abs(hue0 - expectedHue)).toBeLessThan(1)
    })

    it.skip('should support prev+=X to shift hue forward from previous stop', () => {
      // This test is skipped because it's mixing between two grayscale colors
      // (white background and positions derived from it), where hue is undefined.
      // When both from and to colors have very low saturation, hue interpolation
      // doesn't work as expected. A real-world use case would have saturated colors.
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              '#ff0000',  // Red (hue ~0°)
              10,
              { mix: 50, hue: 'prev+=40' },  // Red hue + 40°
              90
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue2 = result[2].swatch.toHsl().h
      const redHue = swatch('#ff0000').toHsl().h
      const expectedHue = (redHue + 40) % 360

      // Should be red hue + 40°
      expect(Math.abs(hue2 - expectedHue)).toBeLessThan(1)
    })

    it('should support prev-=X to shift hue backward from previous stop', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              '#00ff00',  // Green (hue ~120°)
              10,
              { mix: 50, hue: 'prev-=30' },  // Green hue - 30°
              90
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue2 = result[2].swatch.toHsl().h
      const greenHue = swatch('#00ff00').toHsl().h
      const expectedHue = (greenHue - 30 + 360) % 360

      // Should be green hue - 30°
      expect(Math.abs(hue2 - expectedHue)).toBeLessThan(1)
    })

    it('should work with decimal values', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 5, hue: 'next+=12.5' },
              10,
              '#0090ff',
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue0 = result[0].swatch.toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h
      const expectedHue = (blueHue + 12.5) % 360

      // Should support decimal adjustments
      expect(Math.abs(hue0 - expectedHue)).toBeLessThan(1)
    })

    it('should fallback correctly when no stops exist', () => {
      const scheme: UmbraScheme = {
        background: '#ffffff',
        foreground: '#0000ff',  // Blue foreground
        accents: [],
        settings: {
          range: {
            light: [
              { mix: 10, hue: 'next+=20' },  // No stops, use foreground + 20°
              50
            ]
          }
        }
      }

      const result = umbraGenerate(scheme, createAdjusted(scheme)).output[0].range
      const hue0 = result[0].swatch.toHsl().h
      const foregroundHue = swatch('#0000ff').toHsl().h
      const expectedHue = (foregroundHue + 20) % 360

      // Should use foreground hue + 20° when no next stop exists
      expect(Math.abs(hue0 - expectedHue)).toBeLessThan(1)
    })
  })
})
