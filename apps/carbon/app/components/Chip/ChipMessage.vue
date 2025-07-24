<template>
  <div id="ChipMessage" class="border">
    <slot />
  </div>
</template>

<style>
#ChipMessage {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  color: var(--base-120);
  background-color: var(--base-10);
  border-radius: var(--radius);
}
</style>
