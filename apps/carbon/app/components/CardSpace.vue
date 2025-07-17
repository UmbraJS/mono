<script setup lang="ts">
defineProps<{
  index: string;
  hovered?: boolean;
}>();
</script>

<template>
  <div class="cardSpace border" :class="{ 'drag-hit-real': hovered }" :data-dropzone="index">
    <Icon name="carbon:navaid-ndb-dme" size="4em" />
  </div>
</template>

<style lang="scss">
.cardSpace {
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  height: 100%;
  width: 100%;

  background-color: var(--base);
  color: var(--base-50);

  transition: var(--slower);
}

.cardSpace.drag-hit-real {
  background-color: var(--base-100);
  color: var(--base-0);
}
</style>
