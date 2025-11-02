<script setup lang="ts">
import type { ValidationWarning } from '@umbrajs/core'

defineProps<{
  warnings: ValidationWarning[]
}>()
</script>

<template>
  <div v-if="warnings.length > 0" class="validation-warnings">
    <h3>🎨 Color Validation Warnings ({{ warnings.length }})</h3>
    <div v-for="(warning, index) in warnings" :key="index" class="warning-item">
      <div class="warning-header">
        <span class="warning-severity">{{ warning.severity }}</span>
        <span class="warning-type">{{ warning.type }}</span>
      </div>
      <p class="warning-message">{{ warning.message }}</p>
      <div class="warning-context">
        <code>{{ JSON.stringify(warning.context, null, 2) }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validation-warnings {
  margin: 2rem auto;
  max-width: 800px;
  padding: 1.5rem;
  background: var(--base-10);
  border: 2px solid var(--accent-30);
  border-radius: 8px;
}

.validation-warnings h3 {
  margin: 0 0 1rem 0;
  color: var(--base-text);
  font-size: 1.25rem;
}

.warning-item {
  background: var(--base);
  border: 1px solid var(--base-30);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.warning-item:last-child {
  margin-bottom: 0;
}

.warning-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.warning-severity {
  padding: 0.25rem 0.5rem;
  background: var(--accent-20);
  color: var(--accent-text);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.warning-type {
  padding: 0.25rem 0.5rem;
  background: var(--base-20);
  color: var(--base-text);
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.warning-message {
  margin: 0.5rem 0;
  color: var(--base-text);
  font-size: 0.95rem;
}

.warning-context {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: var(--base-10);
  border-radius: 4px;
  overflow-x: auto;
}

.warning-context code {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--base-110);
  white-space: pre;
}
</style>
