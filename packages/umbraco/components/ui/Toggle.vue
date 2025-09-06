<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from './Button/Button.vue'

defineProps<{
  value: boolean
}>()
</script>

<template>
  <Button class="toggle-wrapper" :class="{ right: value }" size="small">
    <div class="handle">
      <Icon icon="carbon:face-satisfied" />
    </div>
  </Button>
</template>

<style lang="scss">
button.toggle-wrapper.small {
  display: inline-block;

  width: calc(var(--block) * 2);
  padding: 0 calc(var(--space-quark) / 2);
  background-color: var(--base-10);

  .handle {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--base-100);
    color: var(--base-10);
    border-radius: var(--inner-radius);
    height: calc(100% - var(--space-quark));
    aspect-ratio: 1 / 1;
    transition: margin-left var(--time);
  }

  &.right .handle {
    margin-left: calc(100% - var(--block-small) - (var(--space-quark) / 2));
  }
}

button.toggle-wrapper.small:focus {
  background-color: var(--base-50);
}
</style>
