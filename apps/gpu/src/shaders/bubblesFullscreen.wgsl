// Fullscreen refraction bubbles (static layout)
// Adapted to Moonbow pipeline (entry points renamed vertexMain/fragmentMain)
struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };

@vertex
fn vertexMain(@builtin(vertex_index) vid: u32) -> VSOut {
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -3.0),
    vec2<f32>( 3.0,  1.0),
    vec2<f32>(-1.0,  1.0)
  );
  let pos = p[vid];
  var o: VSOut;
  o.pos = vec4<f32>(pos, 0.0, 1.0);
  o.uv  = 0.5 * (pos + vec2<f32>(1.0));
  return o;
}

// ------------------------ Tweakables (internal) -----------------------
const NUM_BUBBLES    : u32 = 140u;
const BASE_RADIUS    : f32 = 0.06;
const RADIUS_JITTER  : f32 = 0.85;
const EDGE_SOFTNESS  : f32 = 0.020;

const NOISE_SCALE    : f32 = 3.0;
const WARP_AMOUNT    : f32 = 0.060;
const FBM_GAIN       : f32 = 0.50;
const FBM_LACUNARITY : f32 = 2.10;
const FBM_OCTAVES    : u32 = 4u;

const REFRACT_STRENGTH: f32 = 0.045;
const BUBBLE_OPACITY  : f32 = 0.92;

const SEED           : f32 = 3.14159; // change for new layout

// ---------------------------- Utilities ----------------------------------
fn hash31(i: f32) -> vec3<f32> {
  return fract(sin(vec3<f32>(i, i+1.23, i+2.34)) * 43758.5453);
}

fn vhash(p: vec2<f32>) -> f32 {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

fn vnoise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = vhash(i + vec2<f32>(0.0, 0.0));
  let b = vhash(i + vec2<f32>(1.0, 0.0));
  let c = vhash(i + vec2<f32>(0.0, 1.0));
  let d = vhash(i + vec2<f32>(1.0, 1.0));
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p0: vec2<f32>, oct: u32, gain: f32, lac: f32) -> f32 {
  var p = p0;
  var a = 0.5;
  var s = 0.0;
  var i: u32 = 0u;
  loop {
    s += a * vnoise(p);
    a *= gain;
    p *= lac;
    i += 1u;
    if (i >= oct) { break; }
  }
  return s;
}

// ---------------------------- Background ---------------------------------
fn backgroundField(uv: vec2<f32>) -> vec3<f32> {
  let c1 = vec3<f32>(0.10, 0.05, 0.15);
  let c2 = vec3<f32>(0.95, 0.60, 0.30);
  let c3 = vec3<f32>(0.35, 0.65, 0.95);
  let r  = clamp(length(uv - vec2<f32>(0.5, 0.5)) * 1.6, 0.0, 1.0);
  var base = mix(c2, c3, r);
  base = mix(c1, base, smoothstep(0.0, 1.0, r));
  let nR = fbm(uv * (NOISE_SCALE * 0.5) + 11.7, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY);
  let nG = fbm(uv * (NOISE_SCALE * 0.6) + 21.3, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY);
  let nB = fbm(uv * (NOISE_SCALE * 0.7) + 31.9, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY);
  return base + 0.08 * vec3<f32>(nR, nG, nB);
}

// --------------------------- Bubbles (height) -----------------------------
fn bubbleMask(uv: vec2<f32>, center: vec2<f32>, radius: f32, edge: f32, seed: f32) -> f32 {
  let w = WARP_AMOUNT * (fbm(uv * NOISE_SCALE + seed, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY) * 2.0 - 1.0);
  let q = uv + vec2<f32>(w, w);
  let d = distance(q, center);
  return clamp(1.0 - smoothstep(radius, radius + edge, d), 0.0, 1.0);
}

fn smax(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(a, b, h) + k * h * (1.0 - h);
}

fn bubbleHeight(uv: vec2<f32>) -> f32 {
  var h = 0.0;
  let k  = 0.25;
  let ga = 2.39996323;
  for (var i: u32 = 0u; i < NUM_BUBBLES; i = i + 1u) {
    let fi = f32(i);
    let r3 = hash31(fi + SEED * 113.0);
    let t = fi * ga;
    let ring = fract(r3.x + fi * 0.618) * 0.45;
    let base = vec2<f32>(0.5, 0.5) + vec2<f32>(cos(t), sin(t)) * ring;
    let jitter = (r3.yz - vec2<f32>(0.5)) * 0.25;
    let pos = clamp(base + jitter, vec2<f32>(0.08), vec2<f32>(0.92));
    let rr = BASE_RADIUS * mix(1.0 - RADIUS_JITTER, 1.0 + RADIUS_JITTER, r3.x);
    let m  = bubbleMask(uv, pos, rr, EDGE_SOFTNESS, r3.x * 10.0);
    h = smax(h, m, k);
  }
  return pow(clamp(h, 0.0, 1.0), 0.75);
}

@fragment
fn fragmentMain(i: VSOut) -> @location(0) vec4<f32> {
  let uv = i.uv;
  let bg  = backgroundField(uv);
  let H   = bubbleHeight(uv);
  let nx = dpdx(H);
  let ny = dpdy(H);
  let refrUv = clamp(uv + vec2<f32>(nx, ny) * REFRACT_STRENGTH, vec2<f32>(0.0), vec2<f32>(1.0));
  let refracted = backgroundField(refrUv);
  let rim  = smoothstep(0.0, 0.7, H) * (1.0 - H);
  let spec = pow(clamp(1.0 - abs(nx) - abs(ny), 0.0, 1.0), 8.0);
  var color = mix(bg, refracted, clamp(H * BUBBLE_OPACITY, 0.0, 1.0));
  color += 0.15 * rim + 0.07 * spec;
  return vec4<f32>(color, 1.0);
}
