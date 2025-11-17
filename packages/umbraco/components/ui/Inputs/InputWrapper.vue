<script setup lang="ts">
const { error } = defineProps<{
  error?: string
}>()
</script>

<template>
  <div class="InputWrapper sibling-blur" :class="error ? 'base-warning' : ''">
    <slot />
  </div>
</template>

<style>
.InputWrapper {
  position: relative;
}

.InputWrapper input {
  width: 100%;
}

div.sibling-blur:has(+ * .InputElement:focus) {
  filter: blur(4px);
}

div.sibling-group-blur:has(+ * > :first-child .InputElement:focus) {
  filter: blur(4px);
}
</style>
