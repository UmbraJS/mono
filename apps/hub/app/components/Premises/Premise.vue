<script setup lang="ts">
const props = defineProps<{
  type?: 'infavor' | 'inopposition'
}>()
</script>

<template>
  <div class="premise" :class="props.type">
    <slot />
  </div>
</template>

<style>
.premise {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-1);
  align-items: center;
  position: relative;
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  min-height: var(--block-big);
  overflow: hidden;
}

.premise.infavor {
  color: var(--success-120);
  border: solid var(--border-size) var(--success-120);
  background: var(--success-40);
}

.premise.inopposition {
  background: var(--warning-40);
  color: var(--warning-120);
  border: solid var(--border-size) var(--warning-120);
}
</style>
