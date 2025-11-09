<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { useEditor, useTitleEditor } from '../../composables/richtext/useTiptap'
import BubbleMenu from './BubbleMenu.vue'

const titleEditor = useTitleEditor({
  content: `<h1 class="display">THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h1>`,
})

const contentEditor = useEditor({
  placeholder: 'Write your post here...',
  // onChange: (editor) => {
  //   const html = editor.getHTML()
  //   console.log('Content changed:', html)
  // },
  content: `<p>Nuxt layers are a powerful lol feature that you can use to share and reuse <strong>partial</strong> Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a <reference data-count="0">standard</reference> Nuxt application, which makes them easy to author and maintain.</p><div data-reliance="deductive" data-distance="primary" data-scope="study" data-type="citation"><p>Nuxt applications within a monorepo, or from a git repository or npm package. Nuxt applications within a monorepo, or from a git repository or npm package</p></div><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><div data-title="Nuxt Won The Web Awards 2078" data-mood="neutral" data-type="premise" data-component="narrative-frame"><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><div data-reliance="deductive" data-distance="primary" data-scope="study" data-type="citation"><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p></div><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p></div><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><h2>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h2><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><h3>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h3><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p><p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>`,
})
</script>

<template>
  <div class="">
    <div class="CaseHeader">
      <NuxtImg
        src="https://images.unsplash.com/photo-1762140170241-7c8e552f25bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670"
        width="1200" height="1000" alt="Author avatar" />
      <EditorContent :editor="titleEditor" />
    </div>
    <BubbleMenu v-if="contentEditor" :editor="contentEditor" />
    <EditorContent :editor="contentEditor" />
  </div>
</template>

<style lang="scss">
.CaseHeader {
  position: relative;
  height: 70vh;
  display: flex;
  align-items: flex-end;
  padding: var(--space-2);
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

// Oveflowing text
.ProseMirror p span.overflow {
  color: var(--warning-100);
  text-decoration: line-through;
}
</style>
