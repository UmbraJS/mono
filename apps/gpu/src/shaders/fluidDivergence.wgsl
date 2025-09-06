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
@group(0) @binding(1) var velocity_texture: texture_2d<f32>;
@group(0) @binding(2) var texture_sampler: sampler;

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
    let texel_size = config.xy;
    
    let l = textureSample(velocity_texture, texture_sampler, input.uv - vec2f(texel_size.x, 0.0)).x;
    let r = textureSample(velocity_texture, texture_sampler, input.uv + vec2f(texel_size.x, 0.0)).x;
    let t = textureSample(velocity_texture, texture_sampler, input.uv + vec2f(0.0, texel_size.y)).y;
    let b = textureSample(velocity_texture, texture_sampler, input.uv - vec2f(0.0, texel_size.y)).y;
    
    let c = textureSample(velocity_texture, texture_sampler, input.uv).xy;
    
    var left = l;
    var right = r;
    var top = t;
    var bottom = b;
    
    if (input.uv.x - texel_size.x < 0.0) { left = -c.x; }
    if (input.uv.x + texel_size.x > 1.0) { right = -c.x; }
    if (input.uv.y + texel_size.y > 1.0) { top = -c.y; }
    if (input.uv.y - texel_size.y < 0.0) { bottom = -c.y; }
    
    let div = 0.5 * (right - left + top - bottom);
    return vec4f(div, 0.0, 0.0, 1.0);
}
