# Umbra Components

This directory contains interactive components for testing and demonstrating Umbra color system features.

## Components

### Core Umbra Components

#### `EditUmbra.vue`
Interactive color editor that allows you to:
- Adjust background, foreground, and accent colors using color pickers
- Configure minimum readability settings with a slider
- Apply theme changes to the page
- View generated token lists (vertical or horizontal layout)

**Props:**
- `showTokens` (boolean, default: true) - Show token lists
- `showHorizontal` (boolean, default: false) - Use horizontal layout for tokens

#### `UmbraApplied.vue`
Theme switcher component featuring:
- 6 preset themes (Starfish, Sunset, Forest + light variants)
- Visual theme previews with accent color gradients
- Click to apply themes instantly
- Scoped theme application to individual buttons

#### `UmbraAppliedToElement.vue`
Visual annotation component that:
- Shows a button styled with Umbra tokens
- Displays spline connectors linking elements to their CSS variable names
- Demonstrates how Umbra tokens are applied to real elements

### Supporting Components

#### `ColorLayer.vue`
Displays a vertical list of color tokens with:
- Main color swatch
- 12 range tokens (10-120)
- Text color swatch
- Optional section helpers (background/middleground/foreground)

#### `ColorLayerHorizontal.vue`
Displays a horizontal strip of color swatches for quick visual reference.

#### `TokenRow.vue`
Individual token display showing:
- CSS variable name
- Color value
- Color swatch

### Utility Components

#### `DyePicker.vue`
Color picker wrapper using `@umbrajs/dye` package.

## Usage Examples

```vue
<!-- Basic theme editor -->
<EditUmbra :show-tokens="true" />

<!-- Theme editor with horizontal layout -->
<EditUmbra :show-horizontal="true" />

<!-- Theme switcher -->
<UmbraApplied />

<!-- Element annotation demo -->
<UmbraAppliedToElement />
```

## Dependencies

- `@umbrajs/core` - Core Umbra color system
- `@umbrajs/dye` - Color picker component
- `@nobel/bifrost` - Spline generation for visual annotations
- `umbraco` - UI components (Button, Slider)
