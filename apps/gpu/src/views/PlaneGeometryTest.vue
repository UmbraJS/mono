<template>
  <div class="container">
    <h1>Plane Geometry Test</h1>
    <canvas id="gpuCanvas" width="800" height="600"></canvas>
    <div class="controls">
      <label>
        Resolution:
        <input v-model.number="resolution" type="range" min="1" max="10" step="1" />
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
        <input v-model.number="size" type="range" min="0.1" max="3" step="0.1" />
        {{ size.toFixed(1) }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useGPU, plane, gpuCamera, getMemory, gpuPipeline, uTime, float } from '@/moonbow'

const resolution = ref(1)
const rotationX = ref(0)
const rotationY = ref(0.5)
const size = ref(1)

let device: GPUDevice
let planeModel: any
let pipeline: any
let memory: any
let animationId: number

onMounted(async () => {
  await initWebGPU()
  animate()
})

async function initWebGPU() {
  const { device: gpuDevice } = await useGPU()
  device = gpuDevice

  // Create plane model
  planeModel = plane(device, {
    resolution: resolution.value,
    rotation: [rotationX.value, rotationY.value, 0],
    size: size.value
  })

  const time = uTime(device)
  const intensity = float(device, [0.1])

  // Create memory
  memory = await getMemory({
    device,
    canvas: document.querySelector('canvas#gpuCanvas') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  // Create pipeline
  pipeline = gpuPipeline(memory, {
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
  if (memory && pipeline && planeModel) {
    // Update plane with current settings
    planeModel.buffer.update({
      resolution: resolution.value,
      rotation: [rotationX.value, rotationY.value, 0],
      size: size.value
    })

    // Create render pass
    const commandEncoder = device.createCommandEncoder({ label: 'Plane Render Command Encoder' })

    const renderPassDescriptor: GPURenderPassDescriptor = {
      label: 'Plane Render Pass',
      colorAttachments: [
        {
          view: memory.target.context.getCurrentTexture().createView(),
          clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    }

    const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor)

    // Set pipeline and bind groups
    const bindGroups = memory.bindGroups(pipeline.core.bindGroup)
    renderPass.setPipeline(pipeline.core.pipeline)
    renderPass.setBindGroup(0, bindGroups[0])

    // Render the plane
    planeModel.bufferModel(renderPass)
    planeModel.drawModel(renderPass)

    renderPass.end()
    device.queue.submit([commandEncoder.finish()])
  }

  animationId = requestAnimationFrame(animate)
}

// Watch for changes to update the plane
watch([resolution, rotationX, rotationY, size], () => {
  if (planeModel) {
    // The plane will be updated in the next animation frame
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
}

canvas {
  border: 1px solid #ccc;
  display: block;
  margin: 20px 0;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
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
</style>
