//Structs are like TS interfaces
struct VertexInput {
    @location(0) pos: vec3<f32>,
    @location(1) norm : vec3<f32>,
    @location(2) uv : vec2<f32>,
};

// output struct of this vertex shader
struct VertexOutput {
    @builtin(position) pos : vec4<f32>,
    @location(1) norm : vec3<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) theta : f32,
};

struct ViewProjectionMatrix {
    matrix: mat4x4<f32>
};

@group(0) @binding(0) var<uniform> time: u32;
@group(0) @binding(1) var<uniform> intensity: f32;
@group(0) @binding(2) var<uniform> view: ViewProjectionMatrix;

// Define constants for hashing algorithm
const HASH_SHIFT1 = 10u;
const HASH_SHIFT2 = 6u;
const HASH_SHIFT3 = 3u;
const HASH_SHIFT4 = 11u;
const HASH_SHIFT5 = 15u;

// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
fn hashBase(x: i32) -> i32 {
    var xx = x;
    xx = xx + (xx << HASH_SHIFT1);
    xx = xx ^ (xx >> HASH_SHIFT2);
    xx = xx + (xx << HASH_SHIFT3);
    xx = xx ^ (xx >> HASH_SHIFT4);
    xx = xx + (xx << HASH_SHIFT5);
    return xx;
}

// Compound versions of the hashing algorithm
fn hash1(v: vec2<i32>) -> i32 {
    return hashBase(v.x ^ hashBase(v.y));
}

fn hash2(v: vec3<i32>) -> i32 {
    return hashBase(v.x ^ hashBase(v.y) ^ hashBase(v.z));
}

fn hash3(v: vec4<i32>) -> i32 {
    return hashBase(v.x ^ hashBase(v.y) ^ hashBase(v.z) ^ hashBase(v.w));
}

// Construct a float with half-open range [0:1] using low 23 bits
fn floatConstruct(m: i32) -> f32 {
    let ieeeMantissa: i32 = 0x007FFFFF; // binary32 mantissa bitmask
    let ieeeOne: i32 = 0x3F800000; // 1.0 in IEEE binary32

    var mm = m;

    mm = mm & ieeeMantissa; // Keep only mantissa bits (fractional part)
    mm = mm | ieeeOne; // Add fractional part to 1.0

    var f: f32 = bitcast<f32>(mm); // Range [1:2]
    return f - 1.0; // Range [0:1]
}

// Pseudo-random value in half-open range [0:1]
fn random(x: f32) -> f32 {
    return floatConstruct(hashBase(bitcast<i32>(x)));
}

fn random1(v: vec2<f32>) -> f32 {
    return floatConstruct(hash1(vec2<i32>(bitcast<i32>(v.x), bitcast<i32>(v.y))));
}

fn random2(v: vec3<f32>) -> f32 {
    return floatConstruct(hash2(vec3<i32>(bitcast<i32>(v.x), bitcast<i32>(v.y), bitcast<i32>(v.z))));
}

fn random3(v: vec4<f32>) -> f32 {
    return floatConstruct(hash3(vec4<i32>(bitcast<i32>(v.x), bitcast<i32>(v.y), bitcast<i32>(v.z), bitcast<i32>(v.w))));
}

