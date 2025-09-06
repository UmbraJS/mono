import type { MoonbowPipelineOptions, PipelineCore } from '../'
import { getDepthStencilAttachment } from './utils'

export type MoonbowRender = ReturnType<typeof getRenderer>

export interface ComputePass {
  bindGroup: GPUBindGroup
  commandEncoder: GPUCommandEncoder
  simulationPipeline: GPUComputePipeline
  workgroups?: number | [number, number] | [number, number, number]
}

export function computePass({
  bindGroup,
  commandEncoder,
  simulationPipeline,
  workgroups = [1, 1, 1]
}: ComputePass) {
  const computePass = commandEncoder.beginComputePass()

  function draw() {
    computePass.setPipeline(simulationPipeline)
    computePass.setBindGroup(0, bindGroup)
    return {
      submit,
      frame: (callback: () => void) => {
        callback()
        submit()
      }
    }
  }

  function submit() {
    const [x, y, z] = Array.isArray(workgroups)
      ? workgroups.length === 2
        ? [...workgroups, 1]
        : workgroups
      : [workgroups, workgroups, workgroups]
    computePass.dispatchWorkgroups(x, y, z)
    computePass.end()
  }

  return {
    computePass,
    draw,
    submit: () => draw().submit(),
    frame: (callback: () => void) => {
      draw().frame(callback)
    }
  }
}

export type MoonbowCompute = ReturnType<typeof computePass>

interface PassRender {
  bindGroup: GPUBindGroup
  passEncoder: GPURenderPassEncoder
  pipeline: GPURenderPipeline
}

export function getRenderer({
  target,
  depthStencil,
  commandEncoder
}: {
  target: PipelineCore['target']
  depthStencil: MoonbowPipelineOptions['depthStencil']
  commandEncoder?: GPUCommandEncoder
}) {
  const cmdEncoder =
    commandEncoder ||
    target.device.createCommandEncoder({
      label: 'Moonbow Command Encoder'
    })

  function initPass() {
    const renderPass = cmdEncoder.beginRenderPass({
      label: 'Moonbow Render Pass',
      depthStencilAttachment: depthStencil
        ? getDepthStencilAttachment(target.device, target.context.canvas)
        : undefined,
      colorAttachments: [
        {
          // @location(0), see fragment shader
          view: target.context.getCurrentTexture().createView(),
          clearValue: { r: 0.15, g: 0.15, b: 0.25, a: 0.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    })
    return {
      renderPass,
      submitPass,
      drawPass
    }
  }

  function drawPass({ bindGroup, passEncoder, pipeline }: PassRender) {
    passEncoder.setPipeline(pipeline)
    passEncoder.setBindGroup(0, bindGroup) // The 0 passed as the first argument corresponds to the @group(0) in the shader code.
    return passEncoder
  }

  function submitPass(passEncoder: GPURenderPassEncoder) {
    passEncoder.end()
    const commandBuffer = cmdEncoder.finish()
    target.device.queue.submit([commandBuffer])
  }

  return {
    initPass,
    drawPass,
    submitPass,
    commandEncoder: cmdEncoder
  }
}
