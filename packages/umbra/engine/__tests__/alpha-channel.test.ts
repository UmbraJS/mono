import { describe, it, expect } from 'vitest'
import { umbra } from '../index'

describe('Alpha Channel Integrity', () => {
  it('should generate opaque colors for dark mode theme', () => {
    const theme = umbra({
      background: 'black',
      foreground: 'white',
      accents: ['#ff0000']
    })

    const formatted = theme.format()

    // Check all ranges
    formatted.formated.forEach((range) => {
      // Check background and foreground are 6-digit hex
      expect(range.background).toMatch(/^#[0-9a-f]{6}$/i)
      expect(range.foreground).toMatch(/^#[0-9a-f]{6}$/i)

      // Check all shades
      range.shades.forEach((shade) => {
        // Should be 6-character hex (#RRGGBB), not 8-character (#RRGGBBAA)
        expect(shade.length).toBe(7)

        // Should not have alpha channel (8-digit hex)
        expect(shade).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  it('should generate opaque colors for light mode theme', () => {
    const theme = umbra({
      background: 'white',
      foreground: 'black',
      accents: ['#0090ff']
    })

    const formatted = theme.format()

    formatted.formated.forEach((range) => {
      range.shades.forEach((shade) => {
        expect(shade.length).toBe(7)
        expect(shade).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  it('should preserve alpha=1 in all generated colors', () => {
    const theme = umbra({
      background: '#000000',
      foreground: '#ffffff',
      accents: [
        { name: 'red', color: '#ff0000' },
        { name: 'blue', color: '#0000ff' },
        { name: 'green', color: '#00ff00' }
      ]
    })

    // Check raw output colors (UmbraSwatch objects)
    theme.output.forEach((range) => {
      // Check background
      expect(range.background.toRgb().a).toBe(1)

      // Check foreground
      expect(range.foreground.toRgb().a).toBe(1)

      // Check all range colors
      range.range.forEach((color) => {
        const rgba = color.toRgb()
        expect(rgba.a).toBe(1)
      })
    })
  })

  it('should handle color presets without introducing alpha', () => {
    const theme = umbra({
      background: 'black',
      foreground: 'white',
      accents: ['red', 'blue', 'green', 'tomato', 'sky']
    })

    const formatted = theme.format()

    // All colors should be opaque 6-digit hex
    formatted.formated.forEach((range) => {
      range.shades.forEach((shade) => {
        expect(shade).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  it('should handle presets with HSL interpolation correctly', () => {
    // This specifically tests presets that use hue: "next", saturation: "+=99"
    // which was the pattern that triggered the bug
    const theme = umbra({
      background: '#000000',
      foreground: '#ffffff',
      accents: [
        'red',     // Uses evenContrastDark with { mix: X, hue: "next", saturation: "+=99" }
        'orange',  // Uses orangeContrastLight
        'blue'     // Uses endLoadedBlue
      ]
    })

    theme.output.forEach((range) => {
      range.range.forEach((color) => {
        const rgba = color.toRgb()
        const hex = color.toHex()

        // Must be opaque
        expect(rgba.a).toBe(1)

        // Must be 6-digit hex
        expect(hex.length).toBe(7)
        expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })

  it('should not produce colors with alpha=0', () => {
    const theme = umbra({
      background: 'black',
      foreground: 'white',
      accents: ['#ff0000', '#00ff00', '#0000ff']
    })

    theme.output.forEach((range) => {
      range.range.forEach((color) => {
        const rgba = color.toRgb()

        // Should never have alpha=0 (fully transparent)
        expect(rgba.a).not.toBe(0)

        // Should be 1 for opaque colors
        expect(rgba.a).toBe(1)
      })
    })
  })

  it('should handle inverted themes without alpha issues', () => {
    const light = umbra({
      background: 'white',
      foreground: 'black',
      accents: ['red']
    })

    const dark = light.inverse()

      // Both themes should have opaque colors
      ;[light, dark].forEach((theme) => {
        theme.output.forEach((range) => {
          range.range.forEach((color) => {
            expect(color.toRgb().a).toBe(1)
            expect(color.toHex().length).toBe(7)
          })
        })
      })
  })
})
