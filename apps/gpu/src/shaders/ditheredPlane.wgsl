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
@group(0) @binding(1) var<uniform> intensity: f32; // used as dithering levels (>= 2)
@group(0) @binding(2) var<uniform> view: ViewProjectionMatrix;
@group(0) @binding(3) var tex: texture_2d<f32>;
@group(0) @binding(4) var texSampler: sampler;
// Monochrome controls
@group(0) @binding(5) var<uniform> monoEnabled: f32; // 0.0 = off, >0.5 = on
@group(0) @binding(6) var<uniform> monoColor: vec4<f32>; // tint color for mono
// Contrast control (1.0 = no change)
@group(0) @binding(7) var<uniform> contrast: f32;
// Post-monochrome contrast (applies after mono tint)
@group(0) @binding(8) var<uniform> postContrast: f32;
// Post-monochrome black level (subtracts then clamps)
@group(0) @binding(9) var<uniform> postBlack: f32;
// Post-monochrome gamma (1.0 = linear, >1 darkens mids)
@group(0) @binding(10) var<uniform> postGamma: f32;
// Dithering block size scale (>=1). 1 = per-pixel; higher = larger blocks
@group(0) @binding(11) var<uniform> ditherScale: f32;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.pos = view.matrix * vec4f(input.pos, 1.0);
    out.vUv = input.uv;
    return out;
}

// 4x4 Bayer matrix (values 0..15)
fn bayer4(x: i32, y: i32) -> f32 {
    let M = array<array<i32,4>,4>(
        array<i32,4>( 0,  8,  2, 10),
        array<i32,4>(12,  4, 14,  6),
        array<i32,4>( 3, 11,  1,  9),
        array<i32,4>(15,  7, 13,  5)
    );
    let v = M[y & 3][x & 3];
    // Normalize to [0,1): (n + 0.5) / 16.0 gives nicer distribution
    return (f32(v) + 0.5) / 16.0;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    var color = textureSample(tex, texSampler, input.vUv);

    // Pixel position in framebuffer coordinates
    let px = i32(floor(input.pos.x));
    let py = i32(floor(input.pos.y));
    // Scale the Bayer sampling to create larger dither blocks
    let s = max(1.0, ditherScale);
    let bx = i32(floor(f32(px) / s));
    let by = i32(floor(f32(py) / s));
    let T = bayer4(bx, by); // threshold in [0,1)

    // Use "intensity" uniform as number of levels (min 2)
    let L = max(2.0, intensity);
    let denom = max(1.0, L - 1.0);

    // Apply contrast before dithering: rgb = (rgb - 0.5) * contrast + 0.5
    var rgb = (color.rgb - vec3f(0.5)) * vec3f(contrast) + vec3f(0.5);
    rgb = clamp(rgb, vec3f(0.0), vec3f(1.0));

    // Ordered dithering per channel
    rgb = floor(rgb * L + T) / denom;
    rgb = clamp(rgb, vec3f(0.0), vec3f(1.0));

    if (monoEnabled > 0.5) {
        // luminance (Rec. 601)
        let luma = dot(rgb, vec3f(0.299, 0.587, 0.114));
        rgb = vec3f(luma) * monoColor.rgb;
        // Apply post-black (lift) to deepen blacks
        rgb = max(rgb - vec3f(postBlack), vec3f(0.0));
        // Apply post-contrast after monochrome tint
        rgb = (rgb - vec3f(0.5)) * vec3f(postContrast) + vec3f(0.5);
        rgb = clamp(rgb, vec3f(0.0), vec3f(1.0));
        // Apply post-gamma (guard against pow(0, <1))
        let eps = 1e-5;
        rgb = pow(max(rgb, vec3f(eps)), vec3f(postGamma));
        rgb = clamp(rgb, vec3f(0.0), vec3f(1.0));
    }

    return vec4f(rgb, color.a);
}
