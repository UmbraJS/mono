<script setup lang="ts"></script>

<template>
  <div class="cardSpace border" data-dropzone>
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
}

.cardSpace.drag-hit {
  background-color: var(--base-100);
  color: var(--base-0);
  transition: .02s ease-in-out;
}
</style>
