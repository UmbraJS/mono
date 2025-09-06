<script setup lang="ts">
import ChipLabel from './ChipLabel.vue'
import Button from '../Button/Button.vue'
import ButtonGroup from '../Button/ButtonGroup.vue'
import IconClose from '../../Icons/IconClose.vue'
</script>

<template>
  <div class="chip">
    <ButtonGroup>
      <ChipLabel />
      <Button variant="base" :size="'small'" color="warning">
        <IconClose />
      </Button>
      <Button variant="base" :size="'small'" color="warning">
        <IconClose />
      </Button>
    </ButtonGroup>
  </div>
</template>

<style scoped>
.chip {
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--block);
  color: var(--base-120);
}
</style>
