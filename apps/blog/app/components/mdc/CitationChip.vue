<script setup lang="ts">
import type { Citation } from '../../../types/res'

const { source } = defineProps<{
  source: Citation
}>()
</script>

<template>
  <a class="CitationChip base button buttonText buttonHover buttonActive buttonFocus buttonSmall CitationIcon"
    :href="source.url" target="_blank" rel="noopener">
    <Icon name="carbon:link" />
    <p class="caption">
      {{ source.publisher }}
    </p>
  </a>
</template>

<style>
a.CitationChip {
  display: flex;
  gap: var(--space-1);
  color: var(--base-120);
  background-color: var(--base-20);

  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  cursor: pointer;
  /* Limit transition to color paints only */
  transition: background-color var(--time), color var(--time), border-color var(--time);

  position: relative;
  z-index: 1;
}

a.CitationChip:hover {
  background-color: var(--base-10);
  color: var(--base-100);
}
</style>
