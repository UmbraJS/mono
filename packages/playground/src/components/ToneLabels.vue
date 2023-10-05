<template>
  <div class="labels">
    <div class="shade-group" :style="{ gridColumn: 'span 4' }">
      <p>background</p>
      <div class="bracket"></div>
    </div>
    <div class="shade-group" :style="{ gridColumn: 'span 3' }">
      <p>midground</p>
      <div class="bracket"></div>
    </div>
    <div class="shade-group" :style="{ gridColumn: 'span 4' }">
      <p>foreground</p>
      <div class="bracket"></div>
    </div>
  </div>
</template>

<style scoped>
.labels {
  --offset: 19px;
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 0rem;
  height: 3rem;
  width: 100%;
  margin-bottom: var(--offset);
}

.shade-group {
  --radius: 13px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shade-group p {
  font-weight: 700;
  letter-spacing: 1px;
}

.shade-group .bracket {
  position: absolute;
  bottom: calc(var(--offset) * -1);
  border: solid 1px var(--base-50);

  border-bottom: 0px;
  border-top-right-radius: var(--radius);
  border-top-left-radius: var(--radius);

  width: 100%;
  height: var(--offset);
}
</style>
