import { uniformBuffer } from '.'

export function uTime(device: GPUDevice, speed = 0.1) {
  let time = 50
  return uniformBuffer(device, {
    label: 'Time Buffer',
    binding: undefined,
    update: (buffer) => {
      time += speed
      device.queue.writeBuffer(buffer, 0, new Uint32Array([time]))
      return time
    }
  })
}

export function fTime(device: GPUDevice) {
  let time = 50
  return uniformBuffer(device, {
    label: 'Time Buffer',
    binding: undefined,
    update: (buffer) => {
      time += 0.02
      device.queue.writeBuffer(buffer, 0, new Float32Array([time]))
      return time
    }
  })
}

export function float(device: GPUDevice, value: number[]) {
  const data = new Float32Array(value)
  return uniformBuffer(device, {
    size: data.byteLength,
    binding: undefined,
    update: (buffer) => {
      device.queue.writeBuffer(buffer, 0, data)
    }
  })
}

// NOTE: WebGPU alignment rules mean a vec3 in a uniform block is rounded up to 16 bytes.
// We still expose vec3 for ergonomics but allocate 16 bytes. Caller passes 3 components.
export const vec3 = (device: GPUDevice, value: [number, number, number]) =>
  uniformBuffer(device, {
    size: 16, // padded to 16 bytes
    update: (buffer) => {
      const data = new Float32Array([value[0], value[1], value[2], 0])
      device.queue.writeBuffer(buffer, 0, data)
    }
  })

export const vec4 = (device: GPUDevice, value: [number, number, number, number]) =>
  uniformBuffer(device, {
    size: 16,
    update: (buffer) => {
      const data = new Float32Array(value)
      device.queue.writeBuffer(buffer, 0, data)
    }
  })
