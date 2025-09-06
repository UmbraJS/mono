<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '../shaders/bubbles.wgsl'
import { uTime, float, gpuCamera, useMoonbow, useGPU, cube, uniformBuffer } from '../moonbow'

function surface(device: GPUDevice) {
  const resolution = 1
  const size: [number, number, number] = [1.6, 1.6, 0.05]
  const geom = cube(device, { size, resolution, position: [0, 0, 0] })
  function render(pass: GPURenderPassEncoder) {
    geom.setOptions(pass, { rotation: [0.0, 0.0, 0] })
  }
  return { render }
}

onMounted(async () => {
  const { device } = await useGPU()
  const time = uTime(device)
  const intensity = float(device, [0.1])

  // Params uniform buffer packing: keep order matching WGSL struct.
  // Allocate 80 bytes (>=72, 16-byte aligned) for safety.
  const params = uniformBuffer(device, {
    label: 'Bubble Params',
    size: 80,
    update: (buffer) => {
      const view = new DataView(new ArrayBuffer(80))
      let o = 0
      const writeF32 = (v: number) => {
        view.setFloat32(o, v, true)
        o += 4
      }
      const writeU32 = (v: number) => {
        view.setUint32(o, v, true)
        o += 4
      }
      // resolution
      writeF32(700) // width
      writeF32(700) // height
      // time (filled later each frame by rewriting just this region maybe, but ok initial 0)
      writeF32(0)
      // seed
      writeF32(Math.random() * 1000)
      // numBubbles (u32)
      writeU32(140)
      writeF32(0.065) // baseRadius
      writeF32(0.8) // radiusJitter
      writeF32(0.02) // edgeSoftness
      writeF32(3.0) // noiseScale
      writeF32(0.06) // warpAmount
      writeF32(0.5) // fbmGain
      writeF32(2.1) // fbmLacunarity
      writeU32(4) // fbmOctaves
      writeF32(0.045) // refractStrength
      writeF32(0.92) // bubbleOpacity
      writeF32(0) // _pad.x
      writeF32(0) // _pad.y
      device.queue.writeBuffer(buffer, 0, new Uint8Array(view.buffer))
    }
  })

  const model = surface(device)

  const moon = await useMoonbow({
    device,
    shader: shader,
    canvas: document.querySelector('canvas#one') as HTMLCanvasElement,
    model: true,
    depthStencil: false,
    uniforms: ({ target }) => ({
      time: time,
      intensity: intensity,
      camera: gpuCamera(target),
      params: params
    })
  })

  // Update time & params time field each frame (~60fps)
  let tAccum = 0
  // advance the separate uTime buffer
  time.update && time.update()
  tAccum += 0.016 // approx seconds per frame
  const timeOffset = 8 // after vec2 resolution
  const tArr = new Float32Array([tAccum])
  device.queue.writeBuffer(params.buffer, timeOffset, tArr)

  moon.frame(({ renderPass }) => model.render(renderPass))
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="one" width="700" height="700"></canvas>
    <h1>Bubbles</h1>
  </div>
  <h1 class="display">WebGPU</h1>
</template>
