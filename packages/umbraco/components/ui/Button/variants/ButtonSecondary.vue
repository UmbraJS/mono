<template>
  <button class="buttonSecondary">
    <slot></slot>
  </button>
</template>

<style lang="scss">
.button.buttonSecondary {
  color: var(--base-10);
  background: var(--base-100);
  border-color: var(--base-10);
}

.button.buttonSecondary p,
.button.buttonSecondary span {
  color: inherit;
}
</style>
