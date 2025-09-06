# TODO:

- [x] Plane position
- [x] Plane UV
- [x] Plane Mutability
- [x] Cube
- [x] Multiple Planes
- [ ] Other Shapes
- [ ] DOM Sync
- [ ] Proxy Objects
- [ ] Vue Integration for Proxy Objects
- [x] TS Conversion
- [ ] Scroll Hook
- [ ] Mouse Hook
- [ ] Image Plane
- [ ] Video Plane
- [ ] Bend Plane
- [x] Deform Gradient Plane
- [ ] WGSL Bomber
- [ ] Tension Shader
- [ ] Post Processing
- [ ] Compute Shaders
- [ ] Frame Buffer Tools

# Future Considerations:

- Lights
- VR
- Models
- Animations (gsap?)
- Timeline (gsap?)
- Groups
- Many Models Performance (instanced)
- Materials
- Physics
- Particles
- Audio
- HMR

# Inspiration

## Quick Start (Scene API)

Minimal example combining multi-shader pipelines with optional post-processing using the high-level Scene helper.

```ts
import { getMemory, createScene, cube, uTime, gpuCamera } from 'moonbow'

// 1. Acquire memory (device + canvas + user uniforms)
const canvas = document.querySelector('canvas')!
const memory = await getMemory({
  canvas,
  shader: '', // base placeholder when using multi-shader; each pipeline provides its own
  model: true,
  uniforms: ({ device }) => ({
    time: uTime(device, 0.5),
    camera: gpuCamera(device) // assuming gpuCamera exported
  })
})

// 2. Define WGSL shaders (vertexMain / fragmentMain entry points required)
import basicWGSL from './shaders/basic.wgsl?raw'
import altWGSL from './shaders/gradient.wgsl?raw'
import postWGSL from './shaders/postprocessFlexible.wgsl?raw'

// 3. Create scene (multi-shader + optional post-process)
const scene = createScene({
  memory,
  shaders: [
    { label: 'basic', shader: basicWGSL },
    { label: 'alt', shader: altWGSL }
  ],
  postProcess: {
    postProcessShader: postWGSL
  }
})

// 4. Render frame: supply render calls referencing pipeline label or index
function frame() {
  // Update dynamic uniforms before rendering
  Object.values(memory.uniforms).forEach((u) => u.update())
  scene.render([
    {
      pipeline: 'basic',
      renderFunction: (pass) => {
        // Example draw call (matching geometry bound in shader); adapt as needed
        pass.draw(36) // 36 vertices for a cube if using built-in attribute logic
      }
    }
  ])
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

// 5. Handle resize
window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth * devicePixelRatio
  canvas.height = canvas.clientHeight * devicePixelRatio
  scene.resize()
})

// 6. Cleanup when removing scene (SPA route change, etc.)
// scene.dispose()
```

Key methods:

- `scene.render(calls)` – multi-pipeline render (with post-processing if configured)
- `scene.resize()` – revalidates depth & offscreen targets
- `scene.dispose()` – destroys cached textures & underlying pipelines

Uniform Management Tips:

- Call each uniform's `update()` per frame if time-varying.
- Use `pipeline.updateAllBuffers()` when working directly with a single pipeline instance.

Post-Processing:

- Provide your own WGSL via `postProcessShader` or use `createAutoPostProcessPipeline` indirectly via `postProcess: { auto: true }` (see code for generation behavior).

- [usegpu](usegpu.live/)
- [athena](athena.js.org)
- [three](threejs.org/docs/)
- [babyloon](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Meshes/Builders/planeBuilder.ts)
- [shadergradient](https://www.shadergradient.co/)
- [samples](https://webgpu.github.io/webgpu-samples/?sample=rotatingCube#main.ts)
- [orillusion](https://orillusion.github.io/orillusion-webgpu-samples/#cubesRenderBundle)
- [fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [tres](https://tresjs.org/)

# Resources

- [orillusion](https://www.youtube.com/watch?v=9O2of-IjJos&list=PLVHfUzm5DIVCZxjmaZsBXEXoohzSqeCnV&index=10)
- [performance](https://webgpufundamentals.org/webgpu/lessons/webgpu-timing.html)
- [google](https://thewebshowcase.withgoogle.com/render-heavy-graphics-in-the-browser)
- [codelab](https://codelabs.developers.google.com/your-first-webgpu-app#0)
- [caniuse](https://caniuse.com/webgpu)
- [surma](https://surma.dev/things/webgpu/)
- [metal](https://devlog.hexops.com/2021/mach-engine-the-future-of-graphics-with-zig/)
- [CIS 565 GPU Programming](https://www.youtube.com/watch?v=41pC1MLMVdA)
- [vulkan](https://docs.google.com/presentation/d/1AUfD0xq5GG3SwIoG8JricAzhpHnmTt90MMl-TodWXxU/edit#slide=id.g1617b7e08ed_0_2)
- [firebase](https://www.youtube.com/watch?v=r5NQecwZs1A)
- [architecture](https://www.intel.com/content/www/us/en/docs/oneapi/optimization-guide-gpu/2023-0/sycl-thread-mapping-and-gpu-occupancy.html)
- [best webgl intro](https://www.youtube.com/watch?v=f4s1h2YETNY&t=20s)
- [bookofshaders](https://thebookofshaders.com/)

# Factoids

- 24 cores is the current upper limit for CPU due to exponential heat mangagment and complexity: M2 Ultra, I9 Intel
- RTX 4080 has 9700 cores
- TPU (Tensor GPU) vs DPU (data CPU) vs QPU (bits vs cubits)

- "Despite the core’s frequency, getting data from memory (or pixels from textures) still takes relatively long — Fabian says it takes a couple hundred clock cycles. These couple hundred cycles could be spent on computation instead. To make use of these otherwise idle cycles, each EU is heavily oversubscribed with work. Whenever an EU would end up idling (e.g. to wait for a value from memory), it instead switches to another work item and will only switch back once the new work item needs to wait for something. This is the key trick how GPUs optimize for throughput at the cost of latency: Individual work items will take longer as a switch to another work item might stop execution for longer than necessary, but the overall utilization is higher and results in a higher throughput. The GPU strives to always have work queued up to keep EUs busy at all times." - [source](https://surma.dev/things/webgpu/)

# History

- [tweet](https://x.com/MorkSamuel/status/1777250185791312119)
- [stackblitz shoutout of v1](https://x.com/stackblitz/status/1792935768664527274)
