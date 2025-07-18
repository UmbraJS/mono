<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div id="CardEffect">
    <p class="caption">{{ text }}</p>
  </div>
</template>

<style>
#CardEffect {
  display: inline-block;
  padding: var(--space-quark);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  width: 100%;
}
</style>
