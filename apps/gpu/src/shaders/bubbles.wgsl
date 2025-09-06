// ===== bindings kept as-is ==================================================
struct VertexInput { @location(0) pos: vec3f, @location(1) norm: vec3f, @location(2) uv: vec2f }
struct VertexOutput { @builtin(position) pos: vec4f, @location(0) uv: vec2f }
struct ViewProjectionMatrix { matrix: mat4x4f, }
struct Params {
  resolution: vec2f, time: f32, seed: f32,
  numBubbles: u32, baseRadius: f32, radiusJitter: f32, edgeSoftness: f32,
  noiseScale: f32, warpAmount: f32, fbmGain: f32, fbmLacunarity: f32, fbmOctaves: u32,
  refractStrength: f32, bubbleOpacity: f32, _pad: vec2f,
}
@group(0) @binding(0) var<uniform> _timeCounter: u32;
@group(0) @binding(1) var<uniform> _dummyIntensity: f32;
@group(0) @binding(2) var<uniform> view: ViewProjectionMatrix;
@group(0) @binding(3) var<uniform> P: Params;

// ===== look knobs ===========================================================
const NUM_BUBBLES    : u32 = 130u;
const BASE_RADIUS    : f32 = 0.055;
const RADIUS_JITTER  : f32 = 0.85;

const NOISE_SCALE    : f32 = 3.0;
const FBM_GAIN       : f32 = 0.50;
const FBM_LACUNARITY : f32 = 2.10;
const FBM_OCTAVES    : u32 = 4u;

const RIM_WARP       : f32 = 0.055;
const BEND_COARSE    : f32 = 0.085;                  // main lens strength
const BEND_FINE      : f32 = 0.012;                  // toned-down chroma split
const CHROMA         : vec3<f32> = vec3<f32>(0.99, 1.00, 1.01);

const BLACK_OUTSIDE  : bool = true;
const OPACITY        : f32 = 1.0;
const SEED           : f32 = 1.41421;

// per-bubble local field knobs
const LOCAL_SCALE_MIN : f32 = 0.8;
const LOCAL_SCALE_MAX : f32 = 2.2;
const LOCAL_NOISE     : f32 = 2.5;
const PALETTE_STRENGTH: f32 = 0.55;

// ===== vertex ===============================================================
@vertex
fn vertexMain(i: VertexInput) -> VertexOutput {
  var o: VertexOutput;
  o.pos = view.matrix * vec4f(i.pos, 1.0);
  o.uv  = i.uv;
  return o;
}

