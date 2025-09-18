<template>
  <button class="buttonPrimary">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button.buttonPrimary {
  background: var(--base-100);
  color: var(--base-10);
  border: solid var(--border-size) var(--base-100);
}
</style>
