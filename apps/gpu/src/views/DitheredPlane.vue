<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
// @ts-ignore
import shader from '@/shaders/ditheredPlane.wgsl'
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

const levelsVal = ref(3)
const monoOn = ref(true)
const contrastVal = ref(0.54)
const postContrastVal = ref(6.69)
const postBlackVal = ref(0.208)
const postGammaVal = ref(2.88)
const ditherScaleVal = ref(3.0)
// Simple RGB picker values [0..1]
const monoR = ref(0.81)
const monoG = ref(0.8)
const monoB = ref(0.81)

onMounted(async () => {
  const { device } = await useGPU()

  const time = uTime(device)
  // Use intensity as number of levels (e.g. 6 levels)
  const levels = float(device, [levelsVal.value])
  // u32-like flag in a f32 buffer (we can use float buffer here since our uniforms helper writes f32)
  const monoEnabled = float(device, [0.0])
  // vec4 color (rgb + pad)
  const monoColor = float(device, [monoR.value, monoG.value, monoB.value, 1.0])
  const contrast = float(device, [contrastVal.value])
  const postContrast = float(device, [postContrastVal.value])
  const postBlack = float(device, [postBlackVal.value])
  const postGamma = float(device, [postGammaVal.value])
  const ditherScale = float(device, [ditherScaleVal.value])

  // Explicitly set uniform bindings to match shader @binding indices
  // Shader expects: time=0, intensity=1, view=2, texture=3, sampler=4, monoEnabled=5, monoColor=6
  time.binding = 0
  levels.binding = 1
  monoEnabled.binding = 5
  monoColor.binding = 6
  contrast.binding = 7
  postContrast.binding = 8
  postBlack.binding = 9
  postGamma.binding = 10
  ditherScale.binding = 11

  const model = plane(device, { resolution: [1, 1, 1], size: [1, 1.4, 1] })

  const tex = await createTextureFromUrl(device, '/sam2.jpg')
  const view = tex.createView()
  const sampler = samplerBinding(device)

  const moon = await useMoonbow({
    device,
    shader,
    canvas: document.querySelector('canvas#dither') as HTMLCanvasElement,
    model: true,
    depthStencil: true,
    cullMode: 'none',
    uniforms: ({ target }) => {
      const viewBuf = gpuCamera(target)
      viewBuf.binding = 2
      return {
        time,
        intensity: levels,
        view: viewBuf,
        // Bindings 5 and 6 used in shader
        monoEnabled,
        monoColor,
        contrast,
        postContrast,
        postBlack,
        postGamma,
        ditherScale
      }
    },
    resources: () => [textureBinding({ view, binding: 3 }), { ...sampler, binding: 4 }]
  })

  moon.animate(({ frame }) => {
    frame(({ renderPass, uniforms }) => {
      model.setOptions(renderPass, { rotation: [0, 0, 0], position: [0, 0, 0] })
      uniforms.time?.update()
      // Adjust camera to fit plane well
      uniforms.view?.update({ position: [0, 0, 5], target: [0, 0, 0], rotation: [0, 0, 0] })
    })
  })

  // Update the levels uniform when slider changes
  const writeLevels = (val: number) => {
    device.queue.writeBuffer(levels.buffer, 0, new Float32Array([val]))
  }
  // Initialize (float already wrote once, but keep consistent)
  writeLevels(levelsVal.value)
  watch(levelsVal, (v) => writeLevels(v))

  // Update contrast uniform
  const writeContrast = (val: number) => {
    device.queue.writeBuffer(contrast.buffer, 0, new Float32Array([val]))
  }
  writeContrast(contrastVal.value)
  watch(contrastVal, (v) => writeContrast(v))

  // Update post-contrast uniform
  const writePostContrast = (val: number) => {
    device.queue.writeBuffer(postContrast.buffer, 0, new Float32Array([val]))
  }
  writePostContrast(postContrastVal.value)
  watch(postContrastVal, (v) => writePostContrast(v))

  // Update post-black and post-gamma uniforms
  const writePostBlack = (val: number) => {
    device.queue.writeBuffer(postBlack.buffer, 0, new Float32Array([val]))
  }
  const writePostGamma = (val: number) => {
    device.queue.writeBuffer(postGamma.buffer, 0, new Float32Array([val]))
  }
  writePostBlack(postBlackVal.value)
  writePostGamma(postGammaVal.value)
  watch(postBlackVal, (v) => writePostBlack(v))
  watch(postGammaVal, (v) => writePostGamma(v))

  // Update dither scale uniform
  const writeDitherScale = (val: number) => {
    device.queue.writeBuffer(ditherScale.buffer, 0, new Float32Array([val]))
  }
  writeDitherScale(ditherScaleVal.value)
  watch(ditherScaleVal, (v) => writeDitherScale(v))

  // Update monochrome uniforms
  const writeMonoEnabled = (on: boolean) => {
    device.queue.writeBuffer(monoEnabled.buffer, 0, new Float32Array([on ? 1.0 : 0.0]))
  }
  const writeMonoColor = () => {
    device.queue.writeBuffer(
      monoColor.buffer,
      0,
      new Float32Array([monoR.value, monoG.value, monoB.value, 1.0])
    )
  }
  writeMonoEnabled(monoOn.value)
  writeMonoColor()
  watch(monoOn, (v) => writeMonoEnabled(v))
  watch([monoR, monoG, monoB], () => writeMonoColor())
})
</script>

