<script setup lang="ts">
const store = useStore()
</script>

<template>
  <div v-if="true" id="ErrorMessage" class="base-warning border" role="alert" aria-live="polite">
    <Icon name="carbon:warning" size="1rem" />
    <p><span>Error: </span>{{ store.money.cardPurchase.purchaseError }}</p>
  </div>
</template>

<style scoped>
#ErrorMessage {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  padding: var(--space-1);
  background-color: var(--base-10);
  color: var(--base-120);
  border-radius: var(--radius);
}
</style>
