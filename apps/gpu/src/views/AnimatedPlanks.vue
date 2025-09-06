<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '../shaders/shader.wgsl'
// @ts-ignore
import basic from '../shaders/basic.wgsl'
import { spinningPlanks } from '../scenes/spinningPlanks'
import { uTime, float, gpuCamera, useMoonbow, useGPU } from '../moonbow'

onMounted(async () => {
  const { device } = await useGPU()

  const time = uTime(device)
  const intensity = float(device, [0.1])

  const model = spinningPlanks(device)

  const moon = await useMoonbow({
    device,
    shader: shader,
    canvas: document.querySelector('canvas#one') as HTMLCanvasElement,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  const moon2 = await useMoonbow({
    device,
    shader: basic,
    canvas: document.querySelector('canvas#two') as HTMLCanvasElement,
    uniforms: ({ target }) => ({
      time,
      intensity,
      camera: gpuCamera(target)
    })
  })

  let rotation = 0
  setInterval(() => {
    moon.frame(({ renderPass }) => model.render(renderPass, rotation))
    moon2.frame(({ renderPass }) => model.render(renderPass, rotation))
    rotation += 0.05
  }, 30)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="one" width="700" height="700"></canvas>
    <canvas id="two" width="700" height="700"></canvas>
    <h1>Animation</h1>
  </div>
  <h1 class="display">WebGPU</h1>
</template>
