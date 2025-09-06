import { getUniformEntries } from './'
import { toGPUColor, BackgroundColors } from './background'
import type { GetMemory, MoonbowBuffers, MoonbowPipelineOptions } from './'
import type { MultiShaderRenderCall } from './multiShader'
import type { BackgroundColor } from './background'

export interface PostProcessOptions {
  postProcessShader: string
  backgroundColor?: BackgroundColor
  baseOptions?: Partial<Omit<MoonbowPipelineOptions, 'shader'>>
}

/**
 * Creates a post-processing pipeline that renders to an offscreen texture first,
 * then applies a full-screen post-processing effect
 */
export function createPostProcessPipeline<
  U extends MoonbowBuffers,
  _S extends MoonbowBuffers,
  _B extends GPUBindGroup[] = GPUBindGroup[]
>(
  memory: GetMemory<U, _S, _B>,
  scenePipelines: any[], // Your existing multi-shader pipelines
  options: PostProcessOptions
) {
  const device = memory.target.device
  const canvas = memory.target.element

  // Offscreen render + depth textures are cached and recreated only when canvas size changes.
  let renderTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: memory.target.format,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
  })
  let renderTextureView = renderTexture.createView()

  let depthTexture = memory.depthStencil
    ? device.createTexture({
        size: [canvas.width, canvas.height],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      })
    : null

  let cachedWidth = canvas.width
  let cachedHeight = canvas.height

  function ensureTargetsCurrent() {
    if (canvas.width !== cachedWidth || canvas.height !== cachedHeight) {
      cachedWidth = canvas.width
      cachedHeight = canvas.height
      renderTexture.destroy()
      renderTexture = device.createTexture({
        size: [canvas.width, canvas.height],
        format: memory.target.format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING
      })
      renderTextureView = renderTexture.createView()
      if (memory.depthStencil) {
        depthTexture?.destroy()
        depthTexture = device.createTexture({
          size: [canvas.width, canvas.height],
          format: 'depth24plus',
          usage: GPUTextureUsage.RENDER_ATTACHMENT
        })
      }
    }
  }

  // Create sampler for the offscreen texture
  const sampler = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge'
  })

  // Get existing uniform entries and add scene texture + sampler
  const existingUniforms = memory.uniforms ? Object.values(memory.uniforms) : []
  const uniformEntries = getUniformEntries({ device, uniforms: existingUniforms })

  // Create additional entries for scene texture and sampler
  const nextBinding = uniformEntries.length

  // Create post-processing bind group layout
  const postProcessBindGroupLayout = device.createBindGroupLayout({
    label: 'Post-process Bind Group Layout',
    entries: [
      // All existing uniform entries (only layout info, not resources)
      ...uniformEntries.map((entry) => ({
        binding: entry.binding,
        visibility: entry.visibility,
        buffer: entry.buffer
      })),
      // Scene texture
      {
        binding: nextBinding,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: 'float' as GPUTextureSampleType }
      },
      // Scene sampler
      {
        binding: nextBinding + 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {}
      }
    ]
  })

  // Create post-processing pipeline (no vertex buffer needed)
  // We'll create a custom pipeline layout to include the scene texture
  const postProcessPipelineLayout = device.createPipelineLayout({
    label: 'Post-process Pipeline Layout',
    bindGroupLayouts: [postProcessBindGroupLayout]
  })

  const postProcessShaderModule = device.createShaderModule({
    label: 'Post-process Shader Module',
    code: options.postProcessShader
  })

  const postProcessPipeline = device.createRenderPipeline({
    label: 'Post-process Render Pipeline',
    layout: postProcessPipelineLayout,
    vertex: {
      module: postProcessShaderModule,
      entryPoint: 'vertexMain'
      // No vertex buffers needed for full-screen triangle
    },
    fragment: {
      module: postProcessShaderModule,
      entryPoint: 'fragmentMain',
      targets: [{ format: memory.target.format }]
    },
    primitive: {
      topology: 'triangle-list'
    }
  })

  // Get background color or use default
  const backgroundColor = options.backgroundColor
    ? toGPUColor(options.backgroundColor)
    : BackgroundColors.default

  /**
   * Render with post-processing:
   * 1. Render scene to offscreen texture
   * 2. Apply post-processing to final canvas
   */
  function renderWithPostProcess(sceneRenderCalls: MultiShaderRenderCall[]) {
    // Resize-aware: ensure offscreen targets reflect current canvas size.
    ensureTargetsCurrent()
    const commandEncoder = device.createCommandEncoder({
      label: 'Post-process Command Encoder'
    })

    // PASS 1: Render scene to offscreen texture
    const offscreenPassDescriptor: GPURenderPassDescriptor = {
      label: 'Offscreen Scene Render Pass',
      colorAttachments: [
        {
          view: renderTextureView,
          clearValue: backgroundColor,
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    }

    if (depthTexture) {
      offscreenPassDescriptor.depthStencilAttachment = {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store'
      }
    }

    const offscreenRenderPass = commandEncoder.beginRenderPass(offscreenPassDescriptor)

    // Render all scene objects to offscreen texture
    sceneRenderCalls.forEach(({ pipeline: pipelineId, renderFunction }) => {
      const pipelineObj =
        typeof pipelineId === 'string'
          ? scenePipelines.find((p: any) => p.label === pipelineId)
          : scenePipelines[pipelineId as number]

      if (!pipelineObj) {
        console.warn(`Scene pipeline not found: ${pipelineId}`)
        return
      }

      const bindGroups = memory.bindGroups(pipelineObj.pipeline.core.bindGroup)
      offscreenRenderPass.setPipeline(pipelineObj.pipeline.core.pipeline)
      offscreenRenderPass.setBindGroup(0, bindGroups[0])
      renderFunction(offscreenRenderPass)
    })

    offscreenRenderPass.end()

    // PASS 2: Apply post-processing to final canvas
    const finalPassDescriptor: GPURenderPassDescriptor = {
      label: 'Post-process Final Pass',
      colorAttachments: [
        {
          view: memory.target.context.getCurrentTexture().createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store'
        }
      ]
    }

    const finalRenderPass = commandEncoder.beginRenderPass(finalPassDescriptor)

    // Create post-process bind group with scene texture and all existing uniforms
    const bindGroupEntries = [
      // Add all existing uniform buffers
      ...uniformEntries.map((entry) => ({
        binding: entry.binding,
        resource: entry.resource
      })),
      // Add scene texture
      {
        binding: nextBinding,
        resource: renderTextureView
      },
      // Add scene sampler
      {
        binding: nextBinding + 1,
        resource: sampler
      }
    ]

    const postProcessBindGroup = device.createBindGroup({
      label: 'Post-process Bind Group',
      layout: postProcessBindGroupLayout,
      entries: bindGroupEntries
    })

    // Render full-screen quad with post-processing
    finalRenderPass.setPipeline(postProcessPipeline)
    finalRenderPass.setBindGroup(0, postProcessBindGroup)
    finalRenderPass.draw(3) // Full-screen triangle (3 vertices)

    finalRenderPass.end()
    device.queue.submit([commandEncoder.finish()])
  }

  return {
    renderWithPostProcess,
    postProcessPipeline,
    renderTexture,
    // Expose manual resize recalculation (optional external call after user resizes canvas dimensions).
    resize: () => ensureTargetsCurrent(),
    dispose: () => {
      renderTexture.destroy()
      depthTexture?.destroy()
      // ShaderModule / Pipeline objects are GC-managed; left for future explicit destruction if API adds it.
    },
    memory
  }
}

export type PostProcessPipeline = ReturnType<typeof createPostProcessPipeline>

/**
 * Generates a post-processing shader with correct binding indices based on existing uniforms
 */
export function generatePostProcessShader(
  existingUniforms: string[],
  customEffects?: string
): string {
  const uniformBindings = existingUniforms
    .map(
      (name, index) => `@group(0) @binding(${index}) var<uniform> ${name}: ${getUniformType(name)};`
    )
    .join('\n')

  const sceneTextureBinding = existingUniforms.length
  const sceneSamplerBinding = existingUniforms.length + 1

  const defaultEffects = `
    // 1. Vignette effect
    let center = vec2f(0.5, 0.5);
    let dist = distance(uv, center);
    let vignette = 1.0 - smoothstep(0.3, 0.8, dist);
    
    // 2. Simple contrast adjustment
    let contrast = 1.2;
    color = vec4f((color.rgb - 0.5) * contrast + 0.5, color.a);
    
    // 3. Apply vignette
    color = vec4f(color.rgb * vignette, color.a);
  `

  return `
// Post-processing vertex shader - Full-screen triangle
struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
}

struct ViewProjectionMatrix {
    matrix: mat4x4<f32>
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var pos = array<vec2f, 3>(
        vec2f(-1.0, -1.0),  // Bottom left
        vec2f( 3.0, -1.0),  // Bottom right (extended)
        vec2f(-1.0,  3.0)   // Top left (extended)
    );
    
    var uv = array<vec2f, 3>(
        vec2f(0.0, 1.0),    // Bottom left
        vec2f(2.0, 1.0),    // Bottom right (extended)
        vec2f(0.0, -1.0)    // Top left (extended)
    );
    
    var output: VertexOutput;
    output.pos = vec4f(pos[vertexIndex], 0.0, 1.0);
    output.uv = uv[vertexIndex];
    return output;
}

// Dynamic uniform bindings
${uniformBindings}

// Scene texture and sampler
@group(0) @binding(${sceneTextureBinding}) var sceneTexture: texture_2d<f32>;
@group(0) @binding(${sceneSamplerBinding}) var sceneSampler: sampler;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let uv = input.uv;
    
    // Sample the original scene
    var color = textureSample(sceneTexture, sceneSampler, uv);
    
    // Apply post-processing effects
    ${customEffects || defaultEffects}
    
    return color;
}
`
}

/**
 * Helper function to determine WGSL type from uniform name
 */
function getUniformType(name: string): string {
  // Add type inference based on common uniform names
  if (name.includes('time') || name.includes('Time')) return 'u32'
  if (name.includes('intensity') || name.includes('factor') || name.includes('scale')) return 'f32'
  if (name.includes('matrix') || name.includes('Matrix')) return 'mat4x4<f32>'
  if (name.includes('camera') || name.includes('Camera')) return 'ViewProjectionMatrix'

  // Default to f32 for unknown types
  return 'f32'
}

/**
 * Enhanced post-processing pipeline that automatically generates shader with correct bindings
 */
export function createAutoPostProcessPipeline<
  U extends MoonbowBuffers,
  _S extends MoonbowBuffers,
  _B extends GPUBindGroup[] = GPUBindGroup[]
>(
  memory: GetMemory<U, _S, _B>,
  scenePipelines: any[],
  customEffects?: string,
  backgroundColor?: BackgroundColor
) {
  const existingUniforms = memory.uniforms ? Object.keys(memory.uniforms) : []
  const autoShader = generatePostProcessShader(existingUniforms, customEffects)
  const base = createPostProcessPipeline(memory, scenePipelines, {
    postProcessShader: autoShader,
    backgroundColor
  })
  // Return base object (already includes dispose/resize) for clarity & future extension.
  return base
}
