import { plane } from '../moonbow'

export function spinningPlane(device: GPUDevice) {
  const resolution = 15
  const size: [number, number, number] = [1, 1, 1]

  const object = plane(device, {
    size,
    resolution,
    position: [0, 0, 0]
  })

  function render(pass: GPURenderPassEncoder, rotation: number, x = 0) {
    object.setOptions(pass, { rotation: [0.5, rotation, 0], position: [x, 0, 0] })
  }

  return { render }
}
