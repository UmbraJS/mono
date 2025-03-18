<script setup lang="ts">
import type { Reason } from '../../../types/reasoning'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <div class="meta">
    <div class="label">
      <p>Reasoning: {{ props.reason.reasoning }}</p>
    </div>
    <div class="label">
      <p>Credibility: {{ props.reason.credibility.level }}</p>
    </div>
    <div class="label">
      <p>Value: {{ props.reason.moralValue }}</p>
    </div>
    <div class="label">
      <p>Type: {{ props.reason.type }}</p>
    </div>
  </div>
</template>

<style>
.meta {
  display: flex;
  gap: var(--space-1);
  background: var(--base-20);
}

.meta .label {
  background: var(--base-120);
  color: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-1);
}
</style>
