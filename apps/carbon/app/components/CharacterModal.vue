<script setup lang="ts">
import { Drawer } from 'umbraco'

import type { Character } from '../../types'

defineProps<{
  character?: Character;
}>()
</script>

<template>
  <Drawer v-if="character" title="Player Settings" description="Configure your character settings and preferences">
    <template #trigger>
      <slot />
    </template>
    <template #content>
      <div class="DialogWrapper">
        <h1>{{ character.name }}</h1>
      </div>
    </template>
  </Drawer>
  <slot v-else />
</template>

<style></style>
