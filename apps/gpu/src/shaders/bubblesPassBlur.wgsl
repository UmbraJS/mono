// Pass A': separable blur + optional dilation (run twice: H then V)
struct BlurParams {
  size: vec2<u32>,
  dir: vec2<f32>,
  radius: u32,
  dilate: f32,
};
@group(0) @binding(0) var<uniform> BP : BlurParams;
@group(0) @binding(1) var srcTex : texture_2d<f32>;
@group(0) @binding(2) var dstTex : texture_storage_2d<rgba16float, write>;
@group(0) @binding(3) var samplerLinear: sampler;

@compute @workgroup_size(8,8,1)
fn csBlur(@builtin(global_invocation_id) gid: vec3<u32>) {
  if (gid.x >= BP.size.x || gid.y >= BP.size.y) { return; }
  let uv = (vec2<f32>(gid.xy) + 0.5) / vec2<f32>(BP.size);
  let texel = 1.0 / vec2<f32>(BP.size);
  var wsum = 0.0; var s = 0.0; let r = i32(BP.radius);
  let sigma = max(1.0, f32(r) * 0.6);
  for (var k = -r; k <= r; k = k + 1) {
    let fk = f32(k);
    let w = exp(-0.5 * (fk/sigma)*(fk/sigma));
    let off = vec2<f32>(fk*BP.dir.x*texel.x, fk*BP.dir.y*texel.y);
    s += w * textureSampleLevel(srcTex, samplerLinear, uv + off, 0.0).r;
    wsum += w;
  }
  var h = s / max(1e-5, wsum);
  if (BP.dilate > 0.0) {
    let n1 = textureSampleLevel(srcTex, samplerLinear, uv + texel*vec2<f32>( 1.0, 0.0), 0.0).r;
    let n2 = textureSampleLevel(srcTex, samplerLinear, uv + texel*vec2<f32>(-1.0, 0.0), 0.0).r;
    let n3 = textureSampleLevel(srcTex, samplerLinear, uv + texel*vec2<f32>( 0.0, 1.0), 0.0).r;
    let n4 = textureSampleLevel(srcTex, samplerLinear, uv + texel*vec2<f32>( 0.0,-1.0), 0.0).r;
    let dil = max(max(n1,n2), max(n3,n4));
    h = mix(h, max(h,dil), BP.dilate);
  }
  textureStore(dstTex, vec2<i32>(gid.xy), vec4<f32>(h,0.0,0.0,0.0));
}
