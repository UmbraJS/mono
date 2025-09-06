import { useGPU, gpuCanvas } from './'
import type { MoonbowBuffers, MoonbowOptions, BindGroup } from './'
import type { ResourceBinding } from './buffers/textures'

/**
 * Gets a device and lets the user allocate uniform/storage buffers to the memory on it. Also assembles the options and assigns the defaults.
 */
export async function getMemory<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(passedOptions: Partial<MoonbowOptions<U, S, B>>) {
  const options = await getOptionsWithDefaults(passedOptions)
  const target = gpuCanvas(options.device, options.canvas)

  const uniforms = options.uniforms?.({ target, device: options.device }) || {}
  const storage = options.storage?.({ target, device: options.device }) || {}
  const resources: ResourceBinding[] = options.resources?.({ target, device: options.device }) || []

  delete uniforms?.storage
  return {
    ...options,
    uniforms,
    storage,
    resources,
    target
  }
}

export async function getOptionsWithDefaults<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(options: Partial<MoonbowOptions<U, S, B>>) {
  const device = options.device || (await useGPU()).device

  function bindGroupFallback(bindGroup: BindGroup<U, S, B>) {
    return [bindGroup()] as const
  }

  const props = {
    uniforms: options.uniforms || (() => ({})),
    storage: options.storage || (() => ({})),
    resources: options.resources || (() => []),
    canvas: options.canvas || null,
    device: device,
    model: options.model === undefined ? true : options.model,
    shader: options.shader || '',
    computeShader: options.computeShader || '',
    wireframe: options.wireframe || false,
    depthStencil: options.depthStencil || false,
    cullMode: options.cullMode || 'back',
    frontFace: options.frontFace || 'ccw',
    bindGroups: options.bindGroups || bindGroupFallback
  } as const

  return props as MoonbowOptions<U, S, B>
}

export type GetMemory<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
> = Awaited<ReturnType<typeof getMemory<U, S, B>>>
