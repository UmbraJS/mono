import { mat4, vec3, quat } from 'gl-matrix'

interface RotateOptions {
  rotation: vec3
  position: vec3
}

//this.degree += (options.rotation[1] * Math.PI) / 180
export function quaternion(options: RotateOptions) {
  const quaternion = quat.create()

  const quatX = quat.create()
  const quatY = quat.create()
  const quatZ = quat.create()

  quat.setAxisAngle(quatX, vec3.fromValues(1, 0, 0), options.rotation[0])
  quat.setAxisAngle(quatY, vec3.fromValues(0, 1, 0), options.rotation[1])
  quat.setAxisAngle(quatZ, vec3.fromValues(0, 0, 1), 0) // Bro, what the fuck would rotating around z even be

  quat.multiply(quaternion, quatX, quatY)
  quat.multiply(quaternion, quaternion, quatZ)

  const rotationMatrix = mat4.create()
  mat4.fromQuat(rotationMatrix, quaternion)

  const newPosition = vec3.create()
  vec3.transformMat4(newPosition, options.position, rotationMatrix)

  return newPosition
}

export function rotationSetting(value: number | [number, number, number]) {
  // If the value is a single number insead of an array then just assume they are wanting to rotate along the Y axis
  if (typeof value === 'number') return vec3.fromValues(0, value, 0)
  return vec3.fromValues(value[0], value[1], value[2])
}
