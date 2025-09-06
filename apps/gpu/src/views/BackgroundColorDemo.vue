<script lang="ts" setup>
// @ts-ignore
import shader from '../shaders/shader.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { onMounted, ref } from 'vue'
import { spinningCube } from '../scenes/spinningCube'
import {
  uTime,
  float,
  gpuCamera,
  useGPU,
  getMemory,
  createMultiShaderPipelines,
  BackgroundColors,
  type BackgroundColor
} from '../moonbow'

// Reactive background color selection
const selectedColor = ref<string>('default')
const customColor = ref<string>('#FF5733')

// Available background color options
const colorOptions = [
  { key: 'default', label: 'Default Blue', color: BackgroundColors.default },
  { key: 'black', label: 'Black', color: BackgroundColors.black },
  { key: 'white', label: 'White', color: BackgroundColors.white },
  { key: 'darkGray', label: 'Dark Gray', color: BackgroundColors.darkGray },
  { key: 'deepBlue', label: 'Deep Blue', color: BackgroundColors.deepBlue },
  { key: 'forestGreen', label: 'Forest Green', color: BackgroundColors.forestGreen },
  { key: 'warmBrown', label: 'Warm Brown', color: BackgroundColors.warmBrown },
  { key: 'filmNoir', label: 'Film Noir', color: BackgroundColors.filmNoir },
  { key: 'goldHour', label: 'Gold Hour', color: BackgroundColors.goldHour },
  { key: 'sunset', label: 'Sunset', color: BackgroundColors.sunset },
  { key: 'ocean', label: 'Ocean', color: BackgroundColors.ocean },
  { key: 'custom', label: 'Custom Color', color: null }
]

let multiShader: any = null

onMounted(async () => {
  const { device } = await useGPU()

  const model1 = spinningCube(device)
  const model2 = spinningCube(device)

  const time = uTime(device)
  const intensity = float(device, [0.2])

  // Create shared memory
  const memory = await getMemory({
    device,
    canvas: document.querySelector('canvas#background') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create initial multi-shader pipelines
  updateBackground()

  // Watch for background color changes
  function updateBackground() {
    const currentColor = selectedColor.value
    let backgroundColor: BackgroundColor

    if (currentColor === 'custom') {
      backgroundColor = customColor.value
    } else {
      const colorOption = colorOptions.find((opt) => opt.key === currentColor)
      backgroundColor = colorOption?.color || BackgroundColors.default
    }

    // Create new multi-shader pipelines with updated background
    multiShader = createMultiShaderPipelines(
      memory,
      {
        gradient: shader,
        basic: basic
      },
      {
        backgroundColor
      }
    )
  }

  // Update background when selection changes
  function onColorChange() {
    updateBackground()
  }

  // Make functions available to template
  ;(window as any).onColorChange = onColorChange
  ;(window as any).updateBackground = updateBackground

  let rotation = 0
  function render() {
    rotation += 0.002

    // Update uniforms
    time.update()
    intensity.update()

    // Render with current background color
    if (multiShader) {
      multiShader.multiFrame([
        {
          pipeline: 'gradient',
          renderFunction: (renderPass: any) => {
            model1.render(renderPass, rotation, -1.5)
          }
        },
        {
          pipeline: 'basic',
          renderFunction: (renderPass: any) => {
            model2.render(renderPass, rotation, 1.5)
          }
        }
      ])
    }

    requestAnimationFrame(render)
  }

  render()
})

// Handle color selection changes
function handleColorChange(event: Event) {
  const target = event.target as HTMLSelectElement
  selectedColor.value = target.value
  ;(window as any).onColorChange?.()
}

function handleCustomColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  customColor.value = target.value
  if (selectedColor.value === 'custom') {
    ;(window as any).updateBackground?.()
  }
}
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="background" width="700" height="700"></canvas>
    <h1>Background</h1>

    <div class="controls">
      <div class="control-group">
        <label for="colorSelect">Background Color:</label>
        <select id="colorSelect" :value="selectedColor" @change="handleColorChange">
          <option v-for="option in colorOptions" :key="option.key" :value="option.key">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="control-group" v-if="selectedColor === 'custom'">
        <label for="customColor">Custom Color:</label>
        <input
          id="customColor"
          type="color"
          :value="customColor"
          @change="handleCustomColorChange"
        />
        <span class="color-preview" :style="{ backgroundColor: customColor }"></span>
      </div>
    </div>

    <div class="info">
      <p>
        <strong>Background Color API supports:</strong><br />
        • Named colors: <code>"red"</code>, <code>"blue"</code>, <code>"black"</code><br />
        • Hex colors: <code>"#FF5733"</code>, <code>"#RGB"</code>, <code>"#RRGGBB"</code><br />
        • RGB values: <code>[1.0, 0.5, 0.0]</code> (0-1 range)<br />
        • RGBA objects: <code>{ r: 1.0, g: 0.5, b: 0.0, a: 1.0 }</code><br />
        • Built-in presets: <code>BackgroundColors.sunset</code>
      </p>
    </div>
  </div>
  <h1 class="display">WebGPU</h1>
</template>

<style scoped>
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.display {
  text-align: center;
  margin-top: 2rem;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  min-width: 300px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: bold;
  min-width: 120px;
}

.control-group select,
.control-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.color-preview {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: inline-block;
}

.info {
  max-width: 600px;
  text-align: left;
}

.info p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

code {
  background: #e8e8e8;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}
</style>
