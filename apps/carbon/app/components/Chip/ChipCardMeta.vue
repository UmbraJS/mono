<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>

  <div id="ChipCardMeta">
    <p class="caption">{{ text }}</p>

    <p>lol </p>
  </div>

</template>

<style>
#ChipCardMeta {
  display: inline-block;
  padding: var(--space-quark);
  background-color: var(--base-20);
  color: var(--base-120);
  border-radius: var(--radius);
}
</style>
