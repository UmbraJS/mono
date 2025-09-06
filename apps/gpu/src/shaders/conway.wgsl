// Structs are like TS interfaces
struct VertexInput {
    @location(0) pos: vec2f,
    @builtin(instance_index) instance: u32,
};

struct VertexOutput {
    @builtin(position) pos: vec4f,
    @location(0) cell: vec2f,
};

// This is uniform data that is passed to the shader
@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cellState: array<u32>;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
    let state = f32(cellState[input.instance]);
    //Makes sure the square is aligned with the grid since the square would normally be aligned with the center
    let gridPos = (input.pos * state + 1) / grid;

    // Makes sure that 0 is bottom right and not center
    let normalisedPos = gridPos - 1;

    let i = f32(input.instance); // Type cast the instance to a float instead of an unsigned int
    // Maps cell instance to the grid
    let cell = vec2f(i % grid.x, floor(i / grid.x));

    let cellOffset = cell / grid * 2;
    let cellPos = normalisedPos + cellOffset;

    var output: VertexOutput;
    output.pos = vec4f(cellPos, 0, 1);
    output.cell = cell;
    return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let color = vec2f(input.cell/grid);
    return vec4f(color, color.y, 1);
}