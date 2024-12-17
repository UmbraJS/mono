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
    <textarea
      type="text"
      id="title"
      class="h1 display"
      name="title"
      minlength="4"
      maxlength="120"
      required
      placeholder="Title"
      value="THE RUBIK'S CUBE IS THE WORLD’S BEST SELLING PUZZLE TOY"
    />
    <EditorContent :editor="editor" />
    <!-- <TextMenuFloating :editor="editor" />
      <TextMenuBubble :editor="editor" /> -->
  </div>
</template>

<style lang="scss">
.content.post {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.content.post textarea {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  resize: none;
  field-sizing: content;
  background-color: transparent;
  border: none;
  color: var(--foreground-100);
}

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
