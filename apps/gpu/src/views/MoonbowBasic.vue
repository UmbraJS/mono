<script lang="ts" setup>
// @ts-ignore
import shader from '../shaders/shader.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { onMounted } from 'vue'
import { spinningCube } from '../scenes/spinningCube'
import { uTime, float, gpuCamera, useGPU, getMemory, createMultiShaderPipelines } from '../moonbow'

onMounted(async () => {
  const { device } = await useGPU()

  const model1 = spinningCube(device)
  const model2 = spinningCube(device)

  const time = uTime(device)
  const intensity = float(device, [0.1])

  // Create shared memory that all pipelines will use
  const memory = await getMemory({
    device,
    canvas: document.querySelector('canvas#one') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create multiple pipelines with different shaders
  const multiShader = createMultiShaderPipelines(memory, {
    gradient: shader,
    basic: basic
  })

  let rotation = 0
  setInterval(() => {
    rotation += 0.002

    // Render both models with different shaders in a single frame
    multiShader.multiFrame([
      {
        pipeline: 'gradient',
        renderFunction: (renderPass) => {
          model1.render(renderPass, rotation, -1)
        }
      },
      {
        pipeline: 'basic',
        renderFunction: (renderPass) => {
          model2.render(renderPass, rotation, 2)
        }
      }
    ])
  }, 1000 / 60)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="one" width="700" height="700"></canvas>
    <h1>Multi-Shader Demo</h1>
    <p>Left cube uses gradient shader, right cube uses basic shader</p>
  </div>
  <h1 class="display">WebGPU Multi-Shader</h1>
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

p {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  max-width: 400px;
}
</style>
