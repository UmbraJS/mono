import { cube } from '../moonbow'

export function spinningPlanks(device: GPUDevice) {
  const resolution = 15
  const size: [number, number, number] = [1, 1 / 4, 0.005]

  const topPlank = cube(device, {
    size,
    resolution,
    position: [0, 1, 0]
  })

  const middlePlank = cube(device, {
    size,
    resolution,
    position: [0, 0, 0]
  })

  const bottomPlank = cube(device, {
    size,
    resolution,
    position: [0, -1, 0]
  })

  function render(pass: GPURenderPassEncoder, rotation: number) {
    topPlank.setOptions(pass, { rotation: [0, rotation, 0] })
    middlePlank.setOptions(pass, { rotation: [0, rotation - 0.4, 0] })
    bottomPlank.setOptions(pass, { rotation: [0, rotation - 0.8, 0] })
  }

  return { render }
}
