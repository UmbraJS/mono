<template>
  <div id="ButtonSection">
    <slot />
  </div>
</template>

<style scoped>
#ButtonSection {
  display: flex;
  gap: var(--space-quark);
}
</style>
