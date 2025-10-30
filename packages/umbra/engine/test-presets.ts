/**
 * Test color presets functionality
 * Demonstrates how to use color names and automatic preset matching
 */

import { umbra } from '../index'
import { colorPresets, getPresetByName, findClosestPreset, resolveColorPreset } from './presets'

console.log('\n=== Color Presets Test ===\n')

// Test 1: List all available presets
console.log('Available color presets:')
colorPresets.forEach(preset => {
  const aliases = preset.aliases ? ` (aliases: ${preset.aliases.join(', ')})` : ''
  console.log(`  - ${preset.name}: ${preset.hex}${aliases}`)
})

// Test 2: Using color names instead of hex values
console.log('\n=== Test 1: Using Color Names ===\n')

const schemeWithNames = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    'tomato',    // Use preset name instead of hex
    'blue',      // Use preset name
    'green'      // Use preset name
  ]
})

console.log('Using color names: tomato, blue, green')
console.log('Generated accents:')
schemeWithNames.output.slice(1).forEach((accent) => {
  console.log(`  ${accent.name}:`, accent.range[8].toHex())
})

// Test 3: Using different colors
console.log('\n=== Test 2: Using Different Colors ===\n')

const schemeWithDifferentColors = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    'red',       // Red preset
    'sky',       // Sky preset
    'grass'      // Grass preset
  ]
})

console.log('Using colors: red, sky, grass')
console.log('Generated accents:')
schemeWithDifferentColors.output.slice(1).forEach((accent) => {
  console.log(`  ${accent.name}:`, accent.range[8].toHex())
})

// Test 4: Automatic preset matching for custom colors
console.log('\n=== Test 3: Automatic Preset Matching ===\n')

const customColor = '#E64D2E'  // Close to tomato
const matched = findClosestPreset(customColor)
console.log(`Custom color: ${customColor}`)
console.log(`Closest preset: ${matched.name} (${matched.hex})`)

const schemeWithCustom = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [customColor]
})

console.log('\nGenerated with auto-matched preset:')
console.log('First 3 shades:', schemeWithCustom.output[1].range.slice(0, 3).map(c => c.toHex()))

// Test 5: Get preset by name
console.log('\n=== Test 4: Get Preset Details ===\n')

const bluePreset = getPresetByName('blue')
if (bluePreset) {
  console.log(`Blue preset:`)
  console.log(`  Name: ${bluePreset.name}`)
  console.log(`  Hex: ${bluePreset.hex}`)
  console.log(`  Tints length: ${Array.isArray(bluePreset.tints) ? bluePreset.tints.length : 'dynamic'}`)
  console.log(`  Shades length: ${Array.isArray(bluePreset.shades) ? bluePreset.shades.length : 'dynamic'}`)
}

// Test 6: Resolve color (handles both names and hex)
console.log('\n=== Test 5: Resolve Color ===\n')

const resolved1 = resolveColorPreset('tomato')
console.log(`'tomato' resolves to: ${resolved1.hex} (preset: ${resolved1.preset.name})`)

const resolved2 = resolveColorPreset('#0090FF')
console.log(`'#0090FF' resolves to: ${resolved2.hex} (closest preset: ${resolved2.preset.name})`)

// Test 7: Compare default vs preset tints
console.log('\n=== Test 6: Default vs Preset Tints ===\n')

const defaultScheme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [{
    color: '#0090FF',
    // No tints/shades specified - will use defaults
    shades: [5, 5, 5, 5, 15, 10, 10, 25, 30, 25, 25, 25],
    tints: [5, 10, 10, 10, 15, 15, 25, 15, 15, 15, 15, 25]
  }]
})

const presetScheme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: ['blue']  // Will use optimized preset tints
})

console.log('Default tints (first 3):')
console.log(defaultScheme.output[1].range.slice(0, 3).map(c => c.toHex()))

console.log('\nPreset tints (first 3):')
console.log(presetScheme.output[1].range.slice(0, 3).map(c => c.toHex()))

// Test 8: Mixed usage - some with presets, some with custom tints
console.log('\n=== Test 7: Mixed Configuration ===\n')

const mixedScheme = umbra({
  background: '#ffffff',
  foreground: '#000000',
  accents: [
    'tomato',  // Uses preset
    {
      name: 'custom',
      color: '#FF00FF',
      tints: [1, 2, 5, 10, 15, 20, 30, 40, 'primer', 60, 70, 85]  // Custom tints
    },
    'purple'  // Uses preset
  ]
})

console.log('Mixed configuration:')
mixedScheme.output.slice(1).forEach((accent) => {
  console.log(`  ${accent.name}: ${accent.range[8].toHex()}`)
})

console.log('\n✓ All preset tests completed!\n')
