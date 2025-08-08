<script setup lang="ts">
import { ref, provide } from 'vue'
const BifrostBoard = ref<HTMLDivElement>()

provide('BifrostBoard', BifrostBoard)

</script>

<template>
  <div id="BifrostBoard" ref="BifrostBoard">
    <slot></slot>
  </div>
</template>

<style>
#BifrostBoard {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background: var(--accent-20);

  border-radius: var(--radius);
  width: 60em;
  height: 100%;
  max-width: 90dvw;
}
</style>
