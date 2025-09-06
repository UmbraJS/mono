import { createMultiShaderPipelines } from './multiShader'
import { createPostProcessPipeline, createAutoPostProcessPipeline } from './postProcess'
import type { GetMemory, MoonbowBuffers } from './'
import type { ShaderObject, MultiShaderOptions, MultiShaderPipelines } from './multiShader'
import type { PostProcessPipeline, PostProcessOptions } from './postProcess'

export interface SceneConfig<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
> {
  memory: GetMemory<U, S, B>
  shaders: ShaderObject[] | Record<string, string>
  multi?: MultiShaderOptions
  postProcess?: PostProcessOptions & { auto?: boolean }
}

export interface Scene<
  _U extends MoonbowBuffers,
  _S extends MoonbowBuffers,
  _B extends GPUBindGroup[] = GPUBindGroup[]
> {
  multi: MultiShaderPipelines
  post?: PostProcessPipeline
  render: (
    calls: {
      pipeline: string | number
      renderFunction: (renderPass: GPURenderPassEncoder) => void
    }[]
  ) => void
  resize: () => void
  dispose: () => void
}

/**
 * High-level aggregation of multi-shader and optional post-processing logic.
 * Provides a single entry point for render, resize, and dispose lifecycle.
 */
export function createScene<
  U extends MoonbowBuffers,
  S extends MoonbowBuffers,
  B extends GPUBindGroup[] = GPUBindGroup[]
>(config: SceneConfig<U, S, B>): Scene<U, S, B> {
  const multi = createMultiShaderPipelines(config.memory, config.shaders, config.multi)

  const post = config.postProcess
    ? config.postProcess.auto
      ? createAutoPostProcessPipeline(
          config.memory,
          multi.pipelines,
          config.postProcess.postProcessShader,
          config.postProcess.backgroundColor
        )
      : createPostProcessPipeline(config.memory, multi.pipelines, config.postProcess)
    : undefined

  function render(
    calls: {
      pipeline: string | number
      renderFunction: (renderPass: GPURenderPassEncoder) => void
    }[]
  ) {
    if (post) {
      post.renderWithPostProcess(calls)
    } else {
      multi.multiFrame(calls)
    }
  }

  function resize() {
    multi.resize?.()
    post?.resize?.()
  }

  function dispose() {
    post?.dispose?.()
    multi.dispose?.()
  }

  return { multi, post, render, resize, dispose }
}
