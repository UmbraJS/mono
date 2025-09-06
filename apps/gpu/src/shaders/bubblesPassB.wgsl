// Pass B: fullscreen refract/color using blurred half-res height map
struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
@vertex
fn vs(@builtin(vertex_index) vid: u32) -> VSOut {
  var p = array<vec2<f32>,3>(vec2<f32>(-1.0,-3.0), vec2<f32>(3.0,1.0), vec2<f32>(-1.0,1.0));
  var o: VSOut; o.pos = vec4<f32>(p[vid],0.0,1.0); o.uv = 0.5*(p[vid]+vec2<f32>(1.0)); return o;
}

struct ParamsB {
  resolution: vec2<f32>,
  refractCoarse: f32,
  refractFine: f32,
  bubbleOpacity: f32,
};
@group(0) @binding(0) var<uniform> PB : ParamsB;
@group(0) @binding(1) var heightTexHalf : texture_2d<f32>; // sourcing from rgba16float, we sample .r
@group(0) @binding(2) var sampLinear : sampler;

fn bgColor(uv: vec2<f32>) -> vec3<f32> {
  let sweep = dot(normalize(vec2<f32>(0.8,0.6)), uv - vec2<f32>(0.5));
  var base = mix(vec3<f32>(0.10,0.12,0.26), vec3<f32>(0.98,0.58,0.30), smoothstep(-0.5,0.6,sweep));
  base = mix(base, vec3<f32>(0.26,0.70,1.00), clamp(length(uv-vec2<f32>(0.5))*1.2,0.0,1.0)*0.8);
  let bands = sin(uv.x * 18.0) * 0.5 + 0.5;
  base = mix(base, vec3<f32>(0.20,0.55,0.95), bands * 0.3);
  return base;
}
fn height(uv: vec2<f32>) -> f32 { return textureSampleLevel(heightTexHalf, sampLinear, uv, 0.0).r; }

@fragment
fn fs(i: VSOut) -> @location(0) vec4<f32> {
  let uv = i.uv; let res = PB.resolution; let texel = 1.0 / res;
  let H = height(uv);
  let nx = height(uv + vec2<f32>(texel.x,0.0)) - height(uv - vec2<f32>(texel.x,0.0));
  let ny = height(uv + vec2<f32>(0.0,texel.y)) - height(uv - vec2<f32>(0.0,texel.y));
  let G = 0.5 * vec2<f32>(nx, ny);
  let bendC = PB.refractCoarse * (0.55 + 0.6 * H);
  let uvC = clamp(uv + G * bendC, vec2<f32>(0.0), vec2<f32>(1.0));
  var col = bgColor(uvC);
  if (PB.refractFine > 0.0) {
    let bendF = PB.refractFine * (0.55 + 0.6 * H);
    let uvR = clamp(uv + G * bendF * 0.99, vec2<f32>(0.0), vec2<f32>(1.0));
    let uvG = clamp(uv + G * bendF * 1.00, vec2<f32>(0.0), vec2<f32>(1.0));
    let uvB = clamp(uv + G * bendF * 1.01, vec2<f32>(0.0), vec2<f32>(1.0));
    col = mix(col, vec3<f32>(bgColor(uvR).r, bgColor(uvG).g, bgColor(uvB).b), 0.5);
  }
  let mask = smoothstep(0.05, 0.90, H) * PB.bubbleOpacity;
  let gmag = clamp(length(G) * 9.0, 0.0, 1.0);
  col += smoothstep(0.35, 0.95, gmag) * 0.25;
  let outside = vec3<f32>(0.0);
  let outCol = mix(outside, col, mask);
  return vec4<f32>(outCol,1.0);
}
