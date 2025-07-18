<template>
  <div id="ChipPassive">
    <slot />
  </div>
</template>

<style>
#ChipPassive {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: var(--space-1);
  cursor: pointer;
}
</style>
