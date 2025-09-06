export function getDepthStencilAttachment(
  device: GPUDevice,
  element: Pick<HTMLCanvasElement, 'height' | 'width'>
): GPURenderPassDepthStencilAttachment {
  const depthTexture = device.createTexture({
    size: [element.width, element.height],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  })

  return {
    view: depthTexture.createView(),
    depthClearValue: 1.0,
    depthLoadOp: 'clear',
    depthStoreOp: 'store'
  }
}

export function getStencil(depthStencil?: boolean | GPUDepthStencilState) {
  const defaultStencil: GPUDepthStencilState = {
    // this makes sure that faces get rendered in the correct order.
    depthWriteEnabled: true,
    depthCompare: 'less',
    format: 'depth24plus'
  }

  if (depthStencil === true) return defaultStencil
  if (depthStencil === false) return undefined
  return depthStencil
}
