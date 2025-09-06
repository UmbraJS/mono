// Post-processing vertex shader
struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
}

struct ViewProjectionMatrix {
    matrix: mat4x4<f32>
};

// Full-screen triangle vertices (no vertex buffer needed)
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

// Uniforms for post-processing - binding indices match the order in memory.uniforms
@group(0) @binding(0) var<uniform> time: u32;
@group(0) @binding(1) var<uniform> intensity: f32;
@group(0) @binding(2) var<uniform> camera: ViewProjectionMatrix;
@group(0) @binding(3) var sceneTexture: texture_2d<f32>;
@group(0) @binding(4) var sceneSampler: sampler;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let uv = input.uv;
    
    // Sample the original scene
    var color = textureSample(sceneTexture, sceneSampler, uv);
    
    // Apply some post-processing effects
    
    // 1. Vignette effect
    let center = vec2f(0.5, 0.5);
    let dist = distance(uv, center);
    let vignette = 1.0 - smoothstep(0.3, 0.8, dist);
    
    // 2. Color grading / tint
    let timeF = f32(time) * 0.001;
    let tint = vec3f(
        1.0 + sin(timeF) * 0.1,
        1.0 + sin(timeF * 1.3) * 0.1,
        1.0 + sin(timeF * 1.7) * 0.1
    );
    
    // 3. Contrast adjustment
    let contrast = 1.2;
    color = vec4f((color.rgb - 0.5) * contrast + 0.5, color.a);
    
    // 4. Apply effects
    color = vec4f(color.rgb * tint, color.a);
    color = vec4f(color.rgb * vignette, color.a);
    
    // 5. Simple chromatic aberration
    let aberration = intensity * 0.01;
    let r = textureSample(sceneTexture, sceneSampler, uv + vec2f(aberration, 0.0)).r;
    let g = textureSample(sceneTexture, sceneSampler, uv).g;
    let b = textureSample(sceneTexture, sceneSampler, uv - vec2f(aberration, 0.0)).b;
    
    let finalColor = vec3f(r, g, b) * tint * vignette;
    
    return vec4f(finalColor, color.a);
}
