<script setup lang="ts">
defineProps<{
  type?: 'infavor' | 'inopposition'
}>()
</script>

<template>
  <div class="premise">
    <slot />
  </div>
</template>

<style>
.premise {
  position: relative;
  padding: var(--space-2);
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--time);
}
</style>
