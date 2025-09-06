<template>
  <div class="fluid-container">
    <h1>Fluid Cursor WebGPU</h1>
    <canvas ref="canvasRef" class="fluid-canvas" width="800" height="600"></canvas>

    <div class="controls">
      <h3>Fluid Parameters</h3>
      <div class="control-group">
        <label>
          Splat Radius: {{ config.SPLAT_RADIUS.toFixed(2) }}
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            v-model.number="config.SPLAT_RADIUS"
          />
        </label>

        <label>
          Splat Force: {{ config.SPLAT_FORCE.toFixed(0) }}
          <input
            type="range"
            min="1000"
            max="10000"
            step="100"
            v-model.number="config.SPLAT_FORCE"
          />
        </label>

        <label>
          Color Update Speed: {{ config.COLOR_UPDATE_SPEED.toFixed(1) }}
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            v-model.number="config.COLOR_UPDATE_SPEED"
          />
        </label>

        <label>
          Density Dissipation: {{ config.DENSITY_DISSIPATION.toFixed(2) }}
          <input
            type="range"
            min="0.9"
            max="1.0"
            step="0.001"
            v-model.number="config.DENSITY_DISSIPATION"
          />
        </label>

        <label>
          Velocity Dissipation: {{ config.VELOCITY_DISSIPATION.toFixed(2) }}
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            v-model.number="config.VELOCITY_DISSIPATION"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useGPU, gpuCanvas } from '../moonbow'

// @ts-ignore
import FluidDisplayShader from '../shaders/fluidDisplay.wgsl'
// @ts-ignore
import FluidSplatShader from '../shaders/fluidSplat.wgsl'
// @ts-ignore
import FluidAdvectionShader from '../shaders/fluidAdvection.wgsl'
// @ts-ignore
import FluidDivergenceShader from '../shaders/fluidDivergence.wgsl'
// @ts-ignore
import FluidPressureShader from '../shaders/fluidPressure.wgsl'
// @ts-ignore
import FluidGradientShader from '../shaders/fluidGradient.wgsl'
// @ts-ignore
import FluidCurlShader from '../shaders/fluidCurl.wgsl'
// @ts-ignore
import FluidVorticityShader from '../shaders/fluidVorticity.wgsl'

interface ColorRGB {
  r: number
  g: number
  b: number
}

interface FluidConfig {
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  COLOR_UPDATE_SPEED: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  CURL: number
  PRESSURE_ITERATIONS: number
}

interface Pointer {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  color: ColorRGB
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

const config = reactive<FluidConfig>({
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
  COLOR_UPDATE_SPEED: 10,
  DENSITY_DISSIPATION: 1.0,
  VELOCITY_DISSIPATION: 0.2,
  PRESSURE: 0.8,
  CURL: 30,
  PRESSURE_ITERATIONS: 20
})

function pointerPrototype(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 }
  }
}

function generateColor(): ColorRGB {
  const hue = Math.random()
  const saturation = 0.8
  const value = 0.9
  return HSVtoRGB(hue, saturation, value)
}

function HSVtoRGB(h: number, s: number, v: number): ColorRGB {
  let r = 0,
    g = 0,
    b = 0
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }
  return { r, g, b }
}

