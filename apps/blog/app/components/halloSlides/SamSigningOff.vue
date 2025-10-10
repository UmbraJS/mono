<script setup lang="ts">
</script>

<template>
  <div class="Slide">
    <div class="TheBox">
      <h1>The End</h1>
      <p class="display">Thank you for joining me on this journey through design tokens and their applications!</p>
      <Icon name="carbon:3d-curve-auto-colon" scale="4" />
    </div>
  </div>
</template>

<style>
.Slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--base);
  color: var(--base-text);
  text-align: center;
  padding: var(--space-5);
}

.TheBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
</style>
