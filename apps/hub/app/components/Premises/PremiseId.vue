<script setup lang="ts">
const { id = '01' } = defineProps({
  id: String,
})
</script>

<template>
  <div class="premise-id">{{ id }}</div>
</template>

<style>
.premise-id {
  position: absolute;
  left: calc(0px - var(--block) / 2);

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;

  background-color: var(--accent-60);
  color: var(--accent-120);
  outline: solid var(--space-quark) var(--base-20);
  border: solid var(--border-size) var(--accent-120);

  width: max-content;
  height: var(--block);
  aspect-ratio: 1 / 1;

  font-weight: bold;
  margin-bottom: var(--space-1);
}
</style>
