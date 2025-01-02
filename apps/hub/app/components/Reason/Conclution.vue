<script setup lang="ts">
import type { Reason } from '../../types/reasons'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <div class="conclution card">
    <p>{{ props.reason.conclution }}</p>
    <ReasonCredibility :credibility="props.reason.credibility" />
  </div>
</template>

<style>
.conclution {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  transform: translateY(50%);
  min-height: var(--block-big);
}

.conclution .label {
  background: var(--base-20);
  color: var(--base-120);
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  padding: var(--space-1) var(--space-2);
  border-left: solid var(--border-size) var(--base-60);
}
</style>
