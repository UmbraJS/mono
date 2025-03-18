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
  console.log('Cursor Position:', cursorPos)
}

function handleKeyUp() {
  const cursorPos = getCursorPosition()
  console.log('Cursor Position on Key Up:', cursorPos)
}

const model = defineModel<string>('lol')
</script>

<template>
  <div
    id="RichText"
    class="buttonHover buttonFocus focus"
    contenteditable="true"
    @keyup="handleKeyUp"
    @mouseup="handleMouseUp"
  >
    {{ model }}
  </div>
</template>

<style lang="scss">
#RichText {
  height: 300px;
  padding: var(--space-quark);
  border-radius: var(--radius);
}
</style>
