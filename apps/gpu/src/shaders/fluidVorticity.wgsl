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

@group(0) @binding(0) var<uniform> config: vec4f; // texel_size.x, texel_size.y, curl_strength, dt
@group(0) @binding(1) var velocity_texture: texture_2d<f32>;
@group(0) @binding(2) var curl_texture: texture_2d<f32>;
@group(0) @binding(3) var texture_sampler: sampler;

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
    let texel_size = config.xy;
    let curl_strength = config.z;
    let dt = config.w;
    
    let l = textureSample(curl_texture, texture_sampler, input.uv - vec2f(texel_size.x, 0.0)).x;
    let r = textureSample(curl_texture, texture_sampler, input.uv + vec2f(texel_size.x, 0.0)).x;
    let t = textureSample(curl_texture, texture_sampler, input.uv + vec2f(0.0, texel_size.y)).x;
    let b = textureSample(curl_texture, texture_sampler, input.uv - vec2f(0.0, texel_size.y)).x;
    let c = textureSample(curl_texture, texture_sampler, input.uv).x;
    
    var force = 0.5 * vec2f(abs(t) - abs(b), abs(r) - abs(l));
    force /= length(force) + 0.0001;
    force *= curl_strength * c;
    force.y *= -1.0;
    
    let velocity = textureSample(velocity_texture, texture_sampler, input.uv).xy;
    let new_velocity = velocity + force * dt;
    let clamped_velocity = clamp(new_velocity, vec2f(-1000.0), vec2f(1000.0));
    
    return vec4f(clamped_velocity, 0.0, 1.0);
}
