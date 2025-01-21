<template>
  <div class="Premises">
    <slot />
  </div>
</template>

<style>
.argument .Premises {
  display: grid;
  gap: var(--space-1);
  grid-template-columns: auto 1fr;
}
</style>
