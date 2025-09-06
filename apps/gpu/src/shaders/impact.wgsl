
@group(0) @binding(0) var<uniform> time: f32;
const size = f32(0.7);

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) normal: vec3<f32>,
};

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 3>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(3.0, -1.0),
        vec2<f32>(-1.0, 3.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    output.uv = 0.5 * (pos[vertexIndex] + vec2<f32>(1.0, 1.0));
    output.normal = vec3<f32>(0.0, 0.0, 1.0);
    return output;
}

fn rotationMatrix(axis: vec3<f32>, angle: f32) -> mat4x4<f32> {
    let s = sin(angle);
    let c = cos(angle);
    let oc = 1.0 - c;
    
    return mat4x4<f32>(
        oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
        0.0,                                0.0,                                0.0,                                1.0
    );
}

fn rotate(v: vec3<f32>, axis: vec3<f32>, angle: f32) -> vec3<f32> {
    let m = rotationMatrix(axis, angle);
    return (m * vec4<f32>(v, 1.0)).xyz;
}

fn sdBox(p: vec3<f32>, b: vec3<f32>) -> f32 {
    let q = abs(p) - b;
    return length(max(q, vec3<f32>(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0);
}

fn sphere(p: vec3<f32>, r: f32) -> f32 {
    return length(p) - r;
}

fn SineCrazy(p: vec3<f32>) -> f32 {
    return 1.0 - (sin(p.x) + sin(p.y) + sin(p.z)) / 3.0;
}

fn SineCrazyWrapper(p: vec3<f32>) -> f32 {
    let minScale = 4.0;
    let scaleFactor = minScale;
    let scale = minScale + scaleFactor * sin(time * 0.7);
    let amount = 0.85;
    return (amount - SineCrazy(p * scale)) / scale;
}

fn scene(p: vec3<f32>) -> f32 {
    let p1 = rotate(p, vec3<f32>(1.0, 1.0, 1.0), time) / 2.0;
    let box = sdBox(p1, vec3<f32>(0.4));
    let sphere = sphere(p, size);
    let sine = SineCrazyWrapper(p1);

    return max(sphere, sine);
}

fn getNormal(p: vec3<f32>) -> vec3<f32> {
    let e = vec2<f32>(0.001, 0.0);
    return normalize(vec3<f32>(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
}

fn GetColor(amount: f32) -> vec3<f32> {
    let col = 0.5 + 0.5 * cos(5.58318 * (vec3<f32>(0.2, 2.0, 2.0) + amount + vec3<f32>(1.0, 1.0, 0.5)));
    return col * amount;
}

fn GetColorAmount(p: vec3<f32>) -> vec3<f32> {
    let amount = clamp((1.5 - length(p)) / 2.0, 0.0, 1.0);
    let col = 0.5 + 0.5 * cos(6.28318 * (vec3<f32>(0.2, 0.0, 0.0) + amount + vec3<f32>(1.0, 1.0, 0.5)));
    return col * amount;
}

fn palette(t: f32, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>, d: vec3<f32>) -> vec3<f32> {
    return a + b * cos(6.283185 * (c * t + d));
}

fn getNewColor(t: f32) -> vec3<f32> {
    let a = vec3<f32>(0.5, 0.5, 0.5);
    let b = vec3<f32>(0.5, 0.5, 0.5);
    let c = vec3<f32>(1.0, 1.0, 1.0);
    let d = vec3<f32>(0.0, 0.10, 0.20);
    return palette(t, a, b, c, d);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
    let newUV = vec3<f32>(input.uv - vec2<f32>(0.5), -1.0);
    let p = newUV;

    let camPos = vec3<f32>(0.0, 0.0, 2.0);
    let ray = normalize(p);
    var rayPos = camPos;

    var curDist = 0.0;
    var rayLen = 0.0;

    let definition = 0.8;
    let brightness = 0.15;
    let light = vec3<f32>(1.0, 2.0, 1.5);
    var color = vec3<f32>(0.0);

    for (var i: i32 = 0; i <= 100; i++) {
        curDist = scene(rayPos);
        rayLen += definition * curDist;

        rayPos = camPos + ray * rayLen;

        if (abs(curDist) < 0.001) {
            let n = getNormal(rayPos);
            let diff = dot(n, light) + 1.0;
            let colorPosition = length(rayPos * diff) * 0.5 + 1.0;

            if (length(rayPos) > size) {
                color = GetColor(length(rayPos)) * diff + rayPos;
            } else {
                color = getNewColor(colorPosition) * diff;
            }
            break;
        }

        color += brightness * GetColorAmount(rayPos);
    }

    return vec4<f32>(color, 1.0);
}