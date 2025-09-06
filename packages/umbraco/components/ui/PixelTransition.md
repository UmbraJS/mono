# PixelTransition Component

A Vue component that creates a pixelated transition effect between two pieces of content. Originally converted from a React component.

## Features

- Smooth pixelated transition animation using GSAP
- Touch device support with click interaction
- Desktop hover interaction
- Customizable grid size and pixel color
- Flexible content slots for any type of content including images
- TypeScript support

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `firstContent` | `string` | `undefined` | Fallback content for the default slot |
| `secondContent` | `string` | `undefined` | Fallback content for the active slot |
| `gridSize` | `number` | `7` | Size of the pixel grid (gridSize x gridSize) |
| `pixelColor` | `string` | `'currentColor'` | Color of the transition pixels |
| `animationStepDuration` | `number` | `0.3` | Duration of each animation step in seconds |
| `className` | `string` | `''` | Additional CSS class |
| `style` | `object` | `{}` | Inline styles |
| `aspectRatio` | `string` | `'100%'` | Aspect ratio for the container |

## Slots

- **default**: Content shown initially (receives `{ isActive }` scope)
- **active**: Content shown on hover/click (receives `{ isActive }` scope)

## Usage Examples

### Basic Usage with Images

```vue
<template>
  <PixelTransition
    :grid-size="10"
    pixel-color="#ff6b6b"
    :animation-step-duration="0.5"
    aspect-ratio="56.25%"
  >
    <template #default>
      <img src="/image1.jpg" alt="Default image" />
    </template>
    <template #active>
      <img src="/image2.jpg" alt="Active image" />
    </template>
  </PixelTransition>
</template>
```

### With NuxtImg (when used in a Nuxt app)

```vue
<template>
  <PixelTransition
    :grid-size="8"
    pixel-color="rgba(255, 255, 255, 0.8)"
    aspect-ratio="75%"
  >
    <template #default>
      <NuxtImg
        src="/images/default.jpg"
        alt="Default image"
        loading="lazy"
        :style="{ width: '100%', height: '100%', objectFit: 'cover' }"
      />
    </template>
    <template #active>
      <NuxtImg
        src="/images/hover.jpg"
        alt="Hover image"
        loading="lazy"
        :style="{ width: '100%', height: '100%', objectFit: 'cover' }"
      />
    </template>
  </PixelTransition>
</template>
```

### With Text Content

```vue
<template>
  <PixelTransition
    :grid-size="5"
    pixel-color="#333"
    class="text-transition"
  >
    <template #default>
      <div class="content">
        <h3>Hover me!</h3>
        <p>This is the default content.</p>
      </div>
    </template>
    <template #active>
      <div class="content active">
        <h3>Active!</h3>
        <p>This content appears on hover.</p>
      </div>
    </template>
  </PixelTransition>
</template>
```

### Using Fallback Props

```vue
<template>
  <PixelTransition
    first-content="Default Text"
    second-content="Active Text"
    :grid-size="6"
  />
</template>
```

### Accessing State in Slots

```vue
<template>
  <PixelTransition>
    <template #default="{ isActive }">
      <div :class="{ dimmed: isActive }">
        Default content
      </div>
    </template>
    <template #active="{ isActive }">
      <div :class="{ bright: isActive }">
        Active content
      </div>
    </template>
  </PixelTransition>
</template>
```

## Styling

The component includes basic styles, but you can customize it further:

```scss
.pixelated-image-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &__default,
  &__active {
    border-radius: inherit;
  }
}
```

## Dependencies

- Vue 3
- GSAP (for animations)

## Notes

- The component automatically detects touch devices and switches between hover and click interactions
- On desktop: hover to activate, leave to deactivate
- On touch devices: click to toggle
- The pixel grid is recreated when `gridSize` or `pixelColor` props change
- Content in slots receives `isActive` as scoped slot data for additional control