<template>
  <div class="dither-layout">
    <div class="canvas-col">
      <canvas id="dither" width="700" height="700"></canvas>
    </div>
    <aside class="controls-col">
      <h1>Dithered Plane</h1>
      <div class="control">
        <label for="levels">Levels</label>
        <input id="levels" type="range" min="2" max="16" step="1" v-model.number="levelsVal" />
        <span class="value">{{ levelsVal }}</span>
      </div>
      <div class="control">
        <label for="contrast">Pre Contrast</label>
        <input
          id="contrast"
          type="range"
          min="0"
          max="3"
          step="0.01"
          v-model.number="contrastVal"
        />
        <span class="value">{{ contrastVal.toFixed(2) }}</span>
      </div>
      <div class="control inline">
        <label> <input type="checkbox" v-model="monoOn" /> Monochrome </label>
      </div>
      <template v-if="monoOn">
        <div class="control">
          <label for="postContrast">Post Contrast</label>
          <input
            id="postContrast"
            type="range"
            min="0"
            max="10"
            step="0.01"
            v-model.number="postContrastVal"
          />
          <span class="value">{{ postContrastVal.toFixed(2) }}</span>
        </div>
        <div class="control">
          <label for="postBlack">Post Black</label>
          <input
            id="postBlack"
            type="range"
            min="0"
            max="1"
            step="0.001"
            v-model.number="postBlackVal"
          />
          <span class="value">{{ postBlackVal.toFixed(3) }}</span>
        </div>
        <div class="control">
          <label for="postGamma">Post Gamma</label>
          <input
            id="postGamma"
            type="range"
            min="0.1"
            max="4"
            step="0.01"
            v-model.number="postGammaVal"
          />
          <span class="value">{{ postGammaVal.toFixed(2) }}</span>
        </div>
        <div class="control">
          <label for="ditherSize">Dither Size</label>
          <input
            id="ditherSize"
            type="range"
            min="1"
            max="64"
            step="1"
            v-model.number="ditherScaleVal"
          />
          <span class="value">{{ ditherScaleVal }}</span>
        </div>
        <div class="group">
          <div class="control">
            <label>R</label>
            <input type="range" min="0" max="1" step="0.01" v-model.number="monoR" />
            <span class="value">{{ monoR.toFixed(2) }}</span>
          </div>
          <div class="control">
            <label>G</label>
            <input type="range" min="0" max="1" step="0.01" v-model.number="monoG" />
            <span class="value">{{ monoG.toFixed(2) }}</span>
          </div>
          <div class="control">
            <label>B</label>
            <input type="range" min="0" max="1" step="0.01" v-model.number="monoB" />
            <span class="value">{{ monoB.toFixed(2) }}</span>
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.dither-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.canvas-col {
  flex: 1 1 auto;
}
.controls-col {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
}
.control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.control > label {
  width: 110px;
}
.control.inline > label {
  width: auto;
}
.control input[type='range'] {
  flex: 1 1 auto;
}
.group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.value {
  width: 56px;
  text-align: right;
  opacity: 0.8;
}
</style>
