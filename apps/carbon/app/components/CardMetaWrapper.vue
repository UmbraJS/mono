<template>
  <div class="CardMetaWrapper">
    <slot />
  </div>
</template>

<style>
.CardMetaWrapper {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  width: 100%;
  background-color: var(--base);
  padding: var(--space-quark);
}
</style>
