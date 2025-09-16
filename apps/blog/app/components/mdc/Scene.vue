<script setup lang="ts">
</script>


<template>
  <div class="NarrativeScene">
    <slot name="action"></slot>
    <div class="FrameEdge base-success">
      <div class="Validity"></div>
    </div>
    <slot name="reaction"></slot>
  </div>
</template>

<style>
.FrameEdge {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1px;
  background-color: var(--base-120);
}

.Validity {
  display: flex;
  gap: var(--space-1);
  position: absolute;
  z-index: 1;
}

.NarrativeScene {
  display: flex;
  flex-direction: column;
}

.NarrativeScene>*:nth-child(1) {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.NarrativeScene>*:nth-last-child(1) {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}
</style>
