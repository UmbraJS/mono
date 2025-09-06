<template>
  <div data-slot="black-hole-background" class="black-hole" v-bind="props">
    <slot />
    <canvas ref="canvasRef" class="blackhole-canvas" />
    <!-- animated gradient plume -->
    <motion.div class="blackhole-gradient" :animate="{ backgroundPosition: '0% 300%' }"
      :transition="{ duration: 5, ease: 'linear', repeat: Infinity }" />
    <!-- scanline overlay (dark mode) -->
    <div class="blackhole-overlay" />
  </div>

</template>

<script lang="ts" setup>
import { motion } from 'motion-v'

interface Disc { p: number; x: number; y: number; w: number; h: number }
interface Point { x: number; y: number }
interface Particle { x: number; sx: number; dx: number; y: number; vy: number; p: number; r: number; c: string }
interface Clip { disc?: Disc; i?: number; path?: Path2D }
interface State {
  discs: Disc[]
  lines: Point[][]
  particles: Particle[]
  clip: Clip
  startDisc: Disc
  endDisc: Disc
  rect: { width: number; height: number }
  render: { width: number; height: number; dpi: number }
  particleArea: { sw?: number; ew?: number; h?: number; sx?: number; ex?: number }
  linesCanvas?: HTMLCanvasElement
}
interface Props {
  strokeColor?: string
  numberOfLines?: number
  numberOfDiscs?: number
  particleRGBColor?: [number, number, number]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  strokeColor: '#737373',
  numberOfLines: 50,
  numberOfDiscs: 50,
  particleRGBColor: () => [255, 255, 255],
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationFrameIdRef = ref<number>(0)
const stateRef = ref<State>({
  discs: [],
  lines: [],
  particles: [],
  clip: {},
  startDisc: { p: 0, x: 0, y: 0, w: 0, h: 0 },
  endDisc: { p: 0, x: 0, y: 0, w: 0, h: 0 },
  rect: { width: 0, height: 0 },
  render: { width: 0, height: 0, dpi: 1 },
  particleArea: {},
})

function linear(p: number) { return p }
function easeInExpo(p: number) { return p === 0 ? 0 : Math.pow(2, 10 * (p - 1)) }
function tweenValue(start: number, end: number, p: number, ease: 'inExpo' | null = null) {
  const delta = end - start
  const easeFn = ease === 'inExpo' ? easeInExpo : linear
  return start + delta * easeFn(p)
}
function tweenDisc(disc: Disc) {
  const { startDisc, endDisc } = stateRef.value
  disc.x = tweenValue(startDisc.x, endDisc.x, disc.p)
  disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, 'inExpo')
  disc.w = tweenValue(startDisc.w, endDisc.w, disc.p)
  disc.h = tweenValue(startDisc.h, endDisc.h, disc.p)
}
function setSize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  stateRef.value.rect = { width: rect.width, height: rect.height }
  stateRef.value.render = { width: rect.width, height: rect.height, dpi: window.devicePixelRatio || 1 }
  canvas.width = stateRef.value.render.width * stateRef.value.render.dpi
  canvas.height = stateRef.value.render.height * stateRef.value.render.dpi
}
function setDiscs() {
  const { width, height } = stateRef.value.rect
  if (width <= 0 || height <= 0) return
  stateRef.value.discs = []
  stateRef.value.startDisc = { p: 0, x: width * 0.5, y: height * 0.45, w: width * 0.75, h: height * 0.7 }
  stateRef.value.endDisc = { p: 0, x: width * 0.5, y: height * 0.95, w: 0, h: 0 }
  let prevBottom = height
  stateRef.value.clip = {}
  for (let i = 0; i < props.numberOfDiscs; i++) {
    const p = i / props.numberOfDiscs
    const disc = { p, x: 0, y: 0, w: 0, h: 0 }
    tweenDisc(disc)
    const bottom = disc.y + disc.h
    if (bottom <= prevBottom) {
      stateRef.value.clip = { disc: { ...disc }, i }
    }
    prevBottom = bottom
    stateRef.value.discs.push(disc)
  }
  if (stateRef.value.clip.disc) {
    const clipPath = new Path2D()
    const disc = stateRef.value.clip.disc
    clipPath.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2)
    clipPath.rect(disc.x - disc.w, 0, disc.w * 2, disc.y)
    stateRef.value.clip.path = clipPath
  }
}
function setLines() {
  const { width, height } = stateRef.value.rect
  if (width <= 0 || height <= 0) return
  stateRef.value.lines = []
  const linesAngle = (Math.PI * 2) / props.numberOfLines
  for (let i = 0; i < props.numberOfLines; i++) stateRef.value.lines.push([])
  stateRef.value.discs.forEach((disc: Disc) => {
    for (let i = 0; i < props.numberOfLines; i++) {
      const angle = i * linesAngle
      const p = { x: disc.x + Math.cos(angle) * disc.w, y: disc.y + Math.sin(angle) * disc.h }
      stateRef.value.lines[i]!.push(p)
    }
  })
  const offCanvas = document.createElement('canvas')
  offCanvas.width = Math.max(1, width)
  offCanvas.height = Math.max(1, height)
  const ctx = offCanvas.getContext('2d')
  if (!ctx || !stateRef.value.clip.path) { stateRef.value.linesCanvas = undefined; return }
  ctx.clearRect(0, 0, offCanvas.width, offCanvas.height)
  stateRef.value.lines.forEach((line: Point[]) => {
    ctx.save()
    let lineIsIn = false
    line.forEach((p1: Point, j: number) => {
      if (j === 0) return
      const p0 = line[j - 1]!
      if (!lineIsIn && (ctx.isPointInPath(stateRef.value.clip.path!, p1.x, p1.y) || ctx.isPointInStroke(stateRef.value.clip.path!, p1.x, p1.y))) {
        lineIsIn = true
      } else if (lineIsIn) {
        ctx.clip(stateRef.value.clip.path!)
      }
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      ctx.lineTo(p1.x, p1.y)
      ctx.strokeStyle = props.strokeColor
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.closePath()
    })
    ctx.restore()
  })
  stateRef.value.linesCanvas = offCanvas
}
function initParticle(start = false): Particle {
  const sx = (stateRef.value.particleArea.sx || 0) + (stateRef.value.particleArea.sw || 0) * Math.random()
  const ex = (stateRef.value.particleArea.ex || 0) + (stateRef.value.particleArea.ew || 0) * Math.random()
  const dx = ex - sx
  const y = start ? (stateRef.value.particleArea.h || 0) * Math.random() : stateRef.value.particleArea.h || 0
  const r = 0.5 + Math.random() * 4
  const vy = 0.5 + Math.random()
  return { x: sx, sx, dx, y, vy, p: 0, r, c: `rgba(${props.particleRGBColor[0]}, ${props.particleRGBColor[1]}, ${props.particleRGBColor[2]}, ${Math.random()})` }
}
function setParticles() {
  const { width, height } = stateRef.value.rect
  stateRef.value.particles = []
  const disc = stateRef.value.clip.disc
  if (!disc) return
  stateRef.value.particleArea = { sw: disc.w * 0.5, ew: disc.w * 2, h: height * 0.85 }
  stateRef.value.particleArea.sx = (width - (stateRef.value.particleArea.sw || 0)) / 2
  stateRef.value.particleArea.ex = (width - (stateRef.value.particleArea.ew || 0)) / 2
  const totalParticles = 100
  for (let i = 0; i < totalParticles; i++) stateRef.value.particles.push(initParticle(true))
}
function drawDiscs(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = props.strokeColor
  ctx.lineWidth = 2
  const outerDisc = stateRef.value.startDisc
  ctx.beginPath()
  ctx.ellipse(outerDisc.x, outerDisc.y, outerDisc.w, outerDisc.h, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.closePath()
  stateRef.value.discs.forEach((disc: Disc, i: number) => {
    if (i % 5 !== 0) return
    if (disc.w < (stateRef.value.clip.disc?.w || 0) - 5) { ctx.save(); ctx.clip(stateRef.value.clip.path!) }
    ctx.beginPath(); ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2); ctx.stroke(); ctx.closePath()
    if (disc.w < (stateRef.value.clip.disc?.w || 0) - 5) ctx.restore()
  })
}
function drawLines(ctx: CanvasRenderingContext2D) {
  if (stateRef.value.linesCanvas && stateRef.value.linesCanvas.width > 0 && stateRef.value.linesCanvas.height > 0) {
    ctx.drawImage(stateRef.value.linesCanvas, 0, 0)
  }
}
function drawParticles(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.clip(stateRef.value.clip.path!);
  stateRef.value.particles.forEach((particle: Particle) => {
    ctx.fillStyle = particle.c; ctx.beginPath(); ctx.rect(particle.x, particle.y, particle.r, particle.r); ctx.closePath(); ctx.fill()
  })
  ctx.restore()
}
function moveDiscs() { stateRef.value.discs.forEach((disc: Disc) => { disc.p = (disc.p + 0.001) % 1; tweenDisc(disc) }) }
function moveParticles() {
  stateRef.value.particles.forEach((particle: Particle, idx: number) => {
    particle.p = 1 - particle.y / (stateRef.value.particleArea.h || 1)
    particle.x = particle.sx + particle.dx * particle.p
    particle.y -= particle.vy
    if (particle.y < 0) stateRef.value.particles[idx] = initParticle()
  })
}
function tick() {
  const canvas = canvasRef.value; if (!canvas) return
  const ctx = canvas.getContext('2d'); if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save(); ctx.scale(stateRef.value.render.dpi, stateRef.value.render.dpi)
  moveDiscs(); moveParticles(); drawDiscs(ctx); drawLines(ctx); drawParticles(ctx)
  ctx.restore()
  animationFrameIdRef.value = requestAnimationFrame(tick)
}
function init() { setSize(); setDiscs(); setLines(); setParticles() }
function handleResize() { setSize(); setDiscs(); setLines(); setParticles() }

