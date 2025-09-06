<script lang="ts" setup>
import { onMounted } from 'vue'
// @ts-ignore
import shader from '../shaders/bubblesFullscreen.wgsl'
import { useMoonbow, useGPU } from '../moonbow'

onMounted(async () => {
  const { device } = await useGPU()
  const moon = await useMoonbow({
    device,
    shader,
    canvas: document.querySelector('canvas#bubble-fs') as HTMLCanvasElement,
    model: false, // fullscreen triangle path (no vertex buffers)
    uniforms: () => ({})
  })

  // Simple animation loop using rAF via animate helper if needed; here we just redraw.
  moon.loop(() => {
    moon.frame(() => {})
  }, 1000 / 60)
})
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="bubble-fs" width="700" height="700"></canvas>
    <h1>Fullscreen Bubbles</h1>
  </div>
</template>
