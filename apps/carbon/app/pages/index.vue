<template>
  <div class="CarbonLayout">
    <OpponentHeader />
    <MatchBoard />
    <PlayerHeader />
  </div>
</template>

<style>
.CarbonLayout {
  display: grid;
  --side-size: 17vh;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: var(--side-size) 1fr var(--side-size);
  gap: var(--space-1);
  height: 100vh;
  padding: var(--space-1);
}
</style>
