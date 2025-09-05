<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

type Position = 'top' | 'bottom' | 'left' | 'right'
type Curve = 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out'
type Target = 'parent' | 'page'

type GradualBlurProps = {
  position?: Position
  strength?: number
  height?: string
  width?: string
  divCount?: number
  exponential?: boolean
  zIndex?: number
  animated?: boolean | 'scroll'
  duration?: string
  easing?: string
  opacity?: number
  curve?: Curve
  responsive?: boolean
  mobileHeight?: string
  tabletHeight?: string
  desktopHeight?: string
  mobileWidth?: string
  tabletWidth?: string
  desktopWidth?: string
  preset?:
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'subtle'
  | 'intense'
  | 'smooth'
  | 'sharp'
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'page-header'
  | 'page-footer'
  gpuOptimized?: boolean
  hoverIntensity?: number
  target?: Target
  onAnimationComplete?: () => void
  className?: string
  style?: CSSProperties
}

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },
  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },
  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },
  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
  sidebar: { position: 'left', height: '6rem', strength: 2.5 },
  'page-header': { position: 'top', height: '10rem', target: 'page', strength: 3 },
  'page-footer': { position: 'bottom', height: '10rem', target: 'page', strength: 3 }
}

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: p => p,
  bezier: p => p * p * (3 - 2 * p),
  'ease-in': p => p * p,
  'ease-out': p => 1 - Math.pow(1 - p, 2),
  'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
}

const props = withDefaults(defineProps<GradualBlurProps>(), {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  width: undefined as unknown as string,
  divCount: 5,
  exponential: true,
  zIndex: 3,
  animated: true,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'ease-in',
  responsive: false,
  target: 'page', // default to page to match previous FrostLayer behavior
  gpuOptimized: false,
})

const containerRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)
const isVisible = ref(true)

const mergeConfigs = (...configs: Partial<GradualBlurProps>[]) => {
  return configs.reduce((acc, c) => Object.assign(acc, c), {} as Partial<GradualBlurProps>)
}

const getGradientDirection = (position: Position): string => {
  const directions: Record<Position, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  }
  return directions[position] || 'to bottom'
}

// responsive helpers
function useResponsiveDimension(
  responsive: () => boolean,
  key: 'height' | 'width'
) {
  const value = ref<string | undefined>(props[key])

  const compute = () => {
    if (!responsive() || typeof window === 'undefined') {
      value.value = props[key]
      return
    }
    const w = window.innerWidth
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
    const k = cap(key)
    let v: string | undefined = props[key]
    const mobile = key === 'height' ? props.mobileHeight : props.mobileWidth
    const tablet = key === 'height' ? props.tabletHeight : props.tabletWidth
    const desktop = key === 'height' ? props.desktopHeight : props.desktopWidth
    if (w <= 480 && mobile) v = mobile
    else if (w <= 768 && tablet) v = tablet
    else if (w <= 1024 && desktop) v = desktop
    value.value = v
  }

  let t: number | undefined
  const onResize = () => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(compute, 100)
  }

  onMounted(() => {
    compute()
    if (typeof window !== 'undefined') window.addEventListener('resize', onResize)
  })
  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') window.removeEventListener('resize', onResize)
    if (t) window.clearTimeout(t)
  })

  // recompute if relevant props change
  watch(
    () => [
      props[key],
      props.responsive,
      props.mobileHeight,
      props.tabletHeight,
      props.desktopHeight,
      props.mobileWidth,
      props.tabletWidth,
      props.desktopWidth
    ],
    compute
  )
  return value
}

const presetConfig = computed<Partial<GradualBlurProps>>(() => (props.preset && PRESETS[props.preset]) || {})
const config = computed(() => mergeConfigs(props, presetConfig.value, props))

const responsiveHeight = useResponsiveDimension(() => !!config.value.responsive, 'height')
const responsiveWidth = useResponsiveDimension(() => !!config.value.responsive, 'width')

// intersection observer for 'scroll' animation mode
let observer: IntersectionObserver | null = null
onMounted(() => {
  if (config.value.animated === 'scroll' && typeof window !== 'undefined' && containerRef.value) {
    isVisible.value = false
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry) isVisible.value = entry.isIntersecting
    }, { threshold: 0.1 })
    observer.observe(containerRef.value)
  }
})
onBeforeUnmount(() => {
  if (observer) observer.disconnect()
  observer = null
})

