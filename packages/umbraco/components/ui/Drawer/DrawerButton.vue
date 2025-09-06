<script setup lang="ts">
import Drawer from './Drawer.vue'
import Button from '../Button/Button.vue'

defineProps<{
  className?: string
}>()
</script>

<template>
  <Drawer>
    <template #trigger>
      <Button :class="className" color="default" variant="base">
        <slot name="trigger" />
      </Button>
    </template>
    <template #content>
      <slot name="content" />
    </template>
  </Drawer>
</template>
