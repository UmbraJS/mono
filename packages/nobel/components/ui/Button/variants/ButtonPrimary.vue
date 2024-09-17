<template>
  <button class="primary">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button.primary {
  background: var(--color-100);
  color: var(--color-10);
  border: solid var(--border-size) var(--color-100);
}
</style>
