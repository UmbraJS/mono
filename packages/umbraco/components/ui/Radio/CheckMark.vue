<template>
  <div class="checkmark">
    <div class="mark"></div>
  </div>
</template>

<style scoped lang="scss">
.checkmark {
  display: flex;
  position: relative;
  border-radius: 30px;
  padding: 0px !important;
  height: var(--space-2);
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid var(--border-size) var(--base-60);
  transition: var(--time);
}

.checkmark .mark {
  position: absolute;
  height: 0px;
  aspect-ratio: 1 / 1;
  background-color: var(--base-120);
  border-radius: var(--space-quark);
  transition: var(--time);
}

.checkbox.checked .checkmark {
  height: var(--block);
}

.checkbox.checked .checkmark .mark {
  height: var(--space-atom);
}
</style>
