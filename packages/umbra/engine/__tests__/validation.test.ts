import { describe, it, expect } from 'vitest'
import { umbra } from '../index'

describe('Validation Warnings', () => {
  it('should warn when accent is too close to background', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: [
        { name: 'problematic', color: '#f5f5f5' } // Very close to white
      ]
    })

    expect(theme.validationWarnings.length).toBeGreaterThan(0)
    expect(theme.validationWarnings[0].type).toBe('contrast')
    expect(theme.validationWarnings[0].severity).toBe('warning')
    expect(theme.validationWarnings[0].context?.accentName).toBe('problematic')
  })

  it('should warn when accent is too close to foreground', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: [
        { name: 'dark', color: '#0a0a0a' } // Very close to black
      ]
    })

    expect(theme.validationWarnings.length).toBeGreaterThan(0)
    expect(theme.validationWarnings[0].type).toBe('contrast')
    expect(theme.validationWarnings[0].context?.accentName).toBe('dark')
  })

  it('should not warn when accent has good contrast', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: [
        { name: 'good', color: '#0090ff' } // Good contrast with both
      ]
    })

    expect(theme.validationWarnings.length).toBe(0)
  })

  it('should pass warnings through format step', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: ['#f0f0f0'] // Close to white
    })

    const formatted = theme.format()

    expect(formatted.validationWarnings.length).toBeGreaterThan(0)
    expect(formatted.validationWarnings).toEqual(theme.validationWarnings)
  })

  it('should respect custom minContrastThreshold', () => {
    const themeDefault = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: ['#d0d0d0']
    })

    const themeStrict = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: ['#d0d0d0'],
      settings: {
        minContrastThreshold: 50 // Stricter than default (30)
      }
    })

    // Strict threshold should generate more or same warnings
    expect(themeStrict.validationWarnings.length).toBeGreaterThanOrEqual(
      themeDefault.validationWarnings.length
    )
  })

  it('should include detailed context in warnings', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: [
        { name: 'test', color: '#f8f8f8' }
      ]
    })

    expect(theme.validationWarnings.length).toBeGreaterThan(0)
    const warning = theme.validationWarnings[0]

    expect(warning.context).toBeDefined()
    expect(warning.context?.accentName).toBe('test')
    expect(warning.context?.accentColor).toBe('#f8f8f8')
    expect(warning.context?.targetColor).toBeDefined()
    expect(warning.context?.contrastValue).toBeDefined()
    expect(warning.context?.minContrast).toBe(30) // Default threshold
  })

  it('should handle multiple accents with mixed validation results', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: [
        { name: 'good', color: '#0090ff' },     // Good contrast
        { name: 'bad', color: '#f5f5f5' },      // Bad contrast with bg
        { name: 'also-good', color: '#ff0000' } // Good contrast
      ]
    })

    // Should have exactly one warning (for 'bad')
    expect(theme.validationWarnings.length).toBe(1)
    expect(theme.validationWarnings[0].context?.accentName).toBe('bad')
  })

  it('should work with string-only accent definitions', () => {
    const theme = umbra({
      background: '#ffffff',
      foreground: '#000000',
      accents: ['#f0f0f0'] // String instead of object
    })

    expect(theme.validationWarnings.length).toBeGreaterThan(0)
    expect(theme.validationWarnings[0].context?.accentName).toBe('accent')
  })

  it('should work in dark mode', () => {
    const theme = umbra({
      background: '#000000',
      foreground: '#ffffff',
      accents: [
        { name: 'too-dark', color: '#0a0a0a' } // Too close to dark background
      ]
    })

    expect(theme.validationWarnings.length).toBeGreaterThan(0)
    expect(theme.validationWarnings[0].context?.accentName).toBe('too-dark')
  })
})
