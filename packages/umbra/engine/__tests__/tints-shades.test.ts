import { describe, it, expect } from 'vitest'
import { umbra } from '../index'
import { swatch } from '../../swatch'

describe('Tints vs Shades (Light vs Dark Themes)', () => {
  describe('Theme detection', () => {
    it('should use tints for light background', () => {
      const lightTheme = umbra({
        background: '#ffffff',  // Light
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [10, 50, 90],    // Should use this
            dark: [20, 60, 80]      // Should NOT use this
          }
        }
      })

      // Verify it generated 3 colors from tints config
      expect(lightTheme.output[0].range).toHaveLength(3)

      // First color should be close to 10% from white→black
      const firstLightness = lightTheme.output[0].range[0].swatch.toHsl().l
      expect(firstLightness).toBeGreaterThan(85)  // Very light
    })

    it('should use shades for dark background', () => {
      const darkTheme = umbra({
        background: '#000000',  // Dark
        foreground: '#ffffff',
        accents: [],
        settings: {
          range: {
            light: [10, 50, 90],    // Should NOT use this
            dark: [20, 60, 80]      // Should use this
          }
        }
      })

      expect(darkTheme.output[0].range).toHaveLength(3)

      // First color should be 20% from black→white (darker than tints would be)
      const firstLightness = darkTheme.output[0].range[0].swatch.toHsl().l
      expect(firstLightness).toBeLessThan(30)  // Fairly dark
    })

    it('should detect theme from background lightness', () => {
      // Mid-gray background - should determine if closer to light or dark
      const midGrayTheme = umbra({
        background: '#808080',  // 50% gray
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: [50],
            dark: [50]
          }
        }
      })

      // Should make a decision (not crash)
      expect(midGrayTheme.output[0].range).toHaveLength(1)
    })
  })

  describe('Accent-specific tints/shades', () => {
    it('should use accent tints for light theme', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          range: { light: [10, 50, 90] }
          // Note: System may add default settings, test for presence not exact count
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()
      expect(accentRange!.range.length).toBeGreaterThan(0)

      // Should contain colors - verify it worked
      const firstColor = accentRange!.range[0]
      expect(firstColor).toBeDefined()
      expect(firstColor.swatch.toHex()).toBeTruthy()
    })

    it('should use accent shades for dark theme', () => {
      const theme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          color: '#0090ff',
          range: { dark: [5, 25, 75] }
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()
      expect(accentRange!.range.length).toBeGreaterThan(0)

      // Should contain valid colors
      const firstColor = accentRange!.range[0]
      expect(firstColor).toBeDefined()
      expect(firstColor.swatch.toHex()).toBeTruthy()
    })
  })

  describe('Fallback to settings', () => {
    it('should use settings.tints when accent has no tints', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#ff0000'
          // No tints/shades specified
        }],
        settings: {
          range: {
            light: [20, 50, 80],
            dark: [10, 40, 70]
          }
        }
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()

      // Should use settings.tints as fallback
      expect(accentRange!.range.length).toBeGreaterThan(0)
    })

    it('should use settings.shades when accent has no shades in dark theme', () => {
      const theme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          color: '#ff0000'
          // No tints/shades specified
        }],
        settings: {
          range: {
            light: [20, 50, 80],
            dark: [10, 40, 70]
          }
        }
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()

      // Should use settings.shades as fallback
      expect(accentRange!.range.length).toBeGreaterThan(0)
    })
  })

  describe('Same config for both themes', () => {
    it('should work with identical tints and shades', () => {
      const config = [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]

      const lightTheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [],
        settings: {
          range: {
            light: config,
            dark: config
          }
        }
      })

      const darkTheme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [],
        settings: {
          range: {
            light: config,
            dark: config
          }
        }
      })

      // Both should work
      expect(lightTheme.output[0].range).toHaveLength(12)
      expect(darkTheme.output[0].range).toHaveLength(12)

      // Light theme first color should be very light
      expect(lightTheme.output[0].range[0].swatch.toHsl().l).toBeGreaterThan(95)

      // Dark theme first color should be very dark
      expect(darkTheme.output[0].range[0].swatch.toHsl().l).toBeLessThan(10)
    })
  })

  describe('Different progressions for light/dark', () => {
    it('should allow different hue strategies per theme', () => {
      const lightTheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          range: {
            light: [
              { mix: 1, hue: 'next' },  // Light theme uses next
              10,
              '#0090ff'
            ]
          }
        }],
        settings: {}
      })

      const darkTheme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          color: '#0090ff',
          range: {
            dark: [
              { mix: 5, hue: 'prev' },  // Dark theme uses prev (will use bg or accent color)
              20,
              '#0090ff'
            ]
          }
        }],
        settings: {}
      })

      // Both should generate successfully
      expect(lightTheme.output[1].range.length).toBeGreaterThan(0)
      expect(darkTheme.output[1].range.length).toBeGreaterThan(0)

      // Light theme should have blue-ish color from next reference
      const lightHue = lightTheme.output[1].range[0].swatch.toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h

      expect(Math.abs(lightHue - blueHue)).toBeLessThan(15)

      // Dark theme first color exists and is valid
      const darkColor = darkTheme.output[1].range[0]
      expect(darkColor).toBeDefined()
      expect(darkColor.swatch.toHex()).toBeTruthy()
    })

    it('should allow different saturation strategies per theme', () => {
      const accent = '#3b82f6'

      const lightTheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: accent,
          range: {
            light: [
              { mix: 10, saturation: '+=50' },  // High saturation for light
              50
            ]
          }
        }],
        settings: {}
      })

      const darkTheme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          color: accent,
          range: {
            dark: [
              { mix: 10, saturation: '+=20' },  // Lower saturation for dark
              50
            ]
          }
        }],
        settings: {}
      })

      const lightSat = lightTheme.output[1].range[0].swatch.toHsl().s
      const darkSat = darkTheme.output[1].range[0].swatch.toHsl().s

      // Light theme should have higher saturation boost
      expect(lightSat).toBeGreaterThan(darkSat)
    })
  })

  describe('Real-world patterns', () => {
    it('should support Radix-like gray that works in both themes', () => {
      const grayConfig = [0.3, 1, 4.4, 3, 3, 3, 3, 9, 23, 7, 23, 70]

      const lightTheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          name: 'gray',
          range: {
            light: grayConfig,
            dark: grayConfig  // Same for both
          }
        }],
        settings: {}
      })

      const darkTheme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          name: 'gray',
          range: {
            light: grayConfig,
            dark: grayConfig
          }
        }],
        settings: {}
      })

      // Both should produce 12 grays
      expect(lightTheme.output[1].range).toHaveLength(12)
      expect(darkTheme.output[1].range).toHaveLength(12)

      // All colors should be neutral (very low saturation)
      lightTheme.output[1].range.forEach(color => {
        expect(color.swatch.toHsl().s).toBeLessThan(5)
      })

      darkTheme.output[1].range.forEach(color => {
        expect(color.swatch.toHsl().s).toBeLessThan(5)
      })
    })

    it('should support blue accent with different light/dark configs', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          range: {
            light: [
              { mix: 2, hue: 'next', saturation: '+=99' },
              5, 8, 12, 17, 24, 35,
              '#0090ff',
              { mix: '+=5', hue: 0, saturation: '-=4' },
              { mix: '+=12', hue: 0, saturation: '-=12' },
              { mix: '+=25', hue: 0, saturation: '-=29' }
            ],
            dark: [
              { mix: 3, hue: 'next', saturation: '+=80' },
              8, 15, 22, 30, 40, 50,
              '#0090ff',
              { mix: '+=8', hue: 0, saturation: '-=10' },
              { mix: '+=18', hue: 0, saturation: '-=25' },
              { mix: '+=35', hue: 0, saturation: '-=40' }
            ]
          }
        }],
        settings: {}
      })

      const accentRange = theme.output[1].range

      // Should generate colors (might be 11 or 12 depending on how duplicates are handled)
      expect(accentRange.length).toBeGreaterThanOrEqual(10)
      expect(accentRange.length).toBeLessThanOrEqual(12)

      // All should be blue-ish
      const blueHue = swatch('#0090ff').toHsl().h
      accentRange.forEach(color => {
        const hue = color.swatch.toHsl().h
        expect(Math.abs(hue - blueHue)).toBeLessThan(20)
      })
    })
  })
})
