<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '../shaders/marble.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { uTime, float, gpuCamera, useMoonbow, useGPU, cube } from '../moonbow'

function surface(device: GPUDevice) {
  const resolution = 1
  const size: [number, number, number] = [1.6, 1.6, 0.05]

  const middlePlank = cube(device, {
    size,
    resolution,
    position: [0, 0, 0]
  })

  function render(pass: GPURenderPassEncoder) {
    middlePlank.setOptions(pass, { rotation: [0.0, 0.0, 0] })
  }

  return { render }
}

onMounted(async () => {
  const { device } = await useGPU()

  const time = uTime(device)
  const intensity = float(device, [0.1])

  const model = surface(device)

  const moon = await useMoonbow({
    device,
    shader: shader,
    canvas: document.querySelector('canvas#one') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time: time,
      intensity: intensity,
      camera: gpuCamera(target)
    })
  })

  const moon2 = await useMoonbow({
    device,
    shader: basic,
    canvas: document.querySelector('canvas#two') as HTMLCanvasElement,
    model: true,
    uniforms: ({ target }) => ({
      time: time,
      intensity: intensity,
      camera: gpuCamera(target)
    })
  })

  setInterval(() => {
    moon.frame(({ renderPass }) => {
      model.render(renderPass)
    })

    moon2.frame(({ renderPass }) => {
      model.render(renderPass)
    })
  }, 1000 / 60)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="one" width="700" height="700"></canvas>
    <canvas id="two" width="700" height="700"></canvas>
    <h1>Marbles</h1>
  </div>
  <h1 class="display">WebGPU</h1>
</template>
