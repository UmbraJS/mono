<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { useEditor, useTitleEditor } from '../../composables/richtext/useTiptap'
import BubbleMenu from './BubbleMenu.vue'
import { author } from '../../../types/profile'
import CaseHeader from '../CaseHeader.vue'
import AuthorBar from '../AuthorBar.vue'
import { useScroll } from '@vueuse/core'

const { y } = useScroll(window)

function remapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const clampedValue = Math.min(Math.max(value, inMin), inMax)
  return ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

const shadowGrowth = computed(() => {
  return `${remapValue(y.value, 0, 300, 0, 39)}px`
})

const shadowGrowt2 = computed(() => {
  return `${remapValue(y.value, 0, 300, 0, 80)}px`
})

const { editor: titleEditor, ssrHtml: titleSsrHtml } = useTitleEditor({
  content: `THE RUBIK'S CUBE IS THE WORLD'S BEST SELLING PUZZLE TOY`,
})

const { editor: contentEditor, ssrHtml: contentSsrHtml } = useEditor({
  placeholder: 'Write your post here...',
  // onChange: (editor) => {
  //   const html = editor.getHTML()
  //   console.log('Content changed:', html)
  // },
  content: `Nuxt layers are a powerful lol feature that you can use to share and reuse <strong> partial </strong> Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a <reference data-count="0">standard</reference > Nuxt application, which makes them easy to author and maintain.< /p><div data-reliance="deductive" data-distance="primary" data-scope="study" data-type="citation"><p>Nuxt applications within a monorepo, or from a git repository or npm package. Nuxt applications within a monorepo, or from a git repository or npm package</p > </div><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p><div data-title="Nuxt Won The Web Awards 2078" data-mood="neutral" data-type="premise" data-component="narrative-frame"><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p > <div data - reliance="deductive" data - distance="primary" data - scope="study" data - type="citation" > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p></div > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p></div > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p><h2>THE RUBIK'S CUBE IS THE WORLD'S BEST SELLING PUZZLE TOY</h2 > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p><h3>THE RUBIK'S CUBE IS THE WORLD'S BEST SELLING PUZZLE TOY</h3 > <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package.The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.< /p><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p > `,
})

const headerImageUrl = 'https://images.unsplash.com/photo-1762140170241-7c8e552f25bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670'

const hall: {
  id: string
  title: string
  image: string
}[] = [{
  id: 'hall-1',
  title: 'Science',
  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670',
}, {
  id: 'hall-2',
  title: 'The Rubix Cube Sucks',
  image: 'https://images.unsplash.com/photo-1749627995669-4d4dda3a9c1d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2371',
}, {
  id: 'hall-3',
  title: 'Conference Hall',
  image: 'https://images.unsplash.com/photo-1762450127876-515aed711718?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2704',
}]
</script>

<template>
  <div class="CaseWrapper">
    <div class="CaseHeadWrapper">
      <div class="CaseHall">
        <div v-for="value in hall" :key="value.id" class="ParentCase base-accent border">
          <NuxtImg :src="value.image" width="200" height="100" :alt="value.title" />
          <p class="">
            {{ value.title }}
          </p>
        </div>
      </div>
      <CaseHeader :title-editor="titleEditor" :title-ssr-html="titleSsrHtml" :image-url="'/rocks.avif'" />
    </div>
    <article ref="caseContentRef" class="CaseContent">
      <AuthorBar :author="author" />
      <BubbleMenu v-if="contentEditor" :editor="contentEditor" />
      <ClientOnly>
        <EditorContent :editor="contentEditor" />
        <template #fallback>
          <div class="ProseMirror" v-html="contentSsrHtml" />
        </template>
      </ClientOnly>
    </article>
  </div>
</template>

<style>
.CaseHeadWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.CaseHall {
  display: flex;
  gap: var(--space-1);
}

.CaseHall .ParentCase p {
  position: absolute;
  left: var(--space-3);
  color: var(--base-120);
  letter-spacing: 1px;
}

.ParentCase:nth-child(1) {
  flex-grow: 3;
}

.ParentCase {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-grow: 1;
  background-color: var(--base-20);
  border-radius: var(--radius);
  overflow: hidden;
  height: 75px;
}

.ParentCase img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  filter: blur(2px);
}

article.CaseContent {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-2) 0px;
}

article.CaseContent::after {
  content: "";
  position: absolute;
  background-color: var(--base);
  border-radius: var(--radius);
  box-shadow: 0px calc(0px - v-bind(shadowGrowth)) v-bind(shadowGrowt2) v-bind(shadowGrowth) var(--base);
  width: 100%;
  max-width: calc(var(--paragraph-width) + var(--space-2) * 2);
  height: 100%;
  top: 0px;
  z-index: -1;
}

.content.post {
  display: grid;
  gap: var(--space-3);
  align-items: center;
}

.ProseMirror,
.UmbraProse {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.ProseMirror .is-editor-empty {
  color: var(--base-60);
}

.ProseMirror:focus {
  outline: none !important;
  border: none !important;
}

.ProseMirror p.is-editor-empty:first-child::before,
.ProseMirror h1.is-editor-empty:first-child::before {
  color: var(--foreground-20);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Overflowing text */
.ProseMirror p span.overflow {
  color: var(--warning-100);
  text-decoration: line-through;
}
</style>
