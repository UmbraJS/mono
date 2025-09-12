<template>
  <div class="RadioCheckmark">
    <div class="RadioMark"></div>
  </div>
</template>

<style>
.RadioCheckmark {
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

.RadioCheckmark .RadioMark {
  position: absolute;
  height: 0px;
  aspect-ratio: 1 / 1;
  background-color: var(--base-120);
  border-radius: var(--space-quark);
  transition: var(--time);
}

.RadioCheckbox.checked .RadioCheckmark {
  height: var(--block);
}

.RadioCheckbox.checked .RadioCheckmark .RadioMark {
  height: var(--space-atom);
}
</style>
