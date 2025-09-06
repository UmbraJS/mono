<template>
  <div class="container">
    <h1>Cube vs Plane API Comparison</h1>
    <div class="canvas-container">
      <div class="canvas-wrapper">
        <canvas id="cubeCanvas" width="400" height="400"></canvas>
        <h3>Cube Geometry</h3>
        <p>Using cube(device, options)</p>
      </div>
      <div class="canvas-wrapper">
        <canvas id="planeCanvas" width="400" height="400"></canvas>
        <h3>Plane Geometry</h3>
        <p>Using plane(device, options)</p>
      </div>
    </div>
    <div class="controls">
      <label>
        Resolution:
        <input v-model.number="resolution" type="range" min="1" max="5" step="1" />
        {{ resolution }}
      </label>
      <label>
        Rotation X:
        <input v-model.number="rotationX" type="range" min="0" max="6.28" step="0.1" />
        {{ rotationX.toFixed(1) }}
      </label>
      <label>
        Rotation Y:
        <input v-model.number="rotationY" type="range" min="0" max="6.28" step="0.1" />
        {{ rotationY.toFixed(1) }}
      </label>
      <label>
        Size:
        <input v-model.number="size" type="range" min="0.3" max="2" step="0.1" />
        {{ size.toFixed(1) }}
      </label>
    </div>
    <div class="api-info">
      <h3>API Usage</h3>
      <div class="code-examples">
        <div class="code-example">
          <h4>Cube</h4>
          <pre><code>const cubeModel = cube(device, {
  resolution: {{ resolution }},
  rotation: [{{ rotationX.toFixed(1) }}, {{ rotationY.toFixed(1) }}, 0],
  size: {{ size.toFixed(1) }}
})</code></pre>
        </div>
        <div class="code-example">
          <h4>Plane</h4>
          <pre><code>const planeModel = plane(device, {
  resolution: {{ resolution }},
  rotation: [{{ rotationX.toFixed(1) }}, {{ rotationY.toFixed(1) }}, 0],
  size: {{ size.toFixed(1) }}
})</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useGPU, cube, plane, gpuCamera, getMemory, gpuPipeline, uTime, float } from '@/moonbow'

const resolution = ref(2)
const rotationX = ref(0.3)
const rotationY = ref(0.5)
const size = ref(1)

let device: GPUDevice
let cubeModel: any
let planeModel: any
let cubePipeline: any
let planePipeline: any
let cubeMemory: any
let planeMemory: any

onMounted(async () => {
  await initWebGPU()
  animate()
})

async function initWebGPU() {
  const { device: gpuDevice } = await useGPU()
  device = gpuDevice

  // Create models
  cubeModel = cube(device, {
    resolution: resolution.value,
    rotation: [rotationX.value, rotationY.value, 0],
    size: size.value
  })

  planeModel = plane(device, {
    resolution: resolution.value,
    rotation: [rotationX.value, rotationY.value, 0],
    size: size.value
  })

  const time = uTime(device)
  const intensity = float(device, [0.1])

  // Create memory for cube
  cubeMemory = await getMemory({
    device,
    canvas: document.querySelector('canvas#cubeCanvas') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create memory for plane
  planeMemory = await getMemory({
    device,
    canvas: document.querySelector('canvas#planeCanvas') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create pipelines
  cubePipeline = gpuPipeline(cubeMemory, {
    shader: `
      @vertex
      fn vertexMain(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
        return vec4<f32>(position * 0.5, 1.0);
      }
      
      @fragment
      fn fragmentMain() -> @location(0) vec4<f32> {
        return vec4<f32>(0.9, 0.3, 0.3, 1.0);
      }
    `
  })

  planePipeline = gpuPipeline(planeMemory, {
    shader: `
      @vertex
      fn vertexMain(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
        return vec4<f32>(position * 0.5, 1.0);
      }
      
      @fragment
      fn fragmentMain() -> @location(0) vec4<f32> {
        return vec4<f32>(0.3, 0.6, 0.9, 1.0);
      }
    `
  })
}

function animate() {
  if (cubeMemory && cubePipeline && cubeModel) {
    // Update cube with current settings
    cubeModel.buffer.update({
      resolution: resolution.value,
      rotation: [rotationX.value, rotationY.value, 0],
      size: size.value
    })

    // Render cube
    const cubeCommandEncoder = device.createCommandEncoder({ label: 'Cube Render Command Encoder' })

    const cubeRenderPassDescriptor: GPURenderPassDescriptor = {
      label: 'Cube Render Pass',
      colorAttachments: [
        {
          view: cubeMemory.target.context.getCurrentTexture().createView(),
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    }

    const cubeRenderPass = cubeCommandEncoder.beginRenderPass(cubeRenderPassDescriptor)

    // Set pipeline and bind groups
    const cubeBindGroups = cubeMemory.bindGroups(cubePipeline.core.bindGroup)
    cubeRenderPass.setPipeline(cubePipeline.core.pipeline)
    cubeRenderPass.setBindGroup(0, cubeBindGroups[0])

    // Render the cube
    cubeModel.bufferModel(cubeRenderPass)
    cubeModel.drawModel(cubeRenderPass)

    cubeRenderPass.end()
    device.queue.submit([cubeCommandEncoder.finish()])
  }

  if (planeMemory && planePipeline && planeModel) {
    // Update plane with current settings
    planeModel.buffer.update({
      resolution: resolution.value,
      rotation: [rotationX.value, rotationY.value, 0],
      size: size.value
    })

    // Render plane
    const planeCommandEncoder = device.createCommandEncoder({
      label: 'Plane Render Command Encoder'
    })

    const planeRenderPassDescriptor: GPURenderPassDescriptor = {
      label: 'Plane Render Pass',
      colorAttachments: [
        {
          view: planeMemory.target.context.getCurrentTexture().createView(),
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    }

    const planeRenderPass = planeCommandEncoder.beginRenderPass(planeRenderPassDescriptor)

    // Set pipeline and bind groups
    const planeBindGroups = planeMemory.bindGroups(planePipeline.core.bindGroup)
    planeRenderPass.setPipeline(planePipeline.core.pipeline)
    planeRenderPass.setBindGroup(0, planeBindGroups[0])

    // Render the plane
    planeModel.bufferModel(planeRenderPass)
    planeModel.drawModel(planeRenderPass)

    planeRenderPass.end()
    device.queue.submit([planeCommandEncoder.finish()])
  }

  requestAnimationFrame(animate)
}

// Watch for changes to update the geometries
watch([resolution, rotationX, rotationY, size], () => {
  // The models will be updated in the next animation frame
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.canvas-container {
  display: flex;
  gap: 20px;
  margin: 20px 0;
  justify-content: center;
}

.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

input[type='range'] {
  flex: 1;
}

.api-info {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.code-examples {
  display: flex;
  gap: 20px;
  margin-top: 15px;
}

.code-example {
  flex: 1;
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
}

.code-example h4 {
  margin: 0 0 10px 0;
  color: #63b3ed;
}

.code-example pre {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.code-example code {
  color: #e2e8f0;
}

h3 {
  color: #2d3748;
  margin: 10px 0;
}

p {
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0;
}
</style>
