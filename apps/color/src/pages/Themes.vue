<script setup lang="ts">
import UmbraApplied from '../components/umbra/UmbraApplied.vue'
</script>

<template>
  <div class="themes-page">
    <UmbraApplied />
  </div>
</template>

<style scoped>
.themes-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-5);
}

.page-header h1 {
  margin: 0 0 var(--space-2) 0;
  color: var(--base-text);
  font-size: var(--font-size-6);
}

.description {
  margin: 0;
  color: var(--base-80);
  font-size: var(--font-size-2);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>
