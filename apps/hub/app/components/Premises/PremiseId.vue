<script setup lang="ts">
const { id = '01' } = defineProps({
  id: String,
})
</script>

<template>
  <div class="premise-id">
    <div class="circle">
      {{ id }}
    </div>
  </div>
</template>

<style>
.premise-id {
  /* position: absolute; */
  /* z-index: 2; */
  /* left: calc(0px - var(--block) / 2); */
  /* padding: var(--space-1); */
}

.premise-id .circle {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  border-radius: var(--radius);

  background-color: var(--accent-60);
  color: var(--accent-120);
  border: solid var(--border-size) var(--accent-120);

  height: var(--block);
  aspect-ratio: 1 / 1;

  font-weight: bold;
}
</style>