// notify when visibility animation completes
watch([() => isVisible.value, () => config.value.animated, () => config.value.duration], ([vis, anim, dur]) => {
  if (vis && anim === 'scroll' && typeof config.value.onAnimationComplete === 'function') {
    const ms = parseFloat(String(dur || '0')) * 1000
    const t = setTimeout(() => config.value.onAnimationComplete?.(), isNaN(ms) ? 0 : ms)
    onBeforeUnmount(() => clearTimeout(t))
  }
})

// generate styles for each blur division
const blurDivs = computed(() => {
  const divs: CSSProperties[] = []
  const c = config.value
  const increment = 100 / (c.divCount || 1)
  const currentStrength = isHovered.value && c.hoverIntensity ? (c.strength || 0) * c.hoverIntensity : c.strength || 0
  const curveFunc = CURVE_FUNCTIONS[(c.curve as Curve) || 'linear']

  for (let i = 1; i <= (c.divCount || 1); i++) {
    let progress = i / (c.divCount || 1)
    progress = curveFunc(progress)

    let blurValue: number
    if (c.exponential) {
      blurValue = Math.pow(2, progress * 4) * 0.0625 * currentStrength
    } else {
      blurValue = 0.0625 * (progress * (c.divCount || 1) + 1) * currentStrength
    }

    const round1 = (n: number) => Math.round(n * 10) / 10
    const p1 = round1(increment * i - increment)
    const p2 = round1(increment * i)
    const p3 = round1(increment * i + increment)
    const p4 = round1(increment * i + increment * 2)

    let gradient = `transparent ${p1}%, black ${p2}%`
    if (p3 <= 100) gradient += `, black ${p3}%`
    if (p4 <= 100) gradient += `, transparent ${p4}%`

    const direction = getGradientDirection(c.position as Position)

    const divStyle: CSSProperties = {
      position: 'absolute',
      inset: '0',
      maskImage: `linear-gradient(${direction}, ${gradient})`,
      WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
      backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      opacity: c.opacity,
      transition:
        c.animated && c.animated !== 'scroll'
          ? `backdrop-filter ${c.duration} ${c.easing}`
          : undefined
    }

    divs.push(divStyle)
  }

  return divs
})

const containerStyle = computed<CSSProperties>(() => {
  const c = config.value
  const isVertical = ['top', 'bottom'].includes(c.position as string)
  const isHorizontal = ['left', 'right'].includes(c.position as string)
  const isPageTarget = c.target === 'page'

  const baseStyle: CSSProperties = {
    position: isPageTarget ? 'fixed' : 'absolute',
    pointerEvents: c.hoverIntensity ? 'auto' : 'none',
    opacity: isVisible.value ? 1 : 0,
    transition: c.animated ? `opacity ${c.duration} ${c.easing}` : undefined,
    zIndex: isPageTarget ? (c.zIndex || 0) + 100 : c.zIndex,
    ...(c.style || {})
  }

  if (c.gpuOptimized) {
    baseStyle.willChange = 'opacity, backdrop-filter'
    baseStyle.transform = 'translateZ(0)'
  }

  if (isVertical) {
    baseStyle.height = responsiveHeight.value || c.height
    baseStyle.width = responsiveWidth.value || '100%'
    if (c.position === 'top') baseStyle.top = 0
    if (c.position === 'bottom') baseStyle.bottom = 0
    baseStyle.left = 0
    baseStyle.right = 0
  } else if (isHorizontal) {
    baseStyle.width = responsiveWidth.value || responsiveHeight.value || c.width || c.height
    baseStyle.height = '100%'
    if (c.position === 'left') baseStyle.left = 0
    if (c.position === 'right') baseStyle.right = 0
    baseStyle.top = 0
    baseStyle.bottom = 0
  }

  return baseStyle
})
</script>

<template>
  <div ref="containerRef" class="gradual-blur"
    :class="[config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent', props.className]"
    :style="containerStyle" @mouseenter="props.hoverIntensity ? (isHovered = true) : undefined"
    @mouseleave="props.hoverIntensity ? (isHovered = false) : undefined">
    <div class="gradual-blur-inner" style="position: relative; width: 100%; height: 100%">
      <div v-for="(style, i) in blurDivs" :key="i" :style="style" />
    </div>
  </div>
</template>

<style>
.gradual-blur-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.gradual-blur-inner>div {
  -webkit-backdrop-filter: inherit;
  backdrop-filter: inherit;
}

.gradual-blur {
  isolation: isolate;
}

@supports not (backdrop-filter: blur(1px)) {
  .gradual-blur-inner>div {
    background: rgba(0, 0, 0, 0.3);
    opacity: 0.5;
  }
}

/* .gradual-blur-page left intentionally without fixed positioning; layout handled inline */
</style>
