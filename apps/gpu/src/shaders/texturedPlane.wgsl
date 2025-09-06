struct VertexInput {
    @location(0) pos: vec3<f32>,
    @location(1) norm : vec3<f32>,
    @location(2) uv : vec2<f32>,
};

struct VertexOutput {
    @builtin(position) pos : vec4<f32>,
    @location(0) vUv : vec2<f32>,
};

struct ViewProjectionMatrix {
    matrix: mat4x4<f32>
};

@group(0) @binding(0) var<uniform> time: u32;
@group(0) @binding(1) var<uniform> intensity: f32;
@group(0) @binding(2) var<uniform> view: ViewProjectionMatrix;
// texture and sampler will be appended by runtime as next bindings
@group(0) @binding(3) var tex: texture_2d<f32>;
@group(0) @binding(4) var texSampler: sampler;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.pos = view.matrix * vec4f(input.pos, 1.0);
    out.vUv = input.uv;
    return out;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let color = textureSample(tex, texSampler, input.vUv);
    return color;
}
