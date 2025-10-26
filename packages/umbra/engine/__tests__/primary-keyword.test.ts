import { describe, it, expect } from 'vitest'
import { umbra } from '../index'
import { swatch } from '../../swatch'

describe('Primary Keyword', () => {
  describe('Basic functionality', () => {
    it('should replace "primary" with accent color', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [10, 50, 'primary', 90]
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()

      // The third color (index 2) should be the accent color
      const primaryColor = accentRange!.range[2]
      expect(primaryColor.toHex()).toBe('#0090ff')
    })

    it('should work at any position in the array', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#ff0000',
          tints: ['primary', 50, 90]  // First position
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange!.range[0].toHex()).toBe('#ff0000')
    })

    it('should work with hue references before primary', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [
            { mix: 1, hue: 'next' },  // Should reference primary
            { mix: 2, hue: 'next', saturation: '+=99' },
            5,
            'primary',
            { mix: '+=10', hue: 0 }
          ]
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()

      // Primary should be at index 3
      expect(accentRange!.range[3].toHex()).toBe('#0090ff')

      // First two colors should have blue hue from referencing primary
      const hue0 = accentRange!.range[0].toHsl().h
      const hue1 = accentRange!.range[1].toHsl().h
      const blueHue = swatch('#0090ff').toHsl().h

      expect(Math.abs(hue0 - blueHue)).toBeLessThan(15)
      expect(Math.abs(hue1 - blueHue)).toBeLessThan(15)
    })

    it('should work with hue references after primary', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#00ff00',
          tints: [
            10,
            'primary',
            { mix: '+=20', hue: 'prev' },  // Should reference primary
            90
          ]
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      expect(accentRange).toBeDefined()

      // Primary at index 1
      expect(accentRange!.range[1].toHex()).toBe('#00ff00')

      // Color after should reference green hue
      const hue2 = accentRange!.range[2].toHsl().h
      const greenHue = swatch('#00ff00').toHsl().h

      expect(Math.abs(hue2 - greenHue)).toBeLessThan(15)
    })
  })

  describe('Edge cases', () => {
    it('should handle primary with no accent color gracefully', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['#ff00ff'],  // String accent (no explicit color property)
        settings: {}
      })

      // Should not crash
      expect(theme.output.length).toBeGreaterThan(0)
    })

    it('should work with both tints and shades', () => {
      const lightTheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#3b82f6',
          tints: [10, 'primary', 90],
          shades: [5, 'primary', 95]
        }],
        settings: {}
      })

      const darkTheme = umbra({
        background: '#000000',
        foreground: '#ffffff',
        accents: [{
          color: '#3b82f6',
          tints: [10, 'primary', 90],
          shades: [5, 'primary', 95]
        }],
        settings: {}
      })

      // Light theme uses tints - primary at index 1
      expect(lightTheme.output[1].range[1].toHex()).toBe('#3b82f6')

      // Dark theme uses shades - primary also at index 1
      expect(darkTheme.output[1].range[1].toHex()).toBe('#3b82f6')
    })

    it('should work in complex real-world config', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [
            { mix: 2, hue: 'next' },
            { mix: 2, hue: 'next', saturation: '+=99' },
            5, 8, 12, 17, 24, 35,
            'primary',  // Instead of "#0090ff"
            { mix: '+=5', hue: 0, saturation: '-=4' },
            { mix: '+=12', hue: 0, saturation: '-=12' },
            { mix: '+=25', hue: 0, saturation: '-=29' }
          ]
        }],
        settings: {}
      })

      const accentRange = theme.output[1].range

      // Primary should be at index 8
      expect(accentRange[8].toHex()).toBe('#0090ff')

      // Should have generated all colors
      expect(accentRange.length).toBeGreaterThanOrEqual(11)

      // Colors after primary should preserve blue hue
      const bluHue = swatch('#0090ff').toHsl().h
      expect(Math.abs(accentRange[9].toHsl().h - bluHue)).toBeLessThan(10)
      expect(Math.abs(accentRange[10].toHsl().h - bluHue)).toBeLessThan(10)
    })
  })

  describe('Settings with primary', () => {
    it('should work in settings.tints when accent specifies tints', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#ff0000',
          tints: [10, 'primary', 90]  // Accent explicitly uses primary in its own tints
        }],
        settings: {
          tints: [20, 50, 80]  // Settings don't matter here
        }
      })

      const accentRange = theme.output.find(r => r.name !== 'base')

      // Should replace primary with accent color
      expect(accentRange!.range[1].toHex()).toBe('#ff0000')
    })

    it('should work when accent has no explicit color (just string)', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['#00ff00'],  // Simple string accent
        settings: {
          tints: [20, 'primary', 80]
        }
      })

      const accentRange = theme.output.find(r => r.name !== 'base')

      // Should use the string color for primary
      expect(accentRange!.range[1].toHex()).toBe('#00ff00')
    })
  })

  describe('Validation', () => {
    it('should handle multiple primary keywords (uses first occurrence)', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [10, 'primary', 50, 'primary', 90]  // Two primaries
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')

      // Both should be replaced with the color
      expect(accentRange!.range[1].toHex()).toBe('#0090ff')
      expect(accentRange!.range[3].toHex()).toBe('#0090ff')
    })

    it('should not interfere with other string color stops', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [
            '#e0f2ff',  // Explicit color
            'primary',   // Keyword
            '#003d82'    // Another explicit color
          ]
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')

      // All three should be in place
      expect(accentRange!.range[0].toHex()).toBe('#e0f2ff')
      expect(accentRange!.range[1].toHex()).toBe('#0090ff')
      expect(accentRange!.range[2].toHex()).toBe('#003d82')
    })

    it('should not duplicate accent color when primary keyword is used', () => {
      const theme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090ff',
          tints: [
            { mix: 2, hue: 'next' },
            { mix: 2, hue: 'next', saturation: '+=99' },
            5, 8, 12, 17, 24, 35,
            'primary',  // User explicitly positioned the color here
            { mix: '+=5', hue: 0, saturation: '-=4' },
            { mix: '+=12', hue: 0, saturation: '-=12' },
            { mix: '+=25', hue: 0, saturation: '-=29' }
          ]
        }],
        settings: {}
      })

      const accentRange = theme.output.find(r => r.name !== 'base')
      const range = accentRange!.range

      // Count how many times the exact accent color appears in the range
      const accentColorHex = '#0090ff'
      const occurrences = range.filter(color => color.toHex() === accentColorHex).length

      // Should appear exactly once (where "primary" was placed)
      expect(occurrences).toBe(1)

      // Verify it's at the correct index (where "primary" was - index 8)
      expect(range[8].toHex()).toBe(accentColorHex)
    })
  })
})