// ===== utils ================================================================
fn hash21(p: vec2f) -> f32 {
  let h = dot(p, vec2f(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}
fn hash31(i: f32) -> vec3f {
  return fract(sin(vec3f(i, i+1.23, i+2.34)) * 43758.5453);
}
fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash21(i + vec2f(0.0, 0.0));
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  let u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
fn fbm(p0: vec2f, oct: u32, gain: f32, lac: f32) -> f32 {
  var p = p0; var a = 0.5; var s = 0.0; var i: u32 = 0u;
  loop { s += a * vnoise(p); a *= gain; p *= lac; i += 1u; if (i >= oct) { break; } }
  return s;
}

// ===== background (only used inside bubbles if BLACK_OUTSIDE=true) ==========
fn backgroundField(uv: vec2f) -> vec3f {
  let sweep = dot(normalize(vec2f(0.8, 0.6)), uv - vec2f(0.5));
  var base  = mix(vec3f(0.10,0.12,0.26), vec3f(0.98,0.58,0.30), smoothstep(-0.5, 0.6, sweep));
  base      = mix(base, vec3f(0.26,0.70,1.00), clamp(length(uv-vec2f(0.5))*1.2, 0.0, 1.0)*0.8);
  let bands = sin(uv.x * 18.0) * 0.5 + 0.5;
  base = mix(base, vec3f(0.20,0.55,0.95), bands * 0.3);
  let n = vec3f(
    fbm(uv*(NOISE_SCALE*0.7)+11.7, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY),
    fbm(uv*(NOISE_SCALE*0.8)+21.3, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY),
    fbm(uv*(NOISE_SCALE*0.9)+31.9, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY)
  );
  return base + 0.18 * n;
}

// ===== bubble domes (edge-warp; smooth interior) ============================
fn bubbleDome(uv: vec2f, center: vec2f, radius: f32, seed: f32, curvature: f32) -> f32 {
  let d = distance(uv, center);
  let t = clamp(1.0 - d / radius, 0.0, 1.0);              // 1 at center → 0 at edge
  let edge = smoothstep(0.4, 0.0, t);                      // 1 near rim
  let w = RIM_WARP * edge * (fbm(uv * NOISE_SCALE + seed, FBM_OCTAVES, FBM_GAIN, FBM_LACUNARITY) * 2.0 - 1.0);
  let qd = distance(uv + vec2f(w, w), center);
  let tq = clamp(1.0 - qd / radius, 0.0, 1.0);
  return pow(tq, curvature);
}
fn smax(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(a, b, h) + k * h * (1.0 - h);
}
fn bubbleHeight(uv: vec2f) -> f32 {
  var h = 0.0;
  let k  = 0.22;
  let ga = 2.39996323;
  for (var i: u32 = 0u; i < NUM_BUBBLES; i = i + 1u) {
    let fi = f32(i);
    let r3 = hash31(fi + SEED*113.0 + P.seed);
    let t  = fi * ga;

    let ring   = fract(r3.x + fi * 0.618) * 0.33;
    let base   = vec2f(0.5) + vec2f(cos(t), sin(t)) * ring;
    let jitter = (r3.yz - vec2f(0.5)) * 0.15;
    let pos    = clamp(base + jitter, vec2f(0.08), vec2f(0.92));

    let rr     = BASE_RADIUS * mix(1.0 - RADIUS_JITTER, 1.0 + RADIUS_JITTER, r3.x);
    let curved = mix(0.9, 1.4, r3.y);
    let dome   = bubbleDome(uv, pos, rr, r3.x*10.0, curved);
    h = smax(h, dome, k);
  }
  return clamp(pow(h, 0.95), 0.0, 1.0);
}

// blur + gradient for lensing
fn blurHeight(uv: vec2f, tex: vec2f) -> f32 {
  var s = 0.0;
  s += bubbleHeight(uv + tex*vec2f(-1.0,-1.0));
  s += bubbleHeight(uv + tex*vec2f( 0.0,-1.0));
  s += bubbleHeight(uv + tex*vec2f( 1.0,-1.0));
  s += bubbleHeight(uv + tex*vec2f(-1.0, 0.0));
  s += bubbleHeight(uv);
  s += bubbleHeight(uv + tex*vec2f( 1.0, 0.0));
  s += bubbleHeight(uv + tex*vec2f(-1.0, 1.0));
  s += bubbleHeight(uv + tex*vec2f( 0.0, 1.0));
  s += bubbleHeight(uv + tex*vec2f( 1.0, 1.0));
  return s / 9.0;
}
fn gradHeight(uv: vec2f, tex: vec2f) -> vec2f {
  let h1 = blurHeight(uv + vec2f(tex.x, 0.0), tex);
  let h2 = blurHeight(uv - vec2f(tex.x, 0.0), tex);
  let h3 = blurHeight(uv + vec2f(0.0, tex.y), tex);
  let h4 = blurHeight(uv - vec2f(0.0, tex.y), tex);
  return 0.5 * vec2f(h1 - h2, h3 - h4);
}

// ===== themed, noise-driven per-bubble color ================================
// cosine palette helper
fn cosPalette(t: f32, a: vec3f, b: vec3f, c: vec3f, d: vec3f) -> vec3f {
  return a + b * cos(6.28318 * (c * t + d));
}
// purple → magenta → orange → teal theme
fn themeColor(t: f32) -> vec3f {
  let a = vec3f(0.48, 0.42, 0.50);
  let b = vec3f(0.45, 0.40, 0.35);
  let c = vec3f(1.00, 0.92, 0.85);
  let d = vec3f(0.05, 0.28, 0.60);
  return cosPalette(t, a, b, c, d);
}
// bubble-local field: low-freq bands + subtle detail drive a single scalar t
fn bubbleLocalField(local: vec2f, seed3: vec3f) -> vec3f {
  let baseScale : f32 = mix(0.8, 1.8, seed3.x);
  let dir       : vec2f = normalize(vec2f(cos(seed3.y*6.28318), sin(seed3.y*6.28318)));
  let bands     : f32 = 0.6 * vnoise(local * baseScale + dir * 0.7)
                      + 0.4 * vnoise(local * (baseScale*1.9) + dir.yx * 1.3);
  let detail    : f32 = fbm(local * 2.8 + seed3.z * 7.1, 3u, 0.55, 2.1) * 0.25;

  var t : f32 = clamp(bands + detail, 0.0, 1.0);
  var col : vec3f = themeColor(t);

  // tiny hue jitter per bubble
  let hueJitter : vec3f = vec3f(0.03, -0.02, 0.01) * (seed3 - 0.5);
  col = clamp(col + hueJitter, vec3f(0.0), vec3f(1.0));

  // mild contrast lift
  col = mix(vec3f(0.5), col, 1.15);
  return col;
}

// ===== fragment =============================================================
@fragment
fn fragmentMain(i: VertexOutput) -> @location(0) vec4f {
  let uv  = i.uv;
  let res = max(P.resolution, vec2f(1024.0, 1024.0));
  let tex = 1.0 / res;

  let Hb  = blurHeight(uv, tex);
  let G   = gradHeight(uv, tex);
  let bendCoarse = BEND_COARSE * (0.55 + 0.6 * Hb);
  let bendFine   = BEND_FINE   * (0.55 + 0.6 * Hb);

  var acc  : vec3f = vec3f(0.0);
  var wsum : f32   = 0.0;

  let ga = 2.39996323;
  for (var bi: u32 = 0u; bi < NUM_BUBBLES; bi = bi + 1u) {
    let fbi = f32(bi);
    let r3  = hash31(fbi + SEED*113.0 + P.seed);
    let t   = fbi * ga;

    let ring   = fract(r3.x + fbi * 0.618) * 0.33;
    let base   = vec2f(0.5) + vec2f(cos(t), sin(t)) * ring;
    let jitter = (r3.yz - vec2f(0.5)) * 0.15;
    let pos    = clamp(base + jitter, vec2f(0.08), vec2f(0.92));
    let rr     = BASE_RADIUS * mix(1.0 - RADIUS_JITTER, 1.0 + RADIUS_JITTER, r3.x);
    let curved = mix(0.9, 1.4, r3.y);

    let w = bubbleDome(uv, pos, rr, r3.x*10.0, curved);
    if (w > 0.0001) {
      let theta : f32 = r3.x * 6.28318;
      let cs : f32 = cos(theta);
      let sn : f32 = sin(theta);
      let rot : mat2x2<f32> = mat2x2<f32>(cs, -sn, sn, cs);
      let scale : f32 = mix(LOCAL_SCALE_MIN, LOCAL_SCALE_MAX, r3.y);
      let local : vec2f = rot * ((uv - pos) / rr) * scale;

      // refract bubble-local coords by global gradient
      let baseLocal = local + rot * (G * bendCoarse);
      var col = bubbleLocalField(baseLocal, r3);

      // optional micro RGB split near edges (very subtle)
      let edgeAmt = clamp(length(G) * 12.0, 0.0, 1.0);
      if (edgeAmt > 0.0) {
        let colR = bubbleLocalField(baseLocal + rot * (G * bendFine * CHROMA.r), r3).r;
        let colG = bubbleLocalField(baseLocal + rot * (G * bendFine * CHROMA.g), r3).g;
        let colB = bubbleLocalField(baseLocal + rot * (G * bendFine * CHROMA.b), r3).b;
        let split = vec3f(colR, colG, colB);
        col = mix(col, split, edgeAmt * 0.35);
      }

      acc  += col * w;
      wsum += w;
    }
  }

  let bubbleCol = select(vec3f(0.0), acc / max(wsum, 1e-4), wsum > 0.0);
  let mask = smoothstep(0.06, 0.85, Hb) * OPACITY;

  let outside = select(backgroundField(uv), vec3f(0.0), BLACK_OUTSIDE);
  var outColor = mix(outside, bubbleCol, mask);

  // thin rim lift for readability
  let gmag  = clamp(length(G) * 9.0, 0.0, 1.0);
  outColor += smoothstep(0.35, 0.95, gmag) * 0.25;

  return vec4f(outColor, 1.0);
}
