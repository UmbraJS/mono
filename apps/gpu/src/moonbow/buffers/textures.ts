/// <reference types="@webgpu/types" />
export type TextureSampleType = GPUTextureSampleType

export interface TextureBinding {
  binding?: number
  visibility?: number
  resourceType: 'texture'
  view: GPUTextureView
  textureSampleType?: TextureSampleType
  // Optional cleanup hook
  destroy?: () => void
}

export interface SamplerBinding {
  binding?: number
  visibility?: number
  resourceType: 'sampler'
  sampler: GPUSampler
  destroy?: () => void
}

export type ResourceBinding = TextureBinding | SamplerBinding

export async function loadImageBitmap(src: string) {
  const res = await fetch(src)
  const blob = await res.blob()
  return await createImageBitmap(blob, { colorSpaceConversion: 'none' })
}

export function createTextureFromImage(
  device: GPUDevice,
  image: ImageBitmap,
  opts?: { format?: GPUTextureFormat; usage?: GPUTextureUsageFlags }
) {
  const texture = device.createTexture({
    size: { width: image.width, height: image.height },
    format: opts?.format || 'rgba8unorm',
    usage:
      opts?.usage ||
      GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
  })

  device.queue.copyExternalImageToTexture(
    { source: image },
    { texture },
    { width: image.width, height: image.height }
  )

  return texture
}

export async function createTextureFromUrl(
  device: GPUDevice,
  url: string,
  opts?: { format?: GPUTextureFormat; usage?: GPUTextureUsageFlags }
) {
  const image = await loadImageBitmap(url)
  const texture = createTextureFromImage(device, image, opts)
  // Release CPU-side image memory
  image.close()
  return texture
}

export function textureBinding(options: {
  view: GPUTextureView
  binding?: number
  visibility?: number
  sampleType?: TextureSampleType
  destroy?: () => void
}): TextureBinding {
  return {
    resourceType: 'texture',
    view: options.view,
    binding: options.binding,
    visibility: options.visibility,
    textureSampleType: options.sampleType || 'float',
    destroy: options.destroy
  }
}

export function samplerBinding(
  device: GPUDevice,
  options?: {
    binding?: number
    visibility?: number
    sampler?: GPUSamplerDescriptor
    destroy?: () => void
  }
): SamplerBinding {
  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'repeat',
    addressModeV: 'repeat',
    ...(options?.sampler || {})
  })
  return {
    resourceType: 'sampler',
    sampler,
    binding: options?.binding,
    visibility: options?.visibility
  }
}

export async function createTextureResourcesFromUrl(
  device: GPUDevice,
  url: string,
  opts?: {
    textureBinding?: number
    samplerBinding?: number
    visibility?: number
    sampler?: GPUSamplerDescriptor
  }
) {
  const texture = await createTextureFromUrl(device, url)
  const view = texture.createView()
  const sampler = samplerBinding(device, {
    binding: opts?.samplerBinding,
    visibility: opts?.visibility,
    sampler: opts?.sampler
  })
  const texRes = textureBinding({
    view,
    binding: opts?.textureBinding,
    visibility: opts?.visibility
  })
  return {
    resources: [texRes, sampler] as ResourceBinding[],
    texture,
    view,
    sampler
  }
}
