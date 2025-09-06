struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    var pos = array<vec2f, 3>(
        vec2f(-1.0, -1.0),
        vec2f(3.0, -1.0),
        vec2f(-1.0, 3.0)
    );
    
    var output: VertexOutput;
    output.position = vec4f(pos[vertex_index], 0.0, 1.0);
    output.uv = pos[vertex_index] * 0.5 + 0.5;
    return output;
}

@group(0) @binding(0) var<uniform> config: vec4f; // dt, dissipation, texel_size.x, texel_size.y
@group(0) @binding(1) var velocity_texture: texture_2d<f32>;
@group(0) @binding(2) var source_texture: texture_2d<f32>;
@group(0) @binding(3) var texture_sampler: sampler;

fn bilerp(tex: texture_2d<f32>, samp: sampler, uv: vec2f, texel_size: vec2f) -> vec4f {
    let st = uv / texel_size - 0.5;
    let iuv = floor(st);
    let fuv = fract(st);
    
    let a = textureSample(tex, samp, (iuv + vec2f(0.5, 0.5)) * texel_size);
    let b = textureSample(tex, samp, (iuv + vec2f(1.5, 0.5)) * texel_size);
    let c = textureSample(tex, samp, (iuv + vec2f(0.5, 1.5)) * texel_size);
    let d = textureSample(tex, samp, (iuv + vec2f(1.5, 1.5)) * texel_size);
    
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
    let dt = config.x;
    let dissipation = config.y;
    let texel_size = config.zw;
    
    let velocity = textureSample(velocity_texture, texture_sampler, input.uv);
    let coord = input.uv - dt * velocity.xy * texel_size;
    
    let result = bilerp(source_texture, texture_sampler, coord, texel_size);
    let decay = 1.0 + dissipation * dt;
    
    return result / decay;
}
