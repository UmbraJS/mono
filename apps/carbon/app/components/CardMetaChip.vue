<template>
  <div id="CardMetaChip" class="border">
    <slot />
  </div>
</template>

<style>
#CardMetaChip {
  display: flex;
  align-items: center;
  gap: var(--space-quark);
  width: 100%;
  background-color: var(--base);
  padding: var(--space-quark);
  border-radius: 0px;
}
</style>
