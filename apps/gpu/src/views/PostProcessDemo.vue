<script lang="ts" setup>
// @ts-ignore
import shader from '../shaders/shader.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
// @ts-ignore
import postprocess from '../shaders/postprocess.wgsl'
import { onMounted } from 'vue'
import { spinningCube } from '../scenes/spinningCube'
import {
  uTime,
  float,
  gpuCamera,
  useGPU,
  getMemory,
  createMultiShaderPipelines,
  createPostProcessPipeline
} from '../moonbow'

onMounted(async () => {
  const { device } = await useGPU()

  const model1 = spinningCube(device)
  const model2 = spinningCube(device)

  const time = uTime(device)
  const intensity = float(device, [0.3]) // Higher intensity for chromatic aberration

  // Create shared memory that all pipelines will use
  const memory = await getMemory({
    device,
    canvas: document.querySelector('canvas#postprocess') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create multiple pipelines with different shaders for the scene
  const multiShader = createMultiShaderPipelines(memory, {
    gradient: shader,
    basic: basic
  })

  // Create post-processing pipeline
  const postProcess = createPostProcessPipeline(memory, multiShader.pipelines, {
    postProcessShader: postprocess
  })

  let rotation = 0
  setInterval(() => {
    rotation += 0.002

    // Update uniforms
    time.update()
    intensity.update()

    // Render scene with post-processing effects
    postProcess.renderWithPostProcess([
      {
        pipeline: 'gradient',
        renderFunction: (renderPass) => {
          model1.render(renderPass, rotation, -1.5)
        }
      },
      {
        pipeline: 'basic',
        renderFunction: (renderPass) => {
          model2.render(renderPass, rotation, 1.5)
        }
      }
    ])
  }, 1000 / 60)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="postprocess" width="700" height="700"></canvas>
    <h1>Post-Processing Demo</h1>
    <p>
      Scene rendered with multiple shaders, then post-processed with:<br />
      • Vignette effect<br />
      • Color grading/tint<br />
      • Contrast adjustment<br />
      • Chromatic aberration
    </p>
  </div>
  <h1 class="display">WebGPU Multi-Shader + Post-Processing</h1>
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
  max-width: 500px;
  line-height: 1.4;
}
</style>
