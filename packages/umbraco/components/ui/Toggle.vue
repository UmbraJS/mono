<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from './Button/Button.vue'

const { value, icon = "carbon:face-satisfied" } = defineProps<{
  value: boolean
  icon?: string
}>()
</script>

<template>
  <Button id="ToggleWrapper" :class="{ right: value }" size="small">
    <div class="handle">
      <Icon :icon="icon" />
    </div>
  </Button>
</template>

<style lang="scss">
#ToggleWrapper.buttonSmall {
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

#ToggleWrapper.buttonSmall:focus {
  background-color: var(--base-50);
}
</style>
