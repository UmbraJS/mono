<script setup lang="ts">
import EditUmbra from '../components/umbra/EditUmbra.vue'
</script>

<template>
  <div class="editor-page">
    <div class="page-section">
      <EditUmbra :show-tokens="true" />
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-section h2 {
  margin: 0 0 var(--space-2) 0;
  color: var(--base-text);
  font-size: var(--font-size-5);
}

.description {
  margin: 0 0 var(--space-4) 0;
  color: var(--base-80);
  font-size: var(--font-size-2);
}
</style>
