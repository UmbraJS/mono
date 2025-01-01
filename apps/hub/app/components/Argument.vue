<script setup lang="ts">
import type { Reason } from '../types/reasons'
import ReasonConclution from './ReasonConclution.vue'
import ReasonMeta from './ReasonMeta.vue'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <div class="argument bodycopy">
    <header>
      <ReasonConclution :reason="props.reason" />
      <NuxtImg
        src="https://images.unsplash.com/photo-1731331131233-4f73c93ae693?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
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
  padding-left: var(--space-3);
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
  padding-top: var(--space-4);
  padding-bottom: 0px;
  border-bottom: solid var(--border-size) var(--base-60);
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
