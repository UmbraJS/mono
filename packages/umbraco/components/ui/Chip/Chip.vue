<script setup lang="ts">
import ChipLabel from './ChipLabel.vue'
import Button from '../Button/Button.vue'
import ButtonGroup from '../Button/ButtonGroup.vue'
import IconClose from '../../Icons/IconClose.vue'
import type { ButtonSize } from '../../../types/button'

defineProps<{
  size?: ButtonSize;
}>()
</script>

<template>
  <div class="UChip">
    <ButtonGroup>
      <ChipLabel :size="size ? size : 'small'">
        <slot></slot>
      </ChipLabel>
      <Button variant="base" :size="size ? size : 'small'" color="warning">
        <IconClose />
      </Button>
    </ButtonGroup>
  </div>
</template>

<style scoped>
.UChip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--block);
  color: var(--base-120);
}
</style>
