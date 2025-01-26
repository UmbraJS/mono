<script setup lang="ts">
import { BubbleMenu, Editor } from '@tiptap/vue-3'
import { Button, ButtonGroup } from '@nobel/core'

defineProps<{
  editor: Editor
}>()
</script>

<template>
  <BubbleMenu :editor="editor" :tippy-options="{ duration: 100 }" class="inverted-theme">
    <ButtonGroup>
      <Button
        variant="base"
        size="small"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </Button>
      <Button
        variant="base"
        size="small"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </Button>
      <Button variant="base" size="small" @click="editor.chain().focus().toggleReference().run()">
        Reference
      </Button>
    </ButtonGroup>
  </BubbleMenu>
</template>

<style lang="scss">
.BubbleMenu {
  background: var(--base-10);
  border: solid var(--border-size) var(--base-60);
  border-radius: var(--radius);
}
</style>
