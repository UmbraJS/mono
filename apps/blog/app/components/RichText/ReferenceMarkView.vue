<script setup lang="ts">
import type { MarkViewProps } from '@tiptap/core'

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
    <mark-view-content />
    <label contenteditable="false">Vue Component::
      <button class="primary" @click="increment">
        This button has been clicked {{ count }} times.
      </button>
    </label>
  </span>
</template>

<style>
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
