<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <div class="text-screen border">
    <p><slot></slot></p>
  </div>
</template>

<style scoped lang="scss">
.text-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius);
  height: var(--block-inner);
  background: var(--base-20);
  width: 150px;
}
</style>
