<template>
  <pre id="ProsePre" :class="$props.class"><slot /></pre>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})
</script>

<style>
#ProsePre {
  background-color: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-2);
  overflow-x: auto;
}

pre code .line {
  display: block;
}
</style>
