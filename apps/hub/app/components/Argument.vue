<script setup lang="ts">
const props = defineProps<{
  reasoning: 'Deductive Reasoning' | 'Inductive Reasoning'
  conclution: string
}>()
</script>

<template>
  <div class="argument">
    <div class="meta">
      <p>{{ props.reasoning }}</p>
    </div>
    <div class="conclution card">
      <p>{{ props.conclution }}</p>
    </div>
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
  padding: var(--space-2);
  padding-left: var(--space-3);
  background: var(--base-10);
  border-radius: var(--radius);
  border: solid var(--border-size) var(--base-60);
  transition: var(--slower);
}

.argument .meta {
  display: flex;
  align-items: center;
  position: absolute;
  top: calc(0px - var(--block-big) + var(--space-2));
  left: calc(var(--space-2));
  left: calc(0px - var(--border-size));
  background: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
  padding: 0px var(--space-1);
  width: max-content;
  height: var(--block-big);
  border: solid var(--border-size) var(--base-60);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom: 0px;
  transition: color var(--slower);
}
</style>
