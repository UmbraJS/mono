<template>
  <button class="secondary">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button.secondary {
  color: var(--base-10);
  background: var(--base-100);
  border-color: var(--base-10);
}
</style>
