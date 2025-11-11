<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, useTemplateRef, ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  titleEditor: Editor | undefined
  imageUrl: string
}>()

const umbra = useUmbra()
const imageWrapperRef = useTemplateRef<HTMLDivElement>("imgRef")
const titleRef = useTemplateRef<typeof EditorContent>("titleRef")
const containerRef = useTemplateRef<HTMLElement>("containerRef")
const titleColor = ref<string>('var(--base-text)')

// Function to calculate luminance from RGB values
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Function to determine if image bottom is light or dark
function analyzeImageBottom(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return false

    // Sample a small area from the bottom quarter of the image
    const sampleHeight = Math.floor(img.height / 4)
    canvas.width = img.width
    canvas.height = sampleHeight

    ctx.drawImage(
      img,
      0, img.height - sampleHeight, // source x, y (bottom quarter)
      img.width, sampleHeight,      // source width, height
      0, 0,                          // dest x, y
      img.width, sampleHeight        // dest width, height
    )

    // Get average color of the sampled area
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let r = 0, g = 0, b = 0, count = 0

    for (let i = 0; i < pixels.length; i += 4) {
      r += pixels[i]
      g += pixels[i + 1]
      b += pixels[i + 2]
      count++
    }

    r = Math.floor(r / count)
    g = Math.floor(g / count)
    b = Math.floor(b / count)

    const luminance = getLuminance(r, g, b)
    return luminance > 0.5 // true if light, false if dark
  } catch (error) {
    console.warn('Could not analyze image due to CORS:', error)
    // Fallback: assume image is dark, so title should be light
    return false
  }
}

onMounted(() => {
  if (!imageWrapperRef.value || !containerRef.value || !titleRef.value) return

  const image = (imageWrapperRef.value as unknown as { imgEl: HTMLImageElement }).imgEl
  const container = containerRef.value

  // Wait for image to load before analyzing
  if (image.complete) {
    setTitleColor(image)
  } else {
    image.addEventListener('load', () => setTitleColor(image))
  }

  function setTitleColor(img: HTMLImageElement) {
    // Set crossorigin before analyzing to avoid CORS issues
    if (!img.crossOrigin) {
      img.crossOrigin = 'anonymous'
      // If image is already loaded, reload it with crossOrigin set
      if (img.complete) {
        const src = img.src
        img.src = ''
        img.src = src
        img.addEventListener('load', () => {
          analyzeAndSetColor(img)
        }, { once: true })
        return
      }
    }
    analyzeAndSetColor(img)
  }

  function analyzeAndSetColor(img: HTMLImageElement) {
    const imageIsLight = analyzeImageBottom(img)
    const isDarkTheme = umbra.isDark
    // Logic: title should contrast with image bottom
    if (isDarkTheme) {
      titleColor.value = imageIsLight ? 'var(--base)' : 'var(--base-text)'
    } else {
      titleColor.value = imageIsLight ? 'var(--base-text)' : 'var(--base)'
    }
  }

  gsap.to(image, {
    height: 0,
    y: image.offsetHeight,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: '-10 top',
      end: 'bottom top',
      scrub: true,
    }
  })

  gsap.to(titleRef.value.rootEl, {
    y: 200,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: '-50 top',
      end: 'bottom+=200 top',
      scrub: true,
      markers: true,
    }
  })
})
</script>

<template>
  <div ref="containerRef" class="CaseHeader">
    <NuxtImg ref="imgRef" :src="imageUrl" width="2670" height="1780" fit="cover" alt="Case header image"
      crossorigin="anonymous" />
    <EditorContent ref="titleRef" :editor="titleEditor" class="CaseTitle" />
  </div>
</template>

<style scoped lang="scss">
.CaseTitle {
  position: relative;
  padding: var(--space-2);
  color: v-bind(titleColor);
  /* background-color: rgba($color: black, $alpha: 0.2); */
  /* box-shadow: 0px -70px 54px 0px rgba(0, 0, 0, 1); */
  backdrop-filter: blur(5px);
}

.CaseHeader {
  position: relative;
  height: 70vh;
  display: flex;
  align-items: flex-end;
}

.CaseHeader img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: var(--radius);
}
</style>
