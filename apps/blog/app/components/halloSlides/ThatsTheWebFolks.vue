<script setup lang="ts">
import MockPage from './MockPage/MockPage.vue';
</script>

<template>
  <div class="TheWeb">
    <MockPage />
    <p class="display">And onto this we attempt to build systems.</p>
  </div>
</template>

<style scoped>
.TheWeb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
}
</style>
