<script setup lang="ts">
const quest = useQuest()

const actProgress = computed(() => {
  const numberOfActs = quest.quest?.acts.length ?? 0
  return (quest.progress.act / numberOfActs) * 100
})

const dayProgress = computed(() => {
  const numberOfDays = 7 // Assuming each act has 7 days
  return (quest.progress.day / numberOfDays) * 100
})
</script>

<template>
  <div id="DayCompass">
    <p class="caption">act: {{ quest.progress.act }}</p>
    <p class="caption">day: {{ quest.progress.day }}</p>
    <div class="progressBars">
      <div class="actBar" :style="{ width: actProgress + '%' }" />
      <div class="dayBar" :style="{ width: dayProgress + '%' }" />
    </div>
  </div>
</template>

<style scoped>
#DayCompass {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  gap: var(--space-1);

  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;

  padding: var(--space-2);
  background: var(--base-20);
  border-radius: var(--radius);
}

.progressBars {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.actBar {
  width: 100%;
  height: 4px;
  background: var(--accent);
  transition: var(--time);
}

.dayBar {
  width: 100%;
  height: 4px;
  background: var(--accent-70);
  transition: var(--time);
}
</style>
