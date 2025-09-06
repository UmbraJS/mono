<script setup lang="ts">
const [modelValue, modifiers] = defineModel<string, 'trim'>({
  set(value) {
    if (!modifiers.trim) return value
    return conclutionTrimer(value)
  },
})

function conclutionTrimer(value: string) {
  let newValue = value
  // Prevent new lines at the start of the input
  if (newValue.startsWith('\n') || newValue.startsWith('\r')) {
    newValue = newValue.slice(1) // Remove the first character if it's a new line
  }
  // Prevent new lines at the end of the input
  if (newValue.endsWith('\n') || newValue.endsWith('\r')) {
    newValue = newValue.slice(0, -1) // Remove the last character if it's a new line
  }
  // Prevent multiple new lines in a row
  if (newValue.includes('\n') || newValue.includes('\r')) {
    newValue = newValue.replace(/\n\n/g, '\n').replace(/\r\r/g, '\r') // Replace multiple new lines with a single new line
  }
  // Prevent empty space on a new line
  if (newValue.endsWith('\n ') || newValue.endsWith('\r ')) {
    newValue = newValue.slice(0, -1)
  }
  //Prevents multiple spaces in a row
  if (newValue.includes('  ')) {
    newValue = newValue.replace(/ {2}/g, ' ')
  }
  return newValue
}
</script>

<template>
  <textarea v-model="modelValue" placeholder="State a clear position which can be true or false" />
</template>

<style scoped>
textarea {
  resize: none;
  overflow: hidden;
  field-sizing: content;
  background: transparent;
  color: var(--base-120);
  border: none;
  outline: none;
}
</style>
