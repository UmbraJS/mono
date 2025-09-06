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

@group(0) @binding(0) var<uniform> config: vec4f; // texel_size.x, texel_size.y, 0, 0
@group(0) @binding(1) var pressure_texture: texture_2d<f32>;
@group(0) @binding(2) var divergence_texture: texture_2d<f32>;
@group(0) @binding(3) var texture_sampler: sampler;

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
    let texel_size = config.xy;
    
    let l = textureSample(pressure_texture, texture_sampler, input.uv - vec2f(texel_size.x, 0.0)).x;
    let r = textureSample(pressure_texture, texture_sampler, input.uv + vec2f(texel_size.x, 0.0)).x;
    let t = textureSample(pressure_texture, texture_sampler, input.uv + vec2f(0.0, texel_size.y)).x;
    let b = textureSample(pressure_texture, texture_sampler, input.uv - vec2f(0.0, texel_size.y)).x;
    
    let divergence = textureSample(divergence_texture, texture_sampler, input.uv).x;
    let pressure = (l + r + b + t - divergence) * 0.25;
    
    return vec4f(pressure, 0.0, 0.0, 1.0);
}
