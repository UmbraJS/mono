<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'
import { useTiptap } from '../composables/useTiptap'

const editor = useTiptap({
  limit: 4000,
  placeholder: 'Write your post here...',
})
</script>

<template>
  <div class="content post">
    <EditorContent :editor="editor" />
    <!-- <TextMenuFloating :editor="editor" />
      <TextMenuBubble :editor="editor" /> -->
  </div>
</template>

<style lang="scss">
.ProseMirror {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.ProseMirror:focus {
  outline: none !important;
  border: none !important;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: var(--foreground-20);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
