<script setup lang="ts">
import {
  Button,
  toast,
  DialogRoot,
  DialogTrigger,
  DialogModal,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@nobel/core'
import type { Card } from '../../types'

defineProps<{
  card: Card
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogModal variant="accent">
      <div class="dialog-warning-title">
        <Icon name="pixelarticons:warning-box" size="2rem" />
        <DialogTitle> {{ card.name }} </DialogTitle>
      </div>
      <DialogDescription>
        <img :src="card.image?.default" alt="card image" class="dialog-image" />
      </DialogDescription>
    </DialogModal>
  </DialogRoot>
</template>

<style lang="scss"></style>
