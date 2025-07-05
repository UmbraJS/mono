<script setup lang="ts">
defineProps<{
  gridLayout: 'event' | 'match'
}>()
</script>


<template>
  <main id="CarbonGrid" :class="gridLayout">
    <slot />
  </main>
</template>

<style>
#CarbonGrid {
  --side-size: 17vh;

  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-1);

  height: 100vh;
  width: 100%;
  padding: var(--space-1);
}

#CarbonGrid.event {
  grid-template-rows: 1fr var(--side-size);
}

#CarbonGrid.match {
  grid-template-rows: var(--side-size) 1fr var(--side-size);

}
</style>
