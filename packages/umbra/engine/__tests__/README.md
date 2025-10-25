# Umbra Tests

This directory contains Vitest tests for the Umbra color system.

## Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

### Color Mixing Tests (`engine/primitives/__tests__/color.test.ts`)

Tests for the color mixing functions:
- Standard RGB/LAB mixing (`colorMix`)
- HSL-based mixing with independent channel control (`colorMixHSL`)
- Relative value support (`+=` and `-=`)
- HSL circular hue interpolation
- Saturation and lightness clamping

### Generator Tests (`engine/__tests__/generator.test.ts`)

Tests for the color scale generator:
- Basic interpolation from background to foreground
- Color stop interpolation (multiple segments)
- Relative values (`+=`, `-=`)
- Object syntax with independent HSL channels
- Position reset at color stops
- Accent color generation

## Test Coverage

The tests cover:
- ✅ Absolute color positioning (e.g., `40` = 40% from start to end)
- ✅ Relative color positioning (e.g., `"+=20"` = add 20% to current position)
- ✅ Color stops (hex strings in the range)
- ✅ Independent HSL channel control
- ✅ Circular hue interpolation
- ✅ Multi-segment color scales with stops

## Adding New Tests

When adding new features:
1. Create test files in `__tests__` directories near the code being tested
2. Use descriptive `describe` and `it` blocks
3. Test edge cases (empty ranges, extreme values, etc.)
4. Verify both success cases and error handling

## Notes

- Color mixing uses LAB color space by default, which may produce slightly different lightness values than HSL
- Tests use reasonable tolerances for color comparisons due to color space conversions
- The generator interpolates between consecutive color stops, not always from background to foreground
