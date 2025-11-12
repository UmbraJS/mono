<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, useTemplateRef, computed } from 'vue'
import { useImageContrast } from '../composables/useImageContrast'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  titleEditor: Editor | undefined
  imageUrl: string
}>()

const imageWrapperRef = useTemplateRef<HTMLDivElement>("imgRef")
const titleRef = useTemplateRef<typeof EditorContent>("titleRef")
const containerRef = useTemplateRef<HTMLElement>("containerRef")

// Get the actual img element from NuxtImg wrapper
const imageEl = computed(() => {
  if (!imageWrapperRef.value) return null
  return (imageWrapperRef.value as unknown as { imgEl: HTMLImageElement }).imgEl
})

const { contrastColor } = useImageContrast(imageEl)

onMounted(() => {
  if (!imageEl.value || !containerRef.value || !titleRef.value) return

  const image = imageEl.value
  const container = containerRef.value

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
  color: v-bind(contrastColor);
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
