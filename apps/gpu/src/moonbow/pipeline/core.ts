import { bufferVertexLayout } from '../geometry/utils'
import { getStencil } from '../render/utils'
import { getBindGroupLayout, getUniformEntries, getResourceLayout } from './entries'
import type { ResourceBinding } from '../buffers/textures'
import type { GetMemory, MoonbowBuffers } from '../'

function memoryLayout<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(memory: GetMemory<U, S, B>) {
  const target = memory.target
  const uniforms = memory.uniforms ? Object.values(memory.uniforms) : []
  const storage = memory.storage ? Object.values(memory.storage) : []
  const resources: ResourceBinding[] = (memory as any).resources || []

  const uniformEntries = getUniformEntries({ device: target.device, uniforms })
  const storageEntries = getUniformEntries({ device: target.device, uniforms: storage || [] })
  // Build a combined layout that also includes texture/sampler resources if present
  const bufferLayoutEntries = [...uniformEntries, ...storageEntries]
  const resourceLayoutEntries = resources.map((res, idx) => {
    const binding = res.binding ?? bufferLayoutEntries.length + idx
    const visibility = res.visibility || GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
    if (res.resourceType === 'texture') {
      return {
        binding,
        visibility,
        texture: { sampleType: res.textureSampleType || ('float' as GPUTextureSampleType) }
      }
    }
    return { binding, visibility, sampler: {} as GPUSamplerBindingLayout }
  })

  const layout = resourceLayoutEntries.length
    ? getResourceLayout(target.device, [
        ...bufferLayoutEntries.map((entry) => ({
          binding: entry.binding,
          visibility: entry.visibility,
          buffer: entry.buffer
        })),
        ...resourceLayoutEntries
      ])
    : getBindGroupLayout(target.device, bufferLayoutEntries)

  return { target, layout, uniformEntries, storageEntries, resources, bufferLayoutEntries }
}

export function pipelineCore<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(memory: GetMemory<U, S, B>) {
  const memLay = memoryLayout(memory)

  const pipelineLayout = memLay.target.device.createPipelineLayout({
    label: 'Moonbow Pipeline Layout',
    bindGroupLayouts: [memLay.layout]
  })

  const shaderModule = memLay.target.device.createShaderModule({
    label: 'Moonbow Shader module',
    code: memory.shader || ''
  })

  const pipeline = memLay.target.device.createRenderPipeline({
    label: 'Moonbow Render pipeline',
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: 'vertexMain',
      buffers: memory.model ? bufferVertexLayout() : undefined
    },
    fragment: {
      module: shaderModule,
      entryPoint: 'fragmentMain',
      targets: [{ format: memLay.target.format }]
    },
    depthStencil: getStencil(memory.depthStencil),
    primitive: {
      topology: memory.wireframe ? 'line-list' : 'triangle-list',
      cullMode: (memory as any).cullMode || 'back',
      frontFace: (memory as any).frontFace || 'ccw'
    }
  })

  // This is where we attach the uniform to the shader through the pipeline
  const bindGroup: BindGroup<U, S, B> = (
    callback?: ({ uniformEntries, storageEntries }: typeof memLay) => Iterable<GPUBindGroupEntry>
  ) => {
    // Build resource entries for textures/samplers
    const baseEntries = callback
      ? [...callback(memLay)]
      : [...memLay.uniformEntries, ...memLay.storageEntries]
    const textureEntries = memLay.resources.map((res, idx) => {
      const binding = res.binding ?? memLay.bufferLayoutEntries.length + idx
      if (res.resourceType === 'texture') return { binding, resource: res.view as GPUTextureView }
      return { binding, resource: res.sampler as GPUSampler }
    })

    return memLay.target.device.createBindGroup({
      label: 'Moonbow bindgroup',
      layout: memLay.layout,
      entries: [...baseEntries, ...textureEntries]
    })
  }

  return {
    pipeline,
    pipelineLayout,
    model: memory.model,
    target: memLay.target,
    layout: memLay.layout,
    uniformEntries: memLay.uniformEntries,
    storageEntries: memLay.storageEntries,
    bindGroup,
    // No explicit destroy on pipeline objects in WebGPU spec yet; rely on GC.
    // Expose a placeholder for symmetry allowing higher-level dispose patterns.
    dispose: () => {
      // Future: release resources like render bundles, custom caches.
    }
  }
}

export type BindGroup<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
> = (
  callback?: ({
    uniformEntries,
    storageEntries
  }: ReturnType<typeof memoryLayout<U, S, B>>) => Iterable<GPUBindGroupEntry>
) => GPUBindGroup

export type BindGroups<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
> = (bindGroup: BindGroup<U, S, B>) => B | [GPUBindGroup]

export type PipelineCore = ReturnType<typeof pipelineCore>