onMounted(() => { nextTick(() => { setSize(); init(); tick(); window.addEventListener('resize', handleResize) }) })
onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameIdRef.value) })
</script>

<style scoped>
.black-hole {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.black-hole::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  width: 140%;
  height: 140%;
  background: radial-gradient(ellipse at 50% 55%, transparent 10%, var(--base) 50%);
  transform: translate3d(-50%, -50%, 0);
}

/* dark mode variant for ::before background */
:root.dark .black-hole::before,
.dark .black-hole::before,
[data-theme='dark'] .black-hole::before {
  background: radial-gradient(ellipse at 50% 55%, transparent 10%, var(--base) 50%);
}

.blackhole-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0.10;
}

:root.dark .blackhole-canvas,
.dark .blackhole-canvas,
[data-theme='dark'] .blackhole-canvas {
  opacity: 0.20;
}

.blackhole-gradient {
  position: absolute;
  left: 50%;
  top: -71.5%;
  z-index: 3;
  height: 140%;
  width: 30%;
  border-bottom-left-radius: 9999px;
  border-bottom-right-radius: 9999px;
  opacity: 0.75;
  mix-blend-mode: plus-darker;
  filter: blur(48px);
  background: linear-gradient(20deg,
      var(--accent),
      var(--accent) 16.5%,
      var(--accent) 33%,
      var(--accent) 49.5%,
      var(--accent) 66%,
      var(--accent) 85.5%,
      var(--accent) 100%) 0 100% / 100% 200%;
  transform: translate3d(-50%, 0, 0);
}

:root.dark .blackhole-gradient,
.dark .blackhole-gradient,
[data-theme='dark'] .blackhole-gradient {
  mix-blend-mode: plus-lighter;
  background: linear-gradient(20deg,
      var(--accent),
      var(--accent) 16.5%,
      var(--accent) 33%,
      var(--accent) 49.5%,
      var(--accent) 66%,
      var(--accent) 85.5%,
      var(--accent) 100%) 0 100% / 100% 200%;
}

.blackhole-overlay {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 7;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  mix-blend-mode: overlay;
}

:root.dark .blackhole-overlay,
.dark .blackhole-overlay,
[data-theme='dark'] .blackhole-overlay {
  background: repeating-linear-gradient(transparent, transparent 1px, var(--accent-120) 1px, var(--accent-120) 2px);
}
</style>
