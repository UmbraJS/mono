export interface UniformBuffer {
  binding?: number
  visibility?: number
  buffer: GPUBuffer
  bufferType?: GPUBufferBindingType
  update: () => void
  // Destroy underlying GPUBuffer when user no longer needs it.
  destroy: () => void
}

interface UBOptions {
  label?: string
  size?: number
  binding?: number
  visibility?: number
  usage?: GPUBufferUsageFlags
  update: (buffer: GPUBuffer) => void
}

export function uniformBuffer(device: GPUDevice, options: UBOptions): UniformBuffer {
  const defaultVisibility = GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
  const defaultUsage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
  const buffer = device.createBuffer({
    label: options.label,
    size: options.size || 4,
    usage: options.usage || defaultUsage
  })

  // Passes the buffer to the update callback
  options.update(buffer)
  return {
    binding: options.binding,
    visibility: options.visibility || defaultVisibility,
    buffer: buffer,
    // Explicitly mark this as a uniform buffer for bind group layout construction.
    update: () => options.update(buffer),
    destroy: () => buffer.destroy()
  }
}

export function storageBuffer(device: GPUDevice, options: UBOptions): UniformBuffer {
  // Storage buffers typically need STORAGE + COPY_DST usage; caller can extend.
  const usage = options.usage || GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
  const buffer = device.createBuffer({
    label: options.label,
    size: options.size || 4,
    usage
  })

  // Execute initial population/update of buffer contents.
  options.update(buffer)

  return {
    binding: options.binding,
    // Provide a sane default visibility including COMPUTE if caller omitted one.
    visibility:
      options.visibility ||
      GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
    buffer,
    // Mark the buffer type so getUniformEntries can map to the correct layout ("storage").
    bufferType: 'storage',
    update: () => options.update(buffer),
    destroy: () => buffer.destroy()
  }
}
