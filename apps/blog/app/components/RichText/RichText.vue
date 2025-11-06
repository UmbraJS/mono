<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { useEditor, useTitleEditor } from '../../composables/richtext/useTiptap'
import BubbleMenu from './BubbleMenu.vue'

const titleEditor = useTitleEditor({
  content: `<h1 class="display">THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h1>`,
})

const contentEditor = useEditor({
  placeholder: 'Write your post here...',
  content: `
    <p>Nuxt layers are a <reference>powerful lol</reference> feature that you can use to share and reuse <strong>partial</strong> Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <p class="slugline">Nuxt applications within a monorepo, or from a git repository or npm package. Nuxt applications within a monorepo, or from a git repository or npm package</p>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <h1>Title</h1>
    <vue-component>
      <p>This is editable.</p>
    </vue-component>
    <p>The Rubik's Cube is the World’s best selling puzzle toy</p>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <h2>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h2>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <h3>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h3>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <h2>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h2>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <h3>THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY</h3>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    <p>Nuxt layers are a powerful feature that you can use to share and reuse Nuxt applications within a monorepo, or from a git repository or npm package. The layers structure is almost identical to a standard Nuxt application, which makes them easy to author and maintain.</p>
    `,
})
</script>

<template>
  <div class="content post">
    <BubbleMenu v-if="contentEditor" :editor="contentEditor" />
    <EditorContent :editor="titleEditor" />
    <EditorContent :editor="contentEditor" />
  </div>
</template>

<style lang="scss">
.content.post {
  display: grid;
  gap: var(--space-3);
  align-items: center;
}

.ProseMirror {
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
