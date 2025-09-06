export async function useGPU() {
  const gpu = (navigator as any).gpu as GPU
  if (!gpu) throw new Error('WebGPU not supported on this browser.')
  const adapter = await gpu.requestAdapter()
  if (!adapter) throw new Error('No appropriate GPUAdapter found.')
  const device = await adapter.requestDevice()

  return {
    adapter: adapter,
    device: device
  }
}

export function gpuCanvas(device: GPUDevice, canvasQuery?: HTMLCanvasElement | null) {
  if (!canvasQuery) throw new Error('No webgpu canvas found.')
  const context = canvasQuery.getContext('webgpu') as unknown as GPUCanvasContext
  const canvasFormat = (navigator as any).gpu.getPreferredCanvasFormat()
  if (!context) throw new Error('WebGPU context not available')

  context.configure({
    device: device,
    format: canvasFormat
  })

  const target = {
    element: canvasQuery,
    context: context,
    format: canvasFormat,
    device: device,
    aspect: canvasQuery.width / canvasQuery.height
  }

  return target
}

export type GPUCanvas = ReturnType<typeof gpuCanvas>
