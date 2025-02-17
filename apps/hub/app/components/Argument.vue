<script setup lang="ts">
import type { Reason } from '../types/reasons'
import ReasonConclution from './Reason/Conclution.vue'
import { Button, ButtonGroup } from '@nobel/core'

const props = defineProps<{
  reason: Reason
}>()

const bookmarked = ref(false)
const edit = ref(false)
</script>

<template>
  <div class="argument bodycopy p-2">
    <header :class="{ hasImage: props.reason.background }">
      <ReasonConclution :reason="props.reason" />
      <NuxtImg
        v-if="props.reason.background"
        :src="props.reason.background.url"
        :alt="props.reason.background.alt"
        :style="{ objectPosition: props.reason.background.offset }"
      />
      <ButtonGroup class="controls">
        <Button
          size="medium"
          :variant="bookmarked ? 'primary' : 'base'"
          @click="bookmarked = !bookmarked"
        >
          <Icon v-if="bookmarked" name="material-symbols:bookmark" size="1em" />
          <Icon v-else name="material-symbols:bookmark-add-outline-rounded" size="1em" />
        </Button>
        <Button size="medium" variant="base">
          <Icon name="mdi:cogs" size="1em" />
        </Button>
        <Button size="medium" :variant="edit ? 'primary' : 'base'" @click="edit = !edit">
          <Icon v-if="edit" name="pixelarticons:edit" size="1em" />
          <Icon v-else name="pixelarticons:edit" size="1em" />
        </Button>
      </ButtonGroup>
    </header>
    <div class="argument-content">
      <!-- <ReasonMeta :reason="props.reason" /> -->
      <slot />
      <Button v-if="edit" size="small" variant="base">
        <Icon name="material-symbols:add-2" size="0.8em" />
      </Button>
    </div>
  </div>
</template>

<style>
.argument {
  display: grid;
  background-color: var(--base-20);
  border: solid var(--border-size) var(--base-60);
  border-radius: var(--radius);
  overflow: hidden;
}

.argument-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2);
}

.argument .card {
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
}

.argument header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2);
  border-bottom: solid var(--border-size) var(--base-60);
}

.argument header.hasImage {
  background-color: var(--accent-30);
  /* border-bottom: solid var(--border-size) var(--base-60);
  padding: var(--space-2); */
}

.argument header .controls {
  position: relative;
  z-index: 0;
}

.argument header img {
  position: absolute;
  z-index: 0;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: var(--radius);
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  opacity: 0.6;
}
</style>
