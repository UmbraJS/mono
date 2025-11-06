<script setup lang="ts">
import BubbleMenu from '@tiptap/extension-bubble-menu'
import type { Editor } from '@tiptap/vue-3'
import { Button, ButtonGroup } from 'umbraco'

defineProps<{
  editor: Editor
}>()
</script>

<template>
  <BubbleMenu :editor="editor" :tippy-options="{ duration: 100 }" class="inverted-theme">
    <ButtonGroup>
      <Button variant="base" size="small" :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()">
        Bold
      </Button>
      <Button variant="base" size="small" :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()">
        Italic
      </Button>
      <Button variant="base" size="small" @click="editor.chain().focus().toggleReference().run()">
        Reference
      </Button>
      <Button variant="base" size="small" @click="editor.commands.setCitation({
        reliance: 'deductive',
        distance: 'primary',
      })">
        Citation
      </Button>
      <Button variant="base" size="small" @click="editor.commands.setNarrativeFrame({
        type: 'premise',
        mood: 'neutral',
      })">
        Narrative Frame
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
