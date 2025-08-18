// ---------------- core: generateSpline + curves ----------------
const deg2rad = (d) => (d * Math.PI) / 180;
const normDeg = (d) => ((d % 360) + 360) % 360;
const vecFromAngle = (d) => {
  const r = deg2rad(normDeg(d)); // 0=right, 90=down (SVG coords)
  return { x: Math.cos(r), y: Math.sin(r) };
};
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a, s) => ({ x: a.x * s, y: a.y * s });
const hv = (v) => (Math.abs(v.x) >= Math.abs(v.y) ? 'h' : 'v');

// API:
// const { d } = generateSpline({
//   curve: cubic.with({ startTension: 2.5, endTension: 2 }),
//   pins: [
//     { x: 50, y: 250, angle: 90, length: 20 },
//     { x: 590, y: 250, angle: 45, length: 20 },
//   ],
//   includePins: true
// });

export function generateSpline({ pins, curve, includePins = true }) {
  const [start, end] = pins;
  const sDir = vecFromAngle(start.angle);
  const eDir = vecFromAngle(end.angle);

  const p0 = { x: start.x, y: start.y };
  const p1 = add(p0, mul(sDir, start.length)); // end of start pin
  const p3 = { x: end.x, y: end.y };
  const p2 = sub(p3, mul(eDir, end.length)); // start of end pin

  const ctx = {
    p0,
    p1,
    p2,
    p3,
    start: { ...start, dir: sDir },
    end: { ...end, dir: eDir },
  };
  const bodyD = curve(ctx);

  const pinsD = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} M ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`;
  const d = includePins
    ? `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} ${bodyD} L ${p3.x} ${p3.y}`
    : `M ${p1.x} ${p1.y} ${bodyD} L ${p2.x} ${p2.y}`;

  return { d, bodyD, pinsD, points: { p0, p1, p2, p3 } };
}

// --- curves: import only what you need in your app build ---
const cubic = Object.assign(
  (ctx, opts = {}) => {
    const { p1, p2, start, end } = ctx;
    const st = Math.max(0, opts.startTension ?? 2);
    const et = Math.max(0, opts.endTension ?? 2);
    const c1 = add(p1, mul(start.dir, start.length * st));
    const c2 = sub(p2, mul(end.dir, end.length * et));
    return `C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  },
  { with: (opts) => (ctx) => cubic(ctx, opts) }
);

const quadratic = Object.assign(
  (ctx, opts = {}) => {
    const { p1, p2, start, end } = ctx;
    const st = Math.max(0, opts.startTension ?? 2);
    const et = Math.max(0, opts.endTension ?? 2);
    const c1 = add(p1, mul(start.dir, start.length * st));
    const c2 = sub(p2, mul(end.dir, end.length * et));
    const q = { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 };
    return `Q ${q.x} ${q.y}, ${p2.x} ${p2.y}`;
  },
  { with: (opts) => (ctx) => quadratic(ctx, opts) }
);

const straight = Object.assign((ctx) => `L ${ctx.p2.x} ${ctx.p2.y}`, {
  with: () => (ctx) => straight(ctx),
});

// --- Excalidraw-like elbow (orthogonal) ---
// Final leg aligns with end pin’s dominant axis + sign.
// Picks shortest HV/VH to a point near the end, and in "auto" centers the elbow
// if we’d approach the end from the opposite direction.
const elbow = Object.assign(
  (ctx, opts = {}) => {
    const { p1, p2, end } = ctx;
    const step = Math.max(1, opts.step ?? 24);
    const mode = opts.mode ?? 'auto';

    const axis2 = hv(end.dir); // "h" or "v" (dominant axis of end pin)
    // Approach point just before p2 so the last command is along axis2 in the correct sign
    const ext2 =
      axis2 === 'h'
        ? { x: p2.x - Math.sign(end.dir.x || 1) * step, y: p2.y }
        : { x: p2.x, y: p2.y - Math.sign(end.dir.y || 1) * step };

    // Two candidates p1 -> ext2 : H-first or V-first
    const candH = [];
    const candV = [];
    if (p1.x !== ext2.x) candH.push(['H', ext2.x]);
    if (p1.y !== ext2.y) candH.push(['V', ext2.y]);
    if (p1.y !== ext2.y) candV.push(['V', ext2.y]);
    if (p1.x !== ext2.x) candV.push(['H', ext2.x]);
    // ext2 -> p2 along axis2
    candH.push(axis2 === 'h' ? ['H', p2.x] : ['V', p2.y]);
    candV.push(axis2 === 'h' ? ['H', p2.x] : ['V', p2.y]);

    const partsLen = (parts, cur = { ...p1 }) => {
      let L = 0;
      for (const [cmd, val] of parts) {
        if (cmd === 'H') {
          L += Math.abs(val - cur.x);
          cur.x = val;
        } else {
          L += Math.abs(val - cur.y);
          cur.y = val;
        }
      }
      return L;
    };
    const Lh = partsLen(candH),
      Lv = partsLen(candV);
    let chosen = Lh <= Lv ? candH : candV;

    const toStr = (parts) => parts.map(([c, v]) => `${c} ${v}`).join(' ');
    const centerize = () => {
      const out = [];
      if (axis2 === 'h') {
        const midX = (p1.x + ext2.x) / 2;
        if (p1.x !== midX) out.push(['H', midX]);
        if (p1.y !== ext2.y) out.push(['V', ext2.y]);
        out.push(['H', p2.x]);
      } else {
        const midY = (p1.y + ext2.y) / 2;
        if (p1.y !== midY) out.push(['V', midY]);
        if (p1.x !== ext2.x) out.push(['H', ext2.x]);
        out.push(['V', p2.y]);
      }
      return out;
    };

    if (mode === 'center') return toStr(centerize());
    if (mode === 'shortest') return toStr(chosen);
    if (mode === 'prefer-start')
      return toStr(axis2 === 'h' ? candV : candH); // bend earlier
    if (mode === 'prefer-end')
      return toStr(axis2 === 'h' ? candH : candV); // bend later

    // auto: use shortest unless approach opposes end pin sign, then centerize
    const lastBefore = (() => {
      let cur = { ...p1 };
      for (let i = 0; i < chosen.length - 1; i++) {
        const [cmd, val] = chosen[i];
        if (cmd === 'H') cur.x = val;
        else cur.y = val;
      }
      return cur;
    })();
    const approachSign =
      axis2 === 'h'
        ? Math.sign(p2.x - lastBefore.x) || 1
        : Math.sign(p2.y - lastBefore.y) || 1;
    const endSign =
      axis2 === 'h'
        ? Math.sign(end.dir.x || 1)
        : Math.sign(end.dir.y || 1);
    if (approachSign !== endSign) return toStr(centerize());
    return toStr(chosen);
  },
  { with: (opts) => (ctx) => elbow(ctx, opts) }
);
