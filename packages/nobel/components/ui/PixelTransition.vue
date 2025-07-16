<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { gsap } from 'gsap'

interface Props {
  firstContent?: string
  secondContent?: string
  gridSize?: number
  pixelColor?: string
  animationStepDuration?: number
  aspectRatio?: string
}

const props = withDefaults(defineProps<Props>(), {
  gridSize: 7,
  pixelColor: 'currentColor',
  animationStepDuration: 0.3,
  aspectRatio: '40%'
})

const containerRef = ref<HTMLElement>()
const pixelGridRef = ref<HTMLElement>()
const activeRef = ref<HTMLElement>()
const delayedCallRef = ref<gsap.core.Tween>()

const isActive = ref(false)

const isTouchDevice = typeof window !== 'undefined' && (
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia('(pointer: coarse)').matches
)

const createPixelGrid = () => {
  // Skip during SSR
  if (typeof window === 'undefined') return

  const pixelGridEl = pixelGridRef.value
  if (!pixelGridEl) return

  pixelGridEl.innerHTML = ''

  for (let row = 0; row < props.gridSize; row++) {
    for (let col = 0; col < props.gridSize; col++) {
      const pixel = document.createElement('div')
      pixel.classList.add('pixelated-image-card__pixel')
      pixel.style.backgroundColor = props.pixelColor

      const size = 100 / props.gridSize
      pixel.style.width = `${size}%`
      pixel.style.height = `${size}%`
      pixel.style.left = `${col * size}%`
      pixel.style.top = `${row * size}%`
      pixelGridEl.appendChild(pixel)
    }
  }
}

const animatePixels = (activate: boolean) => {
  // Skip during SSR
  if (typeof window === 'undefined') return

  isActive.value = activate

  const pixelGridEl = pixelGridRef.value
  const activeEl = activeRef.value
  if (!pixelGridEl || !activeEl) return

  const pixels = pixelGridEl.querySelectorAll('.pixelated-image-card__pixel')
  if (!pixels.length) return

  gsap.killTweensOf(pixels)
  if (delayedCallRef.value) {
    delayedCallRef.value.kill()
  }

  gsap.set(pixels, { display: 'none' })

  const totalPixels = pixels.length
  const staggerDuration = props.animationStepDuration / totalPixels

  gsap.to(pixels, {
    display: 'block',
    duration: 0,
    stagger: {
      each: staggerDuration,
      from: 'random'
    }
  })

  delayedCallRef.value = gsap.delayedCall(props.animationStepDuration, () => {
    if (activeEl) {
      activeEl.style.display = activate ? 'block' : 'none'
      activeEl.style.pointerEvents = activate ? 'none' : ''
    }
  })

  gsap.to(pixels, {
    display: 'none',
    duration: 0,
    delay: props.animationStepDuration,
    stagger: {
      each: staggerDuration,
      from: 'random'
    }
  })
}

const handleMouseEnter = () => {
  if (!isActive.value) animatePixels(true)
}

const handleMouseLeave = () => {
  if (isActive.value) animatePixels(false)
}

const handleClick = () => {
  animatePixels(!isActive.value)
}

onMounted(() => {
  createPixelGrid()
})

watch([() => props.gridSize, () => props.pixelColor], () => {
  createPixelGrid()
})
</script>

<template>
  <div ref="containerRef" class="pixelated-image-card" @mouseenter="!isTouchDevice ? handleMouseEnter() : undefined"
    @mouseleave="!isTouchDevice ? handleMouseLeave() : undefined" @click="isTouchDevice ? handleClick() : undefined">
    <div class="pixelated-image-card__default">
      <slot name="default" :is-active="isActive">
        {{ firstContent }}
      </slot>
    </div>
    <div class="pixelated-image-card__active" ref="activeRef">
      <slot name="active" :is-active="isActive">
        {{ secondContent }}
      </slot>
    </div>
    <div class="pixelated-image-card__pixels" ref="pixelGridRef" />
  </div>
</template>

<style>
.pixelated-image-card {
  background-color: var(--base-20);
  position: relative;
  overflow: hidden;

  height: 300px;
  width: 300px;
}

.pixelated-image-card__default,
.pixelated-image-card__active,
.pixelated-image-card__pixels {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.pixelated-image-card__active {
  z-index: 2;
}

.pixelated-image-card__active {
  display: none;
}

.pixelated-image-card__pixels {
  pointer-events: none;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pixelated-image-card__pixel {
  display: none;
  position: absolute;
}
</style>
