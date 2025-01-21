<script setup lang="ts">
import type { Reason } from '../../types/reasons'

const props = defineProps<{
  reason: Reason
}>()

const conclution = ref<string>(props.reason.conclution)
</script>

<template>
  <div class="conclution-wrapper">
    <div class="icons">
      <Icon v-if="true" name="pixelarticons:plus" />
      <Icon v-else name="pixelarticons:minus" />
    </div>
    <h2>{{ conclution }}</h2>
  </div>
</template>

<style scoped>
.conclution.card {
  z-index: 2;
}

.conclution-wrapper {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  z-index: 1;
}

.conclution-wrapper .icons {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent-50);
  color: var(--accent-120);
  height: var(--block-big);
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  border: solid var(--border-size) var(--accent-120);
}
</style>
