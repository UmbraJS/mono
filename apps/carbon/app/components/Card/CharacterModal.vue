<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogModal } from '@nobel/core'
import type { Character } from '../../../types'

defineProps<{
  character: Character;
}>()
</script>

<template>
  <ClientOnly>
    <DialogRoot>
      <DialogTrigger id="CharacterModalTrigger">
        <slot />
      </DialogTrigger>
      <DialogModal variant="accent">
        <div class="DialogWrapper">
          <h1>{{ character.name }}</h1>
        </div>
      </DialogModal>
    </DialogRoot>
    <template #fallback>
      <slot />
    </template>
  </ClientOnly>
</template>

<style></style>
