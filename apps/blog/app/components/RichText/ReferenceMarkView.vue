<script setup lang="ts">
import type { MarkViewProps } from '@tiptap/core'
import { MarkViewContent } from '@tiptap/vue-3'

// Define props using the MarkViewProps interface from Tiptap
const props = defineProps<MarkViewProps>()

// Local state for the counter (similar to the Tiptap example)
const count = ref(0)

// Increment function
const increment = () => {
  count.value++
}
</script>

<template>
  <span className="ProseContent" data-test-id="mark-view">
    <button class="ProseButton" @click="increment">
      <MarkViewContent /> {{ count }}
    </button>
  </span>
</template>

<style>
.ProseButton {
  color: var(--base-text);
}

.ProseContent {
  background-color: var(--purple-light);
  border: 2px solid var(--purple);
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
}

.ProseContent label {
  background-color: var(--purple);
  border-radius: 0 0 0.5rem 0;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
}
</style>
