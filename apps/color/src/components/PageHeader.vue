<template>
  <div class="page-header">
    <div class="controls">
      <slot name="actions"></slot>
      <slot name="modes"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  margin-bottom: var(--space-2);
  max-width: 1400px;
}

.controls {
  display: flex;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
  border-radius: var(--radius);
}
</style>
