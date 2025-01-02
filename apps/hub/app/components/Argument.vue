<script setup lang="ts">
import type { Reason } from '../types/reasons'
import ReasonConclution from './Reason/Conclution.vue'
import ReasonMeta from './Reason/Meta.vue'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <div class="argument bodycopy">
    <header :class="{ hasImage: props.reason.background }">
      <ReasonConclution :reason="props.reason" />
      <NuxtImg
        v-if="props.reason.background"
        :src="props.reason.background.url"
        :alt="props.reason.background.alt"
        :style="{ objectPosition: props.reason.background.offset }"
      />
    </header>
    <div class="argument-content">
      <!-- <ReasonMeta :reason="props.reason" /> -->
      <slot />
    </div>
  </div>
</template>

<style>
.argument {
  display: flex;
  flex-direction: column;
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
  padding-top: var(--space-3);
}

.argument .card {
  padding-left: var(--space-1);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.argument header {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-2);
  padding-top: 0px;
  padding-bottom: 0px;
  border-bottom: solid var(--border-size) var(--base-60);
}

.argument header.hasImage {
  padding-top: var(--space-4);
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
}
</style>