onMounted(async () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const { device } = await useGPU()
  const target = gpuCanvas(device, canvas)

  const textureSize = 512
  const aspectRatio = canvas.width / canvas.height

  // Create textures for fluid simulation
  const createTexture = (
    usage: GPUTextureUsageFlags = GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.RENDER_ATTACHMENT
  ) => {
    return device.createTexture({
      size: [textureSize, textureSize],
      format: 'rgba16float',
      usage
    })
  }

  // Ping-pong textures for fluid simulation
  const velocityTextures = [createTexture(), createTexture()]
  const densityTextures = [createTexture(), createTexture()]
  const pressureTextures = [createTexture(), createTexture()]
  const divergenceTexture = createTexture()
  const curlTexture = createTexture()

  // Initialize textures with clear color
  const initCommandEncoder = device.createCommandEncoder()

  // Clear all textures
  const texturesToClear = [
    ...velocityTextures,
    ...densityTextures,
    ...pressureTextures,
    divergenceTexture,
    curlTexture
  ]

  for (const texture of texturesToClear) {
    const pass = initCommandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: texture.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })
    pass.end()
  }

  device.queue.submit([initCommandEncoder.finish()])

  // Create sampler
  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge'
  })

  // Create uniform buffers
  const splatUniformBuffer = device.createBuffer({
    size: 16, // 1 vec4
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const splatUniformBuffer2 = device.createBuffer({
    size: 16, // 1 vec4
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const configUniformBuffer = device.createBuffer({
    size: 16, // 1 vec4
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const fluidUniformBuffer = device.createBuffer({
    size: 32, // 2 vec4s for more fluid parameters
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  const timeUniformBuffer = device.createBuffer({
    size: 16, // 1 vec4
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  })

  // Create render pipelines
  const createPipeline = (shader: string, format: GPUTextureFormat = 'rgba16float') => {
    return device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({ code: shader }),
        entryPoint: 'vs_main'
      },
      fragment: {
        module: device.createShaderModule({ code: shader }),
        entryPoint: 'fs_main',
        targets: [{ format }]
      },
      primitive: {
        topology: 'triangle-list'
      }
    })
  }

  const displayPipeline = createPipeline(FluidDisplayShader, target.format)
  const splatPipeline = createPipeline(FluidSplatShader)
  const advectionPipeline = createPipeline(FluidAdvectionShader)
  const divergencePipeline = createPipeline(FluidDivergenceShader)
  const pressurePipeline = createPipeline(FluidPressureShader)
  const gradientPipeline = createPipeline(FluidGradientShader)
  const curlPipeline = createPipeline(FluidCurlShader)
  const vorticityPipeline = createPipeline(FluidVorticityShader)

  // Create bind group helper
  const createBindGroup = (pipeline: GPURenderPipeline, resources: GPUBindingResource[]) => {
    const layout = pipeline.getBindGroupLayout(0)
    const entries = resources.map((resource, index) => ({
      binding: index,
      resource
    }))
    return device.createBindGroup({
      layout,
      entries
    })
  }

  let pointers: Pointer[] = [pointerPrototype()]
  let colorUpdateTimer = 0
  let lastTime = performance.now()
  let currentVelocity = 0
  let currentDensity = 0
  let currentPressure = 0

  function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
    if (!canvas) return
    pointer.id = id
    pointer.down = true
    pointer.moved = false
    pointer.texcoordX = posX / canvas.width
    pointer.texcoordY = 1.0 - posY / canvas.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.color = generateColor()
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
    if (!canvas) return
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / canvas.width
    pointer.texcoordY = 1.0 - posY / canvas.height
    pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX
    pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
  }

  function splatPointer(pointer: Pointer) {
    if (!pointer.moved || !pointer.down) return

    const commandEncoder = device.createCommandEncoder()

    // Update splat uniform data
    const splatData1 = new Float32Array([
      pointer.texcoordX,
      pointer.texcoordY,
      pointer.color.r,
      pointer.color.g
    ])
    const splatData2 = new Float32Array([
      pointer.color.b,
      config.SPLAT_RADIUS,
      aspectRatio,
      config.SPLAT_FORCE
    ])

    device.queue.writeBuffer(splatUniformBuffer, 0, splatData1)
    device.queue.writeBuffer(splatUniformBuffer2, 0, splatData2)

    // Splat velocity
    const velocityBindGroup = createBindGroup(splatPipeline, [
      { buffer: splatUniformBuffer },
      { buffer: splatUniformBuffer2 },
      velocityTextures[currentVelocity].createView(),
      sampler
    ])

    const velocityPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: velocityTextures[1 - currentVelocity].createView(),
          loadOp: 'load',
          storeOp: 'store'
        }
      ]
    })

    velocityPass.setPipeline(splatPipeline)
    velocityPass.setBindGroup(0, velocityBindGroup)
    velocityPass.draw(3)
    velocityPass.end()

    // Splat density
    const densityBindGroup = createBindGroup(splatPipeline, [
      { buffer: splatUniformBuffer },
      { buffer: splatUniformBuffer2 },
      densityTextures[currentDensity].createView(),
      sampler
    ])

    const densityPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: densityTextures[1 - currentDensity].createView(),
          loadOp: 'load',
          storeOp: 'store'
        }
      ]
    })

    densityPass.setPipeline(splatPipeline)
    densityPass.setBindGroup(0, densityBindGroup)
    densityPass.draw(3)
    densityPass.end()

    device.queue.submit([commandEncoder.finish()])

    // Swap textures
    currentVelocity = 1 - currentVelocity
    currentDensity = 1 - currentDensity
  }

  function simulateFluid(dt: number) {
    const commandEncoder = device.createCommandEncoder()

    // Update fluid uniforms
    const fluidParams = new Float32Array([
      dt,
      config.VELOCITY_DISSIPATION,
      config.DENSITY_DISSIPATION,
      config.PRESSURE,
      config.CURL,
      1.0 / textureSize,
      aspectRatio,
      0.0
    ])
    device.queue.writeBuffer(fluidUniformBuffer, 0, fluidParams)

    // 1. Advection - move velocity and density with the flow
    // Advect velocity
    const velocityAdvectionBindGroup = createBindGroup(advectionPipeline, [
      { buffer: fluidUniformBuffer },
      velocityTextures[currentVelocity].createView(),
      velocityTextures[currentVelocity].createView(),
      sampler
    ])

    const velocityAdvectionPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: velocityTextures[1 - currentVelocity].createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })

    velocityAdvectionPass.setPipeline(advectionPipeline)
    velocityAdvectionPass.setBindGroup(0, velocityAdvectionBindGroup)
    velocityAdvectionPass.draw(3)
    velocityAdvectionPass.end()

    currentVelocity = 1 - currentVelocity

    // Advect density
    const densityAdvectionBindGroup = createBindGroup(advectionPipeline, [
      { buffer: fluidUniformBuffer },
      velocityTextures[currentVelocity].createView(),
      densityTextures[currentDensity].createView(),
      sampler
    ])

    const densityAdvectionPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: densityTextures[1 - currentDensity].createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })

    densityAdvectionPass.setPipeline(advectionPipeline)
    densityAdvectionPass.setBindGroup(0, densityAdvectionBindGroup)
    densityAdvectionPass.draw(3)
    densityAdvectionPass.end()

    currentDensity = 1 - currentDensity

    // 2. Compute divergence
    const divergenceBindGroup = createBindGroup(divergencePipeline, [
      { buffer: fluidUniformBuffer },
      velocityTextures[currentVelocity].createView(),
      sampler
    ])

    const divergencePass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: divergenceTexture.createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })

    divergencePass.setPipeline(divergencePipeline)
    divergencePass.setBindGroup(0, divergenceBindGroup)
    divergencePass.draw(3)
    divergencePass.end()

    // 3. Solve pressure (Jacobi iterations)
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      const pressureBindGroup = createBindGroup(pressurePipeline, [
        { buffer: fluidUniformBuffer },
        pressureTextures[currentPressure].createView(),
        divergenceTexture.createView(),
        sampler
      ])

      const pressurePass = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: pressureTextures[1 - currentPressure].createView(),
            loadOp: 'clear',
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            storeOp: 'store'
          }
        ]
      })

      pressurePass.setPipeline(pressurePipeline)
      pressurePass.setBindGroup(0, pressureBindGroup)
      pressurePass.draw(3)
      pressurePass.end()

      currentPressure = 1 - currentPressure
    }

    // 4. Subtract pressure gradient
    const gradientBindGroup = createBindGroup(gradientPipeline, [
      { buffer: fluidUniformBuffer },
      velocityTextures[currentVelocity].createView(),
      pressureTextures[currentPressure].createView(),
      sampler
    ])

    const gradientPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: velocityTextures[1 - currentVelocity].createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })

    gradientPass.setPipeline(gradientPipeline)
    gradientPass.setBindGroup(0, gradientBindGroup)
    gradientPass.draw(3)
    gradientPass.end()

    currentVelocity = 1 - currentVelocity

    device.queue.submit([commandEncoder.finish()])
  }

  function render() {
    const currentTime = performance.now()
    const dt = Math.min((currentTime - lastTime) / 1000, 0.016666)
    lastTime = currentTime

    // Update color
    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer -= 1
      pointers.forEach((p) => {
        if (!p.down) {
          p.color = generateColor()
        }
      })
    }

    // Apply mouse/touch input
    pointers.forEach((pointer) => {
      if (pointer.moved) {
        splatPointer(pointer)
        pointer.moved = false
      }
    })

    // Run fluid simulation
    simulateFluid(dt)

    // Render to screen
    const commandEncoder = device.createCommandEncoder()

    const displayBindGroup = createBindGroup(displayPipeline, [
      densityTextures[currentDensity].createView(),
      sampler
    ])

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: target.context.getCurrentTexture().createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          storeOp: 'store'
        }
      ]
    })

    renderPass.setPipeline(displayPipeline)
    renderPass.setBindGroup(0, displayBindGroup)
    renderPass.draw(3)
    renderPass.end()

    device.queue.submit([commandEncoder.finish()])
    requestAnimationFrame(render)
  }

  // Resize canvas to match display size
  function resizeCanvas() {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Mouse event handlers
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    updatePointerDownData(pointers[0], -1, x, y)
  })

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    updatePointerMoveData(pointers[0], x, y)
  })

  canvas.addEventListener('mouseup', () => {
    pointers[0].down = false
  })

  canvas.addEventListener('mouseleave', () => {
    pointers[0].down = false
  })

  // Touch event handlers
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    updatePointerDownData(pointers[0], touch.identifier, x, y)
  })

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    updatePointerMoveData(pointers[0], x, y)
  })

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault()
    pointers[0].down = false
  })

  // Start the render loop
  render()
})
</script>

<style scoped>
.fluid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background: #000;
  color: #fff;
}

.fluid-canvas {
  border: 1px solid #333;
  cursor: crosshair;
  background: #000;
}

.controls {
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.control-group label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group input[type='range'] {
  width: 100%;
}

h1 {
  margin-bottom: 20px;
  font-size: 2em;
  text-align: center;
}

h3 {
  margin: 0 0 10px 0;
  text-align: center;
}
</style>
