<template>
  <button class="primary base-accent">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button.primary {
  background: var(--base-100);
  color: var(--base-10);
  border: solid var(--border-size) var(--base-100);
}
</style>
