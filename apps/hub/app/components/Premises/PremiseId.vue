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
    <div class="cutout"></div>
  </div>
</template>

<style>
.premise-id {
  position: absolute;
  z-index: 2;
  left: calc(0px - var(--block) / 2);
  margin-bottom: var(--space-1);
}

.premise-id .circle {
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;

  background-color: var(--accent-60);
  color: var(--accent-120);
  border: solid var(--border-size) var(--accent-120);

  height: var(--block);
  aspect-ratio: 1 / 1;

  font-weight: bold;
}

.premise-id .cutout {
  --outline: var(--space-1);
  position: absolute;
  z-index: 1;
  top: calc(0px - var(--outline));
  left: calc(0px - var(--outline));

  background-color: var(--base-20);
  border: solid var(--border-size) var(--base-60);
  border-radius: 100%;

  aspect-ratio: 1 / 1;
  height: calc(var(--block) + var(--outline) * 2);

  transform: scale(1 + 1px);
}
</style>
