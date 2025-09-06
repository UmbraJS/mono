<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// @ts-ignore
import passA from '../shaders/bubblesPassA.wgsl'
// @ts-ignore
import passBlur from '../shaders/bubblesPassBlur.wgsl'
// @ts-ignore
import passB from '../shaders/bubblesPassB.wgsl'
import { useGPU } from '../moonbow'

const playing = ref(true)

onMounted(async () => {
  const { device } = await useGPU()
  const canvas = document.querySelector('canvas#bubbles-mp') as HTMLCanvasElement
  const context = canvas.getContext('webgpu')!
  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({ device, format })

  const fullW = canvas.width
  const fullH = canvas.height
  const halfW = Math.floor(fullW / 2)
  const halfH = Math.floor(fullH / 2)

  const texUsage =
    GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
  // Use rgba16float because single-channel 16-bit float is not allowed for storage binding in WebGPU; we only use .r
  const heightA = device.createTexture({
    size: [halfW, halfH],
    format: 'rgba16float',
    usage: texUsage
  })
  const heightB = device.createTexture({
    size: [halfW, halfH],
    format: 'rgba16float',
    usage: texUsage
  })

  const samplerLinear = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge'
  })

  const pipeA = device.createComputePipeline({
    layout: 'auto',
    compute: { module: device.createShaderModule({ code: passA }), entryPoint: 'csMain' }
  })
  const pipeBlur = device.createComputePipeline({
    layout: 'auto',
    compute: { module: device.createShaderModule({ code: passBlur }), entryPoint: 'csBlur' }
  })
  const pipeB = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module: device.createShaderModule({ code: passB }), entryPoint: 'vs' },
    fragment: {
      module: device.createShaderModule({ code: passB }),
      entryPoint: 'fs',
      targets: [{ format }]
    }
  })

  // Uniform buffers
  // ParamsA has 10 scalars (tightly packed for now); align to 16 bytes multiple if needed by backend
  const paSize = 4 * 12
  const pa = device.createBuffer({
    size: paSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const blurParamSize = 4 * 6 // size(2) + dir(2) + radius + dilate
  const blurH = device.createBuffer({
    size: blurParamSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })
  const blurV = device.createBuffer({
    size: blurParamSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const pbSize = 4 * 8
  const pb = device.createBuffer({
    size: pbSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  function writeStatic() {
    // Pass B params
    device.queue.writeBuffer(pb, 0, new Float32Array([fullW, fullH, 0.08, 0.01, 1.0, 0]))
  }
  writeStatic()

  const bgA = device.createBindGroup({
    layout: pipeA.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: pa } },
      { binding: 1, resource: heightA.createView() }
    ]
  })
  const bgBlurH = device.createBindGroup({
    layout: pipeBlur.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: blurH } },
      { binding: 1, resource: heightA.createView() },
      { binding: 2, resource: heightB.createView() },
      { binding: 3, resource: samplerLinear }
    ]
  })
  const bgBlurV = device.createBindGroup({
    layout: pipeBlur.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: blurV } },
      { binding: 1, resource: heightB.createView() },
      { binding: 2, resource: heightA.createView() },
      { binding: 3, resource: samplerLinear }
    ]
  })
  const bgB = device.createBindGroup({
    layout: pipeB.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: pb } },
      { binding: 1, resource: heightA.createView() },
      { binding: 2, resource: samplerLinear }
    ]
  })

  let t = 0
  function frame() {
    if (!playing.value) return
    t += 0.016

    // Pass A uniforms
    const numBubbles = 140
    const baseRadius = 0.055
    const radiusJitter = 0.85
    const edgeWarp = 0.06
    const curvatureMin = 0.9
    const curvatureMax = 1.5
    const seed = 3.14159
    // order: size.xy, time, seed, numBubbles, baseRadius, radiusJitter, edgeWarp, curvatureMin, curvatureMax
    const paData = new Float32Array([
      halfW,
      halfH,
      t,
      seed,
      numBubbles,
      baseRadius,
      radiusJitter,
      edgeWarp,
      curvatureMin,
      curvatureMax
    ])
    device.queue.writeBuffer(pa, 0, paData)

    // Blur parameters (H then V)
    const radius = 5
    const dilate = 0.25
    device.queue.writeBuffer(blurH, 0, new Float32Array([halfW, halfH, 1, 0, radius, dilate]))
    device.queue.writeBuffer(blurV, 0, new Float32Array([halfW, halfH, 0, 1, radius, 0]))

    const encoder = device.createCommandEncoder()
    // Pass A
    {
      const c = encoder.beginComputePass()
      c.setPipeline(pipeA)
      c.setBindGroup(0, bgA)
      c.dispatchWorkgroups(Math.ceil(halfW / 8), Math.ceil(halfH / 8))
      c.end()
    }
    // Blur H
    {
      const c = encoder.beginComputePass()
      c.setPipeline(pipeBlur)
      c.setBindGroup(0, bgBlurH)
      c.dispatchWorkgroups(Math.ceil(halfW / 8), Math.ceil(halfH / 8))
      c.end()
    }
    // Blur V
    {
      const c = encoder.beginComputePass()
      c.setPipeline(pipeBlur)
      c.setBindGroup(0, bgBlurV)
      c.dispatchWorkgroups(Math.ceil(halfW / 8), Math.ceil(halfH / 8))
      c.end()
    }
    // Pass B render
    {
      const view = context.getCurrentTexture().createView()
      const rp = encoder.beginRenderPass({
        colorAttachments: [
          { view, loadOp: 'clear', storeOp: 'store', clearValue: { r: 0, g: 0, b: 0, a: 1 } }
        ]
      })
      rp.setPipeline(pipeB)
      rp.setBindGroup(0, bgB)
      rp.draw(3, 1, 0, 0)
      rp.end()
    }

    device.queue.submit([encoder.finish()])
    requestAnimationFrame(frame)
  }
  frame()
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="bubbles-mp" width="700" height="700"></canvas>
    <h1>Multi-Pass Bubbles</h1>
  </div>
</template>
