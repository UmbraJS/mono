import { gpuPipeline, getMemory } from './'
import type { MoonbowBuffers, MoonbowOptions } from './'

export async function useMoonbow<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(passedOptions: Partial<MoonbowOptions<U, S, B>>) {
  const memory = await getMemory(passedOptions)
  return gpuPipeline(memory, {})
}
