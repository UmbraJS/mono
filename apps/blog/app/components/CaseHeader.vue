<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, useTemplateRef } from 'vue'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  titleEditor: Editor | undefined
  imageUrl: string
}>()

const imageWrapperRef = useTemplateRef<HTMLDivElement>("imgRef")
const titleRef = useTemplateRef<typeof EditorContent>("titleRef")
const containerRef = useTemplateRef<HTMLElement>("containerRef")

onMounted(() => {
  if (!imageWrapperRef.value || !containerRef.value || !titleRef.value) return

  console.log('Mounted CaseHeader with image and container:', titleRef.value)

  const image = (imageWrapperRef.value as unknown as { imgEl: HTMLImageElement }).imgEl
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
      markers: true,
    }
  })
})
</script>

<template>
  <div ref="containerRef" class="CaseHeader">
    <NuxtImg ref="imgRef" :src="imageUrl" width="1200" height="1000" alt="Case header image" />
    <EditorContent ref="titleRef" :editor="titleEditor" class="CaseTitle" />
  </div>
</template>

<style scoped lang="scss">
.CaseTitle {
  position: relative;
  padding: var(--space-2);
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
