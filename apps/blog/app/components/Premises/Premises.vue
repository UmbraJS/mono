<template>
  <div class="Premises">
    <slot />
  </div>
</template>

<style>
.argument .Premises {
  display: grid;
  grid-template-columns: 1fr;
}

/* Has more than 1 child */
.argument .Premises:has(> :nth-child(2)) {
  gap: var(--space-1);
  grid-template-columns: auto 1fr;
}
</style>
