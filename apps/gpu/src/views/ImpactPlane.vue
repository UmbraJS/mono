<script setup lang="ts">
// @ts-ignore
import shaderSource from '../shaders/impact.wgsl'
import { useTemplateRef, onMounted } from 'vue'
import { useMoonbow, fTime } from '../moonbow'

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
onMounted(async () => {
  const moon = await useMoonbow({
    canvas: canvasRef.value,
    shader: shaderSource,
    model: false,
    depthStencil: false,
    wireframe: false,
    uniforms: ({ device }) => ({ time: fTime(device) })
  })

  setInterval(() => {
    moon.frame(({ renderPass, uniforms }) => {
      renderPass.draw(3, 1, 0, 0)
      uniforms?.time?.update()
    })
  }, 1000 / 60)
})
</script>

<template>
  <div>
    <canvas ref="canvasRef" width="800" height="600" />
  </div>
</template>
