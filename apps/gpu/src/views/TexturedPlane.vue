<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '@/shaders/texturedPlane.wgsl'
import {
  useGPU,
  useMoonbow,
  gpuCamera,
  plane,
  uTime,
  float,
  createTextureFromUrl,
  textureBinding,
  samplerBinding
} from '@/moonbow'

onMounted(async () => {
  const { device } = await useGPU()

  const time = uTime(device)
  const intensity = float(device, [1.0])

  // Create model (plane already contains uv)
  const model = plane(device, { size: [2.0, 2.0, 1.0], resolution: [1, 1, 1] })

  // Load texture and prepare bindings
  const tex = await createTextureFromUrl(device, '/australia.jpg')
  const view = tex.createView()
  const sampler = samplerBinding(device)

  const moon = await useMoonbow({
    device,
    shader,
    canvas: document.querySelector('canvas#tex') as HTMLCanvasElement,
    model: true,
    depthStencil: true,
    cullMode: 'none',
    uniforms: ({ target }) => ({
      time,
      intensity,
      view: gpuCamera(target)
    }),
    // Add texture + sampler as resources in the same bind group
    resources: () => [textureBinding({ view, binding: 3 }), { ...sampler, binding: 4 }]
  })

  moon.animate(({ frame }) => {
    frame(({ renderPass, uniforms }) => {
      model.setOptions(renderPass, {
        rotation: [0, 0, 0],
        size: [2.0, 2.0, 1.0],
        position: [0, 0, 0]
      })
      uniforms.time?.update()
      uniforms.view?.update({ position: [0, 0, 7.2], target: [0, 0, 0], rotation: [0, 0, 0] })
    })
  })
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="tex" width="700" height="700"></canvas>
    <h1>Textured Plane</h1>
  </div>
</template>
