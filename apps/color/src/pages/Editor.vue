<script setup lang="ts">
import EditUmbra from '../components/umbra/EditUmbra.vue'
</script>

<template>
  <div class="editor-page">
    <div class="page-section">
      <h2>Theme Editor</h2>
      <p class="description">Edit background, foreground, and accent colors with live preview</p>
      <EditUmbra :show-tokens="true" />
    </div>

    <div class="page-section">
      <h2>Theme Editor with Horizontal Layout</h2>
      <p class="description">Compact horizontal view of color tokens</p>
      <EditUmbra :show-horizontal="true" />
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-section {
  background: var(--base-10);
  border: 1px solid var(--base-20);
  border-radius: var(--radius-3);
  padding: var(--space-4);
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
