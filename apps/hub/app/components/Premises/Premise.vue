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
  position: relative;
  padding: var(--space-1);
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--time);
}

.premise.infavor {
  background: var(--success-40);
  color: var(--success-120);
  border: solid var(--border-size) var(--success-120);
}

.premise.inopposition {
  background: var(--warning-40);
  color: var(--warning-120);
  border: solid var(--border-size) var(--warning-120);
}
</style>
