/// <reference types="@webgpu/types" />
import { mat4 } from 'gl-matrix'
import { bufferVertexLayout, modelMatrix, ensure3Values } from './utils.js'
import type { GeoBuffers, Geometry, ModelOptions } from './utils.js'
import { getModel } from './'

export function plane(device: GPUDevice, options: ModelOptions = {}) {
  const buffer = planeBuffer(device, options)
  return getModel(buffer)
}

function planeBuffer(device: GPUDevice, options: ModelOptions = {}): GeoBuffers {
  const geometry = planeGeometry(options)

  // Calculate maximum buffer size for resolution up to 50x50 to handle high-resolution cases
  const maxResolution = 50
  const maxVertices = (maxResolution + 1) * (maxResolution + 1)
  const maxIndices = maxResolution * maxResolution * 6 // 6 indices per quad

  // Create buffers with maximum size
  const vBuffer = device.createBuffer({
    label: 'Plane Vertices Buffer',
    size: maxVertices * 3 * 4, // 3 floats per vertex, 4 bytes per float
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  const nBuffer = device.createBuffer({
    label: 'Plane Normals Buffer',
    size: maxVertices * 3 * 4, // 3 floats per normal, 4 bytes per float
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  const uvBuffer = device.createBuffer({
    label: 'Plane UVs Buffer',
    size: maxVertices * 2 * 4, // 2 floats per UV, 4 bytes per float
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  })

  const indices = device.createBuffer({
    label: 'Plane Indices Buffer',
    size: maxIndices * 2, // 2 bytes per index (Uint16)
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
  })

  // Write initial data
  device.queue.writeBuffer(vBuffer, 0, geometry.vertices.buffer, 0, geometry.vertices.byteLength)
  device.queue.writeBuffer(nBuffer, 0, geometry.normals.buffer, 0, geometry.normals.byteLength)
  device.queue.writeBuffer(uvBuffer, 0, geometry.uvs.buffer, 0, geometry.uvs.byteLength)
  device.queue.writeBuffer(indices, 0, geometry.indices.buffer, 0, geometry.indices.byteLength)

  let currentIndicesCount = geometry.indicesCount

  function update(o: ModelOptions) {
    const base = options || {}
    const geo = planeGeometry({ ...base, ...o })

    device.queue.writeBuffer(vBuffer, 0, geo.vertices.buffer, 0, geo.vertices.byteLength)
    device.queue.writeBuffer(nBuffer, 0, geo.normals.buffer, 0, geo.normals.byteLength)
    device.queue.writeBuffer(uvBuffer, 0, geo.uvs.buffer, 0, geo.uvs.byteLength)
    device.queue.writeBuffer(indices, 0, geo.indices.buffer, 0, geo.indices.byteLength)

    currentIndicesCount = geo.indicesCount
  }

  return {
    update: update,
    vertices: vBuffer,
    indices: indices,
    get indicesCount() {
      return currentIndicesCount
    },
    normals: nBuffer,
    uvs: uvBuffer,
    layout: bufferVertexLayout(),
    geometry: geometry
  }
}

function planeGeometry(options?: ModelOptions): Geometry {
  const resolution = ensure3Values(options?.resolution ?? 1)

  const size = 3
  const width = options?.width ?? size
  const height = options?.height ?? size

  const widthSegments = Math.floor(resolution[0])
  const heightSegments = Math.floor(resolution[1])

  // geometry data
  const indices: number[] = []
  const vertices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const colors: number[] = []

  const segmentWidth = width / widthSegments
  const segmentHeight = height / heightSegments

  const widthHalf = width / 2
  const heightHalf = height / 2

  const gridX1 = widthSegments + 1
  const gridY1 = heightSegments + 1

  // generate vertices, normals and uvs
  for (let iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - heightHalf

    for (let ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - widthHalf

      // vertices (plane in XY plane at z=0)
      vertices.push(x, y, 0)

      // normals (pointing in positive Z direction)
      normals.push(0, 0, 1)

      // uvs
      uvs.push(ix / widthSegments)
      uvs.push(1 - iy / heightSegments)
    }
  }

  // generate indices
  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = ix + gridX1 * iy
      const b = ix + gridX1 * (iy + 1)
      const c = ix + 1 + gridX1 * (iy + 1)
      const d = ix + 1 + gridX1 * iy

      // faces (two triangles per segment)
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // apply transformations
  const transform = modelMatrix(options)
  const transformedVertices: number[] = []
  for (let i = 0; i < vertices.length; i += 3) {
    const vertex: [number, number, number] = [vertices[i], vertices[i + 1], vertices[i + 2]]
    const transformedVertex = transformVertex(vertex, transform)
    transformedVertices.push(...transformedVertex)
  }

  return {
    vertices: new Float32Array(transformedVertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    vertexCount: transformedVertices.length,
    indicesCount: indices.length
  }
}

function transformVertex(vertex: [number, number, number], matrix: mat4) {
  const [x, y, z] = vertex
  const w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] // Apply perspective
  return [
    (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w, // Apply transformation and perspective divide
    (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
    (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w
  ]
}
