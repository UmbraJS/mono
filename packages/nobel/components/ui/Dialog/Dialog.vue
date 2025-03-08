<script setup lang="ts">
import { DialogRoot, DialogTrigger } from 'reka-ui'
import Button from '../Button/Button.vue'
import DialogModal from './DialogModal.vue'

defineProps<{
  variant: 'warning' | 'base' | 'success' | 'accent'
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger>
      <slot name="trigger">
        <Button size="medium"> Open Dialog </Button>
      </slot>
    </DialogTrigger>
    <DialogModal :variant="variant">
      <slot name="content" />
    </DialogModal>
  </DialogRoot>
</template>
