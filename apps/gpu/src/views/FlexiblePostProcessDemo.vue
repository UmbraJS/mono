<script lang="ts" setup>
// @ts-ignore
import shader from '../shaders/shader.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { onMounted } from 'vue'
import { spinningCube } from '../scenes/spinningCube'
import {
  uTime,
  float,
  gpuCamera,
  useGPU,
  getMemory,
  createMultiShaderPipelines,
  createAutoPostProcessPipeline
} from '../moonbow'

onMounted(async () => {
  const { device } = await useGPU()

  const model1 = spinningCube(device)
  const model2 = spinningCube(device)

  // Try different uniforms to test flexibility
  const time = uTime(device)
  const intensity = float(device, [0.3])
  const scale = float(device, [1.2])
  const customParam = float(device, [0.5])

  // Create memory with custom uniforms
  const memory = await getMemory({
    device,
    canvas: document.querySelector('canvas#flexible') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      scale,
      customParam,
      camera: gpuCamera(target)
    })
  })

  // Create multiple pipelines for the scene
  const multiShader = createMultiShaderPipelines(memory, {
    gradient: shader,
    basic: basic
  })

  // Create auto post-processing with custom effects
  const customEffects = `
    // Custom post-processing effects using dynamic uniforms
    let timeF = f32(time) * 0.001;
    let scaleFactor = scale;
    let customIntensity = customParam;
    
    // 1. Animated vignette
    let center = vec2f(0.5, 0.5);
    let dist = distance(uv, center);
    let vignetteStrength = 0.3 + sin(timeF) * 0.1;
    let vignette = 1.0 - smoothstep(vignetteStrength, 0.8, dist);
    
    // 2. Color shifting based on custom params
    let colorShift = vec3f(
        1.0 + sin(timeF * customIntensity) * 0.2,
        1.0 + sin(timeF * customIntensity * 1.3) * 0.2,
        1.0 + sin(timeF * customIntensity * 1.7) * 0.2
    );
    
    // 3. Dynamic contrast
    let contrast = scaleFactor;
    color = vec4f((color.rgb - 0.5) * contrast + 0.5, color.a);
    
    // 4. Apply all effects
    color = vec4f(color.rgb * colorShift * vignette, color.a);
    
    // 5. Chromatic aberration with animated intensity
    let aberration = intensity * (0.01 + sin(timeF * 2.0) * 0.005);
    let r = textureSample(sceneTexture, sceneSampler, uv + vec2f(aberration, 0.0)).r;
    let g = textureSample(sceneTexture, sceneSampler, uv).g;
    let b = textureSample(sceneTexture, sceneSampler, uv - vec2f(aberration, 0.0)).b;
    
    color = vec4f(vec3f(r, g, b) * colorShift * vignette, color.a);
  `

  const postProcess = createAutoPostProcessPipeline(memory, multiShader.pipelines, customEffects)

  let rotation = 0
  setInterval(() => {
    rotation += 0.002

    // Update all uniforms
    time.update()
    intensity.update()
    scale.update()
    customParam.update()

    // Render scene with flexible post-processing
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
    <canvas id="flexible" width="700" height="700"></canvas>
    <h1>Flexible Post-Processing Demo</h1>
    <p>
      This demo uses <strong>automatic post-processing generation</strong> that works with any
      uniforms:<br />
      • <code>time</code> - Animated timing<br />
      • <code>intensity</code> - Effect intensity<br />
      • <code>scale</code> - Contrast scaling<br />
      • <code>customParam</code> - Custom parameter<br />
      • <code>camera</code> - View matrix<br /><br />

      The post-processing shader is <strong>automatically generated</strong> with correct binding
      indices!
    </p>
  </div>
  <h1 class="display">WebGPU Flexible Post-Processing</h1>
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
  max-width: 600px;
  line-height: 1.4;
}

code {
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
</style>
