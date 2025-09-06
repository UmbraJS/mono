import type { UniformBuffer, GPUCanvas, BindGroups } from './'
import type { ResourceBinding } from './buffers/textures'

export interface MoonbowBuffers {
  [key: string]: UniformBuffer
}

export interface MoonbowMemory {
  [key: string]: MoonbowBuffers[] | MoonbowBuffers
}

export interface MoonbowPipelineOptions {
  model: boolean
  wireframe: boolean
  depthStencil?: boolean | GPUDepthStencilState
  computeShader?: string
  shader: string
  cullMode?: GPUCullMode
  frontFace?: GPUFrontFace
}

export interface MoonbowOptions<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
> extends MoonbowPipelineOptions {
  uniforms: (props: { target: GPUCanvas; device: GPUDevice }) => Partial<U>
  storage: (props: { target: GPUCanvas; device: GPUDevice }) => Partial<S>
  // Optional non-buffer resources: textures and samplers bound in @group(0)
  resources?: (props: { target: GPUCanvas; device: GPUDevice }) => ResourceBinding[]
  bindGroups: BindGroups<U, S, B>
  canvas: HTMLCanvasElement | null
  device: GPUDevice
}
