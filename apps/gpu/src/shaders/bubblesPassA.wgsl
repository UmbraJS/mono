// Pass A: stamp domes at half resolution into r16float height map
struct ParamsA {
  size: vec2<u32>,
  time: f32,
  seed: f32,
  numBubbles: u32,
  baseRadius: f32,
  radiusJitter: f32,
  edgeWarp: f32,
  curvatureMin: f32,
  curvatureMax: f32,
};
@group(0) @binding(0) var<uniform> PA : ParamsA;
@group(0) @binding(1) var heightTex : texture_storage_2d<rgba16float, write>;

fn hash21(p: vec2<f32>) -> f32 {
  let h = dot(p, vec2<f32>(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}
fn vnoise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash21(i + vec2<f32>(0.0, 0.0));
  let b = hash21(i + vec2<f32>(1.0, 0.0));
  let c = hash21(i + vec2<f32>(0.0, 1.0));
  let d = hash21(i + vec2<f32>(1.0, 1.0));
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
fn fbm(p0: vec2<f32>) -> f32 {
  var p = p0; var a = 0.5; var s = 0.0;
  for (var i = 0; i < 4; i = i + 1) { s += a * vnoise(p); a *= 0.5; p *= 2.1; }
  return s;
}
fn rand31(i: f32) -> vec3<f32> { return fract(sin(vec3<f32>(i, i+1.23, i+2.34)) * 43758.5453); }

fn dome(uv: vec2<f32>, center: vec2<f32>, radius: f32, warp: f32, seed: f32, curvature: f32) -> f32 {
  let d = distance(uv, center);
  let t = clamp(1.0 - d / radius, 0.0, 1.0);
  let edge = smoothstep(0.4, 0.0, t);
  let w = warp * edge * (fbm(uv * 3.0 + seed) * 2.0 - 1.0);
  let qd = distance(uv + vec2<f32>(w, w), center);
  let tq = clamp(1.0 - qd / radius, 0.0, 1.0);
  return pow(tq, curvature);
}
fn smax(a: f32, b: f32, k: f32) -> f32 { let h = clamp(0.5 + 0.5 * (b - a)/k, 0.0, 1.0); return mix(a,b,h)+k*h*(1.0-h); }

@compute @workgroup_size(8,8,1)
fn csMain(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= PA.size.x || gid.y >= PA.size.y) { return; }
  let uv = (vec2<f32>(gid.xy) + 0.5) / vec2<f32>(PA.size);
  var h = 0.0; let k = 0.22; let ga = 2.39996323;
  for (var bi: u32 = 0u; bi < PA.numBubbles; bi = bi + 1u) {
    let fbi = f32(bi);
    let r3 = rand31(fbi + (PA.seed + PA.time*0.05) * 97.0);
    let t = fbi * ga;
    let ring = fract(r3.x + fbi * 0.618) * 0.33;
    let base = vec2<f32>(0.5,0.5) + vec2<f32>(cos(t), sin(t)) * ring;
    let jitter = (r3.yz - vec2<f32>(0.5)) * 0.15;
    let pos = clamp(base + jitter, vec2<f32>(0.06), vec2<f32>(0.94));
    let rr = PA.baseRadius * mix(1.0 - PA.radiusJitter, 1.0 + PA.radiusJitter, r3.x);
    let curved = mix(PA.curvatureMin, PA.curvatureMax, r3.y);
    let d = dome(uv, pos, rr, PA.edgeWarp, r3.x * 10.0, curved);
    h = smax(h, d, k);
  }
  h = clamp(pow(h, 0.95), 0.0, 1.0);
  textureStore(heightTex, vec2<i32>(gid.xy), vec4<f32>(h,0.0,0.0,0.0));
}
