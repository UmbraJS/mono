<script setup lang="ts">
import { Drawer } from '@nobel/core'

import type { Character } from '../../types'

defineProps<{
  character: Character;
}>()
</script>

<template>
  <Drawer title="Player Settings" description="Configure your character settings and preferences">
    <template #trigger>
      <slot />
    </template>
    <template #content>
      <div class="DialogWrapper">
        <h1>{{ character.name }}</h1>
      </div>
    </template>
  </Drawer>
</template>

<style></style>
