<script setup lang="ts">
import type { Reason } from '../types/reasons'
import ReasonMeta from './ReasonMeta.vue'

const props = defineProps<{
  reason: Reason
}>()
</script>

<template>
  <div class="argument">
    <!-- <NuxtImg
      src="https://images.unsplash.com/photo-1731331131233-4f73c93ae693?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt=""
    /> -->
    <div class="conclution card">
      <p>{{ props.reason.conclution }}</p>
      <div class="label">
        <p>
          {{ props.reason.credibility.level }}
          <span>{{ props.reason.credibility.value }}</span>
        </p>
      </div>
    </div>
    <!-- <ReasonMeta :reason="props.reason" /> -->
    <slot />
  </div>
</template>

<style>
.argument {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-20);
  border: solid var(--border-size) var(--base-60);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.argument .card {
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.conclution {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conclution .label {
  background: var(--base-20);
  color: var(--base-120);
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  padding: var(--space-1) var(--space-2);
  border-left: solid var(--border-size) var(--base-60);
}
</style>
