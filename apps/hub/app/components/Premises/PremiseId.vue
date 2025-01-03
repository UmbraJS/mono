<script setup lang="ts">
const { id = 1 } = defineProps<{
  id?: number
}>()
</script>

<template>
  <p class="premise-id">
    <slot>
      <span> 0{{ id }} </span>
    </slot>
  </p>
</template>

<style>
.premise-id {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  border-right: solid var(--border-size) var(--base-60);

  background-color: var(--accent-40);
  color: var(--accent-120);

  height: 100%;
  min-height: var(--block-big);
  width: var(--block-big);
}
</style>
