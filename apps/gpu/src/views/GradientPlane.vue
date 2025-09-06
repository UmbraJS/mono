<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '../shaders/gradient.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { uTime, float, gpuCamera, useMoonbow, useGPU, cube } from '../moonbow'

function spinningPlank(device: GPUDevice) {
  const resolution = 30
  const size: [number, number, number] = [2.5, 2.5, 0.05]

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

  const model = spinningPlank(device)

  const moon = await useMoonbow({
    device,
    shader: shader,
    canvas: document.querySelector('canvas#one') as HTMLCanvasElement,
    model: true,
    wireframe: true,
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
    moon.frame(({ renderPass, uniforms }) => {
      model.render(renderPass)
      uniforms.time?.update()
      uniforms.camera?.update({
        rotation: [0.1, 0.0, 0],
        position: [0.0, 0.0, 4],
        target: [0.0, 0.0, 0]
      })
    })

    moon2.frame(({ renderPass, uniforms }) => {
      model.render(renderPass)
      uniforms.time?.update()
    })
  }, 1000 / 120)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="one" width="700" height="700"></canvas>
    <canvas id="two" width="700" height="700"></canvas>
    <h1>Northern Lights</h1>
  </div>
  <h1 class="display">WebGPU</h1>
</template>