// Simple hash-based 3D noise function
fn bandNoise(p: vec3f) -> f32 {
    var p3 = fract(p * vec3f(0.013, 0.022, 0.033));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//simplex nosie
fn mod289(x: vec2f) -> vec2f {
    return x - floor(x * (1. / 289.)) * 289.;
}

fn mod289_3(x: vec3f) -> vec3f {
    return x - floor(x * (1. / 289.)) * 289.;
}

fn permute3(x: vec3f) -> vec3f {
    return mod289_3(((x * 34.) + 1.) * x);
}

//  MIT License. © Ian McEwan, Stefan Gustavson, Munrocket
fn simplexNoise2(v: vec2f) -> f32 {
    let C = vec4(
        0.211324865405187, // (3.0-sqrt(3.0))/6.0
        0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439 // 1.0 / 41.0
    );

    // First corner
    var i = floor(v + dot(v, C.yy));
    let x0 = v - i + dot(i, C.xx);

    // Other corners
    var i1 = select(vec2(0., 1.), vec2(1., 0.), x0.x > x0.y);

    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    var x12 = x0.xyxy + C.xxzz;
    x12.x = x12.x - i1.x;
    x12.y = x12.y - i1.y;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation

    var p = permute3(permute3(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    var m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), vec3(0.));
    m *= m;
    m *= m;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
    let x = 2. * fract(p * C.www) - 1.;
    let h = abs(x) - 0.5;
    let ox = floor(x + 0.5);
    let a0 = x - ox;

    // Normalize gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

    // Compute final noise value at P
    let g = vec3(a0.x * x0.x + h.x * x0.y, a0.yz * x12.xz + h.yz * x12.yw);
    return 130. * dot(m, g);
}

//perlin

fn permute4(x: vec4f) -> vec4f { return ((x * 34. + 1.) * x) % vec4f(289.); }
fn fade2(t: vec2f) -> vec2f { return t * t * t * (t * (t * 6. - 15.) + 10.); }

fn perlinNoise2(P: vec2f) -> f32 {
    var Pi: vec4f = floor(P.xyxy) + vec4f(0., 0., 1., 1.);
    let Pf = fract(P.xyxy) - vec4f(0., 0., 1., 1.);
    Pi = Pi % vec4f(289.); // To avoid truncation effects in permutation
    let ix = Pi.xzxz;
    let iy = Pi.yyww;
    let fx = Pf.xzxz;
    let fy = Pf.yyww;
    let i = permute4(permute4(ix) + iy);
    var gx: vec4f = 2. * fract(i * 0.0243902439) - 1.; // 1/41 = 0.024...
    let gy = abs(gx) - 0.5;
    let tx = floor(gx + 0.5);
    gx = gx - tx;
    var g00: vec2f = vec2f(gx.x, gy.x);
    var g10: vec2f = vec2f(gx.y, gy.y);
    var g01: vec2f = vec2f(gx.z, gy.z);
    var g11: vec2f = vec2f(gx.w, gy.w);
    let norm = 1.79284291400159 - 0.85373472095314 *
        vec4f(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 = g00 * norm.x;
    g01 = g01 * norm.y;
    g10 = g10 * norm.z;
    g11 = g11 * norm.w;
    let n00 = dot(g00, vec2f(fx.x, fy.x));
    let n10 = dot(g10, vec2f(fx.y, fy.y));
    let n01 = dot(g01, vec2f(fx.z, fy.z));
    let n11 = dot(g11, vec2f(fx.w, fy.w));
    let fade_xy = fade2(Pf.xy);
    let n_x = mix(vec2f(n00, n01), vec2f(n10, n11), vec2f(fade_xy.x));
    let n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

fn perlinPack(uv: vec2f) -> f32 {
    var definition = 8.00;
    var scale = 1.0; // Some more gold
    var seed = vec2f(sin(f32(time) * 0.01), cos(f32(time) * 0.01));
    return perlinNoise2((uv + seed) * scale) * definition;
}

fn acidZebra(uv: vec2f) -> f32 {
    var vibe = 0.9 + sin(f32(time) * 0.001) * 0.9;
    var frequency = 5.0;
    return bandNoise(vec3f(uv, vibe * frequency)) * intensity; //Gold
}

fn vibeGlass(uv: vec2f) -> f32 {
    var vibe = 1.0 + sin(f32(time) * 0.1) * 0.5;
    var zebra = acidZebra(uv);
    return perlinPack(uv) * zebra * vibe;
}

// cosine based palette, 4 vec3 params
fn palette1(t: f32) -> vec3<f32> {
    var a = vec3f(0.5, 0.5, 0.5);
    var b = vec3f(0.5, 0.5, 0.5);
    var c = vec3f(1.0, 1.0, 1.0);
    var d = vec3f(0.0, 0.1, 0.2);
    return a + b*cos( 6.28318*(c*t+d) );
}

fn palette2(t: f32) -> vec3<f32> {
    var a = vec3f(0.5, 0.5, 0.5);
    var b = vec3f(0.5, 0.5, 0.5);
    var c = vec3f(1.0, 1.0, 1.0);
    var d = vec3f(0.30, 0.20, 0.20);
    return a + b*cos( 6.28318*(c*t+d) );
}

fn palette3(t: f32) -> vec3<f32> {
    var a = vec3f(0.5, 0.5, 0.5);
    var b = vec3f(0.5, 0.5, 0.5);
    var c = vec3f(1.0, 0.7, 0.4);
    var d = vec3f(0.00, 0.15, 0.20);
    return a + b*cos( 6.28318*(c*t+d) );
}

fn palette4(t: f32) -> vec3<f32> {
    var a = vec3f(0.8, 0.5, 0.4);
    var b = vec3f(0.2, 0.4, 0.2);
    var c = vec3f(2.0, 1.0, 1.0);
    var d = vec3f(0.00, 0.25, 0.25);
    return a + b*cos( 6.28318*(c*t+d) );
}

fn rgb_to_intensity(rgb: vec3<f32>) -> f32 {
    return 0.299*rgb.x + 0.587*rgb.y + 0.114*rgb.z;  // standard formula for grayscale
}

// Gerstner Wave parameters
// const float amplitude = 0.2;
// const vec2 direction = vec2(1.0, 0.0);
// const float frequency = 2.0;
// const float phase = 2.0;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    var amplitude = 1.1;
    var frequency = 4.0;
    var speed = 0.05;
    var direction1 = vec2f(-0.2, 0.2);
    var direction2 = vec2f(0.0, -0.4);

    var pos = input.pos;

    var theta = dot(direction1, pos.xy) * frequency + speed * f32(time);
    var theta2 = dot(direction2, pos.xy) * frequency + speed * f32(time);
    //pos.x += amplitude * direction.x * cos(theta);
    //pos.y += amplitude * direction.y * cos(theta);
    pos.z += amplitude * sin(theta);
    pos.z += amplitude * sin(theta2);

    var output: VertexOutput;
    output.pos = view.matrix * vec4f(pos, 1.0);
    output.uv = input.uv * 0.5 + 0.5;
    output.theta = theta; // Add this line
    return output;
}

fn clamp01(x: f32) -> f32 {
    return min(1.0, max(0.0, x));
}

fn northlights(input: VertexOutput) -> vec4<f32> {
    var wave = 0.5 + 0.5 * cos(input.theta); // -1 - 1
    var rim = clamp01(cos(input.theta) * 0.9 - 0.7); // 0 - 1
    
    var vibe = 1.0 + sin(f32(time) * 0.1) * 0.5;
    var color = vec4f(input.uv, input.uv.y, 1.0);
    var perlin = perlinPack(input.uv);
    var grain_amount = 0.1;
    var simplex = simplexNoise2(input.uv * grain_amount) * 0.1;

    var layer1 = mix(color, vec4f(0.2, 1.0, 1.0, 1.0), perlin);
    let intense = rgb_to_intensity(layer1.xyz);

    var remap1 = palette1(intense + simplex);
    var remap2 = palette2(intense + simplex);
    var remap3 = palette3(intense + simplex);
    var remap4 = palette4(intense + simplex);

    var mix1 = mix(remap1, remap2, wave);
    var output = vec4f(mix1.xyz - (wave / 1.6), 1.0);

    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    return northlights(input);
}
