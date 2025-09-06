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

@group(0) @binding(0) var<uniform> splat_data: vec4f; // point.x, point.y, color.r, color.g
@group(0) @binding(1) var<uniform> splat_data2: vec4f; // color.b, radius, aspect_ratio, force
@group(0) @binding(2) var target_texture: texture_2d<f32>;
@group(0) @binding(3) var texture_sampler: sampler;

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
    let point = splat_data.xy;
    let color = vec3f(splat_data.zw, splat_data2.x);
    let radius = splat_data2.y;
    let aspect_ratio = splat_data2.z;
    let force = splat_data2.w;
    
    var p = input.uv - point;
    p.x *= aspect_ratio;
    
    let distance = length(p);
    let splat_strength = exp(-distance * distance / radius);
    
    let base = textureSample(target_texture, texture_sampler, input.uv);
    
    // For velocity, add force-based motion
    // For density, add color
    let result = base + vec4f(color * splat_strength, 0.0);
    
    return vec4f(result.rgb, 1.0);
}
