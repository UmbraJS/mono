/**
 * Color presets test suite
 * Tests the preset lookup system and color matching functionality
 */
import { describe, it, expect } from 'vitest'
import { umbra } from '../index'
import { colorPresets, getPresetByName, findClosestPreset, resolveColorPreset } from './presets'

describe('Color Presets', () => {
  describe('Preset Availability', () => {
    it('should have all 26 color presets available', () => {
      expect(colorPresets).toHaveLength(26)
    })

    it('should have all expected color names', () => {
      const expectedColors = [
        'gray', 'blue', 'darkBlue', 'red', 'green', 'tomato', 'crimson', 'pink', 'plum',
        'purple', 'violet', 'iris', 'indigo', 'cyan', 'teal', 'jade', 'grass',
        'bronze', 'gold', 'brown', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky'
      ]

      const presetNames = colorPresets.map(p => p.name)
      expectedColors.forEach(color => {
        expect(presetNames).toContain(color)
      })
    })

    it('should have unique hex values for each preset', () => {
      const hexValues = colorPresets.map(p => p.hex)
      const uniqueHexValues = new Set(hexValues)
      expect(uniqueHexValues.size).toBe(colorPresets.length)
    })

    it('should have tints and shades for each preset', () => {
      colorPresets.forEach(preset => {
        expect(preset.range).toBeDefined()
        expect(preset.range.light).toBeDefined()
        expect(preset.range.dark).toBeDefined()
        expect(Array.isArray(preset.range.light)).toBe(true)
        expect(Array.isArray(preset.range.dark)).toBe(true)
      })
    })
  })

  describe('getPresetByName', () => {
    it('should find preset by exact name', () => {
      const blue = getPresetByName('blue')
      expect(blue).toBeDefined()
      expect(blue?.name).toBe('blue')
      expect(blue?.hex).toBe('#0090FF')
    })

    it('should be case-insensitive', () => {
      const blue1 = getPresetByName('Blue')
      const blue2 = getPresetByName('BLUE')
      const blue3 = getPresetByName('blue')

      expect(blue1).toEqual(blue2)
      expect(blue2).toEqual(blue3)
    })

    it('should return undefined for non-existent preset', () => {
      const result = getPresetByName('nonexistent')
      expect(result).toBeUndefined()
    })

    it('should find all 26 colors by name', () => {
      const colors = ['gray', 'blue', 'darkBlue', 'red', 'green', 'tomato', 'crimson', 'pink', 'plum',
        'purple', 'violet', 'iris', 'indigo', 'cyan', 'teal', 'jade', 'grass',
        'bronze', 'gold', 'brown', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky']

      colors.forEach(color => {
        const preset = getPresetByName(color)
        expect(preset).toBeDefined()
        expect(preset?.name).toBe(color)
      })
    })
  })

  describe('findClosestPreset', () => {
    it('should find exact match', () => {
      const preset = findClosestPreset('#0090FF')
      expect(preset.name).toBe('blue')
    })

    it('should find closest match for similar color', () => {
      const preset = findClosestPreset('#E64D2E') // Close to tomato
      expect(preset.name).toBe('tomato')
    })

    it('should handle lowercase hex values', () => {
      const preset = findClosestPreset('#0090ff')
      expect(preset.name).toBe('blue')
    })

    it('should find closest preset for any color', () => {
      const preset = findClosestPreset('#FF0000')
      expect(preset).toBeDefined()
      expect(preset.name).toBeDefined()
    })
  })

  describe('resolveColorPreset', () => {
    it('should resolve preset name to preset', () => {
      const result = resolveColorPreset('blue')
      expect(result.hex).toBe('#0090FF')
      expect(result.preset.name).toBe('blue')
    })

    it('should resolve hex to closest preset', () => {
      const result = resolveColorPreset('#0090FF')
      expect(result.hex).toBe('#0090FF')
      expect(result.preset.name).toBe('blue')
    })

    it('should be case-insensitive for preset names', () => {
      const result1 = resolveColorPreset('BLUE')
      const result2 = resolveColorPreset('blue')
      expect(result1.hex).toBe(result2.hex)
    })

    it('should find closest match for unknown hex', () => {
      const result = resolveColorPreset('#E64D2E')
      expect(result.hex).toBe('#E64D2E')
      expect(result.preset.name).toBe('tomato')
    })
  })

  describe('Umbra Integration', () => {
    it('should accept color names instead of hex values', () => {
      const scheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['blue', 'red', 'green']
      })

      expect(scheme.output).toHaveLength(4) // background + 3 accents
      expect(scheme.output[1].range[8].swatch.toHex()).toBe('#0090ff')
      expect(scheme.output[2].range[8].swatch.toHex()).toBe('#e5484d')
      expect(scheme.output[3].range[8].swatch.toHex()).toBe('#30a46c')
    })

    it('should use preset tints/shades when color name is provided', () => {
      const schemeWithPreset = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['blue']
      })

      const schemeWithHex = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [{
          color: '#0090FF',
          range: {
            light: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25],
            dark: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25]
          }
        }]
      })

      // Preset should produce different (optimized) results than default tints
      const presetColors = schemeWithPreset.output[1].range.slice(0, 3).map(c => c.swatch.toHex())
      const defaultColors = schemeWithHex.output[1].range.slice(0, 3).map(c => c.swatch.toHex())

      expect(presetColors).not.toEqual(defaultColors)
    })

    it('should support mixed configuration with presets and custom tints', () => {
      const scheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: [
          'blue',  // Uses preset
          {
            name: 'custom',
            color: '#FF00FF',
            range: { light: [1, 2, 5, 10, 15, 20, 30, 40, 'primer', 60, 70, 85] }
          },
          'red'  // Uses preset
        ]
      })

      expect(scheme.output).toHaveLength(4)
      expect(scheme.output[1].range[8].swatch.toHex()).toBe('#0090ff') // blue
      expect(scheme.output[3].range[8].swatch.toHex()).toBe('#e5484d') // red
    })

    it('should auto-match custom colors to closest preset', () => {
      const scheme = umbra({
        background: '#ffffff',
        foreground: '#000000',
        accents: ['#E64D2E'] // Close to tomato but not exact
      })

      // Should still generate valid colors
      expect(scheme.output[1].range).toHaveLength(12)
      expect(scheme.output[1].range[8].swatch.toHex()).toBe('#e64d2e')
    })

    it('should handle all 26 color names', () => {
      const colors = ['gray', 'blue', 'darkBlue', 'red', 'green', 'tomato', 'crimson', 'pink', 'plum',
        'purple', 'violet', 'iris', 'indigo', 'cyan', 'teal', 'jade', 'grass',
        'bronze', 'gold', 'brown', 'orange', 'amber', 'yellow', 'lime', 'mint', 'sky']

      colors.forEach(color => {
        const scheme = umbra({
          background: '#ffffff',
          foreground: '#000000',
          accents: [color]
        })

        expect(scheme.output[1].range).toHaveLength(12)
        expect(scheme.output[1].range[8]).toBeDefined()
      })
    })
  })

  describe('Color Uniqueness', () => {
    it('should have different tints for blue and sky', () => {
      const blue = getPresetByName('blue')
      const sky = getPresetByName('sky')

      expect(blue?.hex).not.toBe(sky?.hex)
      expect(blue?.range.light).not.toEqual(sky?.range.light)
    })

    // Note: red/tomato and green/grass currently share the same evenContrast.range configuration
    // If they need distinct ranges, update their preset definitions in presets.ts
  })
})
