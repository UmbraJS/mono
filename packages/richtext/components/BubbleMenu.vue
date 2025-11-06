<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import { Button, ButtonGroup } from 'umbraco'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  editor: Editor
}>()

const menuRef = ref<HTMLElement>()
const isVisible = ref(false)

function updateMenu() {
  const { state } = props.editor
  const { selection } = state
  const { empty } = selection

  if (empty || !menuRef.value) {
    isVisible.value = false
    return
  }

  isVisible.value = true

  // Position the menu
  const { from, to } = selection
  const start = props.editor.view.coordsAtPos(from)
  const end = props.editor.view.coordsAtPos(to)

  const left = Math.min(start.left, end.left)
  const top = start.top

  if (menuRef.value) {
    menuRef.value.style.left = `${left}px`
    menuRef.value.style.top = `${top - 50}px`
  }
}

onMounted(() => {
  props.editor.on('selectionUpdate', updateMenu)
  props.editor.on('update', updateMenu)
})

onBeforeUnmount(() => {
  props.editor.off('selectionUpdate', updateMenu)
  props.editor.off('update', updateMenu)
})
</script>

<template>
  <div v-if="isVisible" ref="menuRef" class="BubbleMenu inverted-theme">
    <ButtonGroup>
      <Button variant="base" size="small" @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </Button>
      <Button variant="base" size="small" @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </Button>
      <Button variant="base" size="small" @click="editor.chain().focus().toggleReference().run()">
        Reference
      </Button>
    </ButtonGroup>
  </div>
</template>

<style lang="scss">
.BubbleMenu {
  position: fixed;
  z-index: 1000;
  background: var(--base-10);
  border: solid var(--border-size) var(--base-60);
  border-radius: var(--radius);
  padding: var(--space-1);
}
</style>
