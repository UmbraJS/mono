import type { UniformBuffer } from '../buffers'
import type { ResourceBinding } from '../buffers/textures'

export function getUniformEntries(props: { device: GPUDevice; uniforms: UniformBuffer[] }) {
  const defaultVisibility = GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE
  return props.uniforms.map((uniform, index) => ({
    binding: uniform.binding === undefined ? index : uniform.binding,
    visibility: uniform.visibility || defaultVisibility,
    // Use explicit bufferType when provided (e.g. 'storage'). Fallback to 'uniform'.
    buffer: { type: (uniform.bufferType || 'uniform') as GPUBufferBindingType },
    resource: { buffer: uniform.buffer }
  }))
}

type UniformEntries = ReturnType<typeof getUniformEntries>

export function getBindGroupLayout(device: GPUDevice, entries: UniformEntries) {
  const bindGroupLayout = device.createBindGroupLayout({
    label: 'Uniforms Bind Group Layout',
    entries: entries.map((entry) => ({
      binding: entry.binding,
      visibility: entry.visibility,
      buffer: entry.buffer
    }))
  })
  return bindGroupLayout
}

// Flexible combination of buffers + textures/samplers for bind group layout creation
export type ResourceEntry =
  | { binding: number; visibility: number; buffer: { type: GPUBufferBindingType } }
  | { binding: number; visibility: number; texture: { sampleType: GPUTextureSampleType } }
  | { binding: number; visibility: number; sampler: GPUSamplerBindingLayout }

export function getResourceLayout(device: GPUDevice, entries: ResourceEntry[]) {
  return device.createBindGroupLayout({
    label: 'Moonbow Resource Bind Group Layout',
    entries
  })
}

export function makeBindGroup(
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: Array<
    | { binding: number; resource: GPUBufferBinding }
    | { binding: number; resource: GPUSampler }
    | { binding: number; resource: GPUTextureView }
  >
) {
  return device.createBindGroup({ label: 'Moonbow Bind Group', layout, entries })
}
