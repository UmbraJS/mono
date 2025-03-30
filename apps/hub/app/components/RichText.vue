<script setup lang="ts">
function getCursorPosition() {
  const selection = window.getSelection()
  if (!selection) return null
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const startPosition = range.startOffset // Start position of the selection
    const endPosition = range.endOffset // End position of the selection
    return { start: startPosition, end: endPosition }
  }
  return null // No selection
}

function handleMouseUp() {
  const cursorPos = getCursorPosition()
  if (!cursorPos) return
  // console.log('Cursor Position:', cursorPos)
}

function handleKeyUp() {
  const cursorPos = getCursorPosition()
  // console.log('Cursor Position on Key Up:', cursorPos)
}

defineProps<{ value: string }>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div
    id="RichText"
    class="buttonHover buttonFocus focus rounded border"
    contenteditable="true"
    @keyup="handleKeyUp"
    @mouseup="handleMouseUp"
    @input="
      (e) => {
        emit('update:modelValue', (e?.target as HTMLDivElement)?.innerText || '')
      }
    "
  >
    {{ value }}
  </div>
</template>
