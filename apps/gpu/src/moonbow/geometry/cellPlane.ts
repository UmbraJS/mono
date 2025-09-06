import { plane } from './plane'

export function getCellPlane(device: GPUDevice, GRID_SIZE: number) {
  const surface = plane(device, {})

  function update(encoder: GPURenderPassEncoder) {
    encoder.setVertexBuffer(0, surface.buffer.vertices)
    encoder.setVertexBuffer(1, surface.buffer.normals)
    encoder.setVertexBuffer(2, surface.buffer.uvs)
    encoder.setIndexBuffer(surface.buffer.indices, 'uint16')
    encoder.drawIndexed(
      surface.buffer.indicesCount,
      GRID_SIZE * GRID_SIZE, // 16 instances
      0,
      0,
      0
    )
  }

  return {
    buffer: surface.buffer,
    render: (pass: GPURenderPassEncoder) => surface.setOptions(pass, { rotation: [0.0, 0.0, 0] }),
    update
  }
}
