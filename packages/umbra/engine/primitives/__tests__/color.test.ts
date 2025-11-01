import { describe, it, expect } from 'vitest'
import { colorMix, colorMixHSL } from '../color'
import { swatch } from '../../../swatch'

describe('Color Mixing', () => {
  describe('colorMix - Standard RGB/LAB mixing', () => {
    it('should mix two colors at 50%', () => {
      const from = swatch('#000000')
      const to = swatch('#ffffff')
      const result = colorMix(from, to, 50)

      // Should be somewhere in the middle
      const hsl = result.toHsl()
      expect(hsl.l).toBeGreaterThan(30)
      expect(hsl.l).toBeLessThan(70)
    })

    it('should return start color at 0%', () => {
      const from = swatch('#ff0000')
      const to = swatch('#00ff00')
      const result = colorMix(from, to, 0)

      expect(result.toHex()).toBe('#ff0000')
    })

    it('should return end color at 100%', () => {
      const from = swatch('#ff0000')
      const to = swatch('#00ff00')
      const result = colorMix(from, to, 100)

      expect(result.toHex()).toBe('#00ff00')
    })
  })

  describe('colorMixHSL - Independent HSL channel mixing', () => {
    it('should mix with simple percentage (number)', () => {
      const from = swatch('#000000')
      const to = swatch('#ffffff')
      const result = colorMixHSL(from, to, 50)

      const hsl = result.toHsl()
      expect(hsl.l).toBeGreaterThan(30)
      expect(hsl.l).toBeLessThan(70)
    })

    it('should support independent saturation control', () => {
      const from = swatch('#1a1a1a')
      const to = swatch('#3b82f6')

      // Standard 30% mix
      const standard = colorMixHSL(from, to, 30)

      // 30% mix but saturation at 60%
      const boostedSat = colorMixHSL(from, to, {
        mix: 30,
        saturation: 60
      })

      const standardHsl = standard.toHsl()
      const boostedHsl = boostedSat.toHsl()

      // Boosted saturation should have higher saturation
      expect(boostedHsl.s).toBeGreaterThan(standardHsl.s)
    })

    it('should support independent lightness control', () => {
      const from = swatch('#1a1a1a')
      const to = swatch('#f0f0f0')

      const standard = colorMixHSL(from, to, 50)
      const boostedLight = colorMixHSL(from, to, {
        mix: 50,
        lightness: 80
      })

      const standardHsl = standard.toHsl()
      const boostedHsl = boostedLight.toHsl()

      expect(boostedHsl.l).toBeGreaterThan(standardHsl.l)
    })

    it('should support independent hue control', () => {
      const from = swatch('#ff0000') // Red (hue ~0)
      const to = swatch('#0000ff')   // Blue (hue ~240)

      const standard = colorMixHSL(from, to, 50)
      const adjustedHue = colorMixHSL(from, to, {
        mix: 50,
        hue: 25 // Hue only 25% to target
      })

      const standardHsl = standard.toHsl()
      const adjustedHsl = adjustedHue.toHsl()

      // Adjusted should have hue closer to red (lower hue value in this case)
      // Standard at 50% should be around 300 (going backwards from 360 to 240)
      // Adjusted at 25% should be around 330 (closer to 0/360)
      expect(adjustedHsl.h).toBeGreaterThan(standardHsl.h)
    })

    it('should support relative values with +=', () => {
      const from = swatch('#000000')
      const to = swatch('#ffffff')

      // This would be used in the generator with position tracking
      const result = colorMixHSL(from, to, {
        mix: 50,
        saturation: '+=20' // Current position + 20
      })

      // Should not throw
      expect(result).toBeDefined()
      expect(result.toHex()).toBeTruthy()
    })

    it('should support relative values with -=', () => {
      const from = swatch('#ffffff')
      const to = swatch('#000000')

      const result = colorMixHSL(from, to, {
        mix: 50,
        lightness: '-=10'
      })

      expect(result).toBeDefined()
      expect(result.toHex()).toBeTruthy()
    })

    it('should clamp saturation between 0-100', () => {
      const from = swatch('#808080')
      const to = swatch('#ff0000')

      const result = colorMixHSL(from, to, {
        mix: 50,
        saturation: 150 // Should be clamped to 100
      })

      const hsl = result.toHsl()
      expect(hsl.s).toBeLessThanOrEqual(100)
      expect(hsl.s).toBeGreaterThanOrEqual(0)
    })

    it('should clamp lightness between 0-100', () => {
      const from = swatch('#808080')
      const to = swatch('#000000')

      const result = colorMixHSL(from, to, {
        mix: 50,
        lightness: -20 // Should be clamped to 0
      })

      const hsl = result.toHsl()
      expect(hsl.l).toBeLessThanOrEqual(100)
      expect(hsl.l).toBeGreaterThanOrEqual(0)
    })
  })

  describe('HSL circular hue interpolation', () => {
    it('should take shortest path around color wheel', () => {
      const from = swatch('#ff0000') // Red (hue ~0)
      const to = swatch('#ff00ff')   // Magenta (hue ~300)

      const result = colorMixHSL(from, to, 50)
      const hsl = result.toHsl()

      // Should go through 330 (red->magenta), not through 150 (red->cyan->magenta)
      // 50% between 0 and 300 (going backwards) should be around 330
      expect(hsl.h).toBeGreaterThan(300)
      expect(hsl.h).toBeLessThan(360)
    })
  })

  describe('Alpha channel preservation', () => {
    it('should preserve alpha=1 when mixing opaque colors', () => {
      const from = swatch('#000000')
      const to = swatch('#ffffff')
      const result = colorMix(from, to, 50)

      expect(result.toRgb().a).toBe(1)
    })

    it('should preserve alpha=1 in HSL mixing with base mix', () => {
      const from = swatch('#000000')
      const to = swatch('#ff0000')
      const result = colorMixHSL(from, to, {
        mix: 15,
        hue: 50,
        saturation: 99
      })

      const rgba = result.toRgb()
      expect(rgba.a).toBe(1)
    })

    it('should use base mix for alpha interpolation, not hue mix', () => {
      const from = swatch('#000000') // Black, alpha=1
      const to = swatch('#ff0000')   // Red, alpha=1

      // When hue and saturation differ from base mix, alpha should follow base mix
      const result = colorMixHSL(from, to, {
        mix: 20,        // Base mix at 20%
        hue: 80,        // Hue at 80% (different from base)
        saturation: 95  // Saturation at 95% (different from base)
      })

      const rgba = result.toRgb()

      // Alpha should be based on base mix (20%), not hue mix (80%)
      // Both colors have alpha=1, so result should also have alpha=1
      expect(rgba.a).toBe(1)

      // Verify the color was actually mixed (not all zeros)
      expect(rgba.r).toBeGreaterThan(0)
    })

    it('should not produce transparent colors when mixing opaque colors', () => {
      // This specifically tests the bug where colors had alpha=0
      // when using independent HSL channel mixing
      const from = swatch('black')
      const to = swatch('#ff0000')

      // Simulate the evenContrastDark preset pattern
      const colors = [
        colorMixHSL(from, to, { mix: 15, hue: 50, saturation: 99 }),
        colorMixHSL(from, to, { mix: 20, hue: 50, saturation: 99 }),
        colorMixHSL(from, to, { mix: 25, hue: 50, saturation: 99 }),
        colorMixHSL(from, to, { mix: 32, hue: 50, saturation: 99 }),
      ]

      colors.forEach((color) => {
        const rgba = color.toRgb()
        const hex = color.toHex()

        // Should be opaque (alpha = 1)
        expect(rgba.a).toBe(1)

        // Should not have alpha channel in hex (no 8-digit hex codes)
        expect(hex.length).toBe(7) // #RRGGBB format only

        // Should be valid 6-digit hex format
        expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('should handle alpha interpolation correctly for semi-transparent colors', () => {
      const from = swatch('rgba(0, 0, 0, 0.5)')    // Semi-transparent black
      const to = swatch('rgba(255, 0, 0, 1)')      // Opaque red

      const result = colorMixHSL(from, to, {
        mix: 50,
        hue: 25,
        saturation: 75
      })

      const rgba = result.toRgb()

      // Alpha should interpolate based on base mix (50%)
      // 0.5 + ((1 - 0.5) * 0.5) = 0.5 + 0.25 = 0.75
      expect(rgba.a).toBeCloseTo(0.75, 2)
    })
  })
})
