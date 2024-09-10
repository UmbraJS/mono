<script setup lang="ts">
import IconClose from '../../Icons/IconClose.vue'
</script>

<template>
  <button class="action border focus">
    <IconClose />
  </button>
</template>

<style scoped>
.chip .action {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--block-inner);
  aspect-ratio: 1 / 1;
  background-color: var(--warning-60);
  transition: var(--slow);
}

.chip .action > * {
  transition: var(--slow);
}

.chip .action:hover {
  background-color: var(--warning-100);
  transition: var(--time);
}

.chip .action:active {
  color: var(--warning-120);
  background-color: var(--warning-10);
  transition: var(--time);
}

.chip .action:active > * {
  transform: scale(2);
  transition: var(--time);
}

.chip .action:focus {
  color: var(--warning-120);
  background-color: var(--warning-20);
  transition: var(--time);
}
</style>
