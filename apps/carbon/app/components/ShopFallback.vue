<template>
  <div id="EmptyState">
    <Icon name="carbon:shopping-cart" size="2rem" />
    <p>No shop available</p>
  </div>
</template>

<style>
#EmptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3);
  color: var(--base-contrast);
  background-color: var(--base-40);
  border-radius: var(--radius);
}
</style>
