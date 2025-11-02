<script setup lang="ts">
import UmbraAppliedToElement from '../components/umbra/UmbraAppliedToElement.vue'
</script>

<template>
  <div class="element-page">
    <div class="demo-section">
      <UmbraAppliedToElement />
    </div>

    <div class="info-section">
      <h2>How it works</h2>
      <ul>
        <li><code>--accent-20</code> controls the button background color</li>
        <li><code>--accent-120</code> controls the button text color</li>
        <li>Spline connectors visually link the element to its CSS variable names</li>
        <li>This pattern works for any element styled with Umbra tokens</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.element-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
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

.demo-section {
  border-radius: var(--radius-3);
  margin-bottom: var(--space-4);
}

.info-section {
  background: var(--base-10);
  border: 1px solid var(--base-80);
  border-radius: var(--radius);
  padding: var(--space-4);
}

.info-section h2 {
  margin: 0 0 var(--space-3) 0;
  color: var(--base-text);
  font-size: var(--font-size-4);
}

.info-section ul {
  margin: 0;
  padding-left: var(--space-4);
  color: var(--base-text);
  line-height: 1.8;
}

.info-section li {
  margin-bottom: var(--space-2);
}

.info-section code {
  background: var(--base-20);
  padding: 2px var(--space-1);
  border-radius: var(--radius-1);
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: var(--font-size-1);
  color: var(--accent-100);
}
</style>
