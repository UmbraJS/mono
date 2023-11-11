<script setup lang="ts">
import ActionLabels2 from './ActionLabels2.vue'
</script>

<template>
  <div class="labelsx">
    <div class="labels">
      <div class="shade-group" :style="{ gridColumn: 'span 2' }">
        <p>root</p>
        <div class="bracket"></div>
      </div>
      <div class="shade-group" :style="{ gridColumn: 'span 3' }">
        <p>panel</p>
        <div class="bracket"></div>
      </div>
      <div class="shade-group" :style="{ gridColumn: 'span 5' }">
        <p>border</p>
        <div class="bracket"></div>
      </div>
      <div class="shade-group" :style="{ gridColumn: 'span 4' }">
        <p>text</p>
        <div class="bracket"></div>
      </div>
    </div>

    <!-- <ActionLabels2 /> -->
  </div>
</template>

<style scoped>
.labelsx {
  position: relative;
  background: red;
}

.labels {
  position: absolute;
  --offset: 19px;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 0rem;
  height: 3rem;
  width: 100%;
  margin-top: var(--offset);
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
  top: calc(var(--offset) * -1);
  border: solid 1px var(--base-50);

  border-top: 0px;
  border-bottom-right-radius: var(--radius);
  border-bottom-left-radius: var(--radius);

  width: 100%;
  height: var(--offset);
}
</style>
