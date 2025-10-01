<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

const { stage = 3 } = defineProps<{ stage: number; }>();

const eden = useTemplateRef('eden');

function state(stage: number) {
  switch (stage) {
    case 2:
      return "shade"
    case 3:
      return "space"
    case 4:
      return "shape"
    case 5:
      return "intimate"
    case 6:
      return "divorced"
    default:
      return "eden"
  }
}

const from = {
  scale: 5,
  opacity: 0
};

const duration = 0.4;

onMounted(() => {
  gsap.fromTo(
    eden.value,
    from,
    {
      scale: 1,
      opacity: 1,
      duration,
    }
  );
});
</script>

<template>
  <div ref="eden" class="SamSlide" :class="state(stage)">
    <div class="Eden border">
      <div class="Shape"></div>
      <div class="Shape"></div>
    </div>
  </div>
</template>

<style>
.Shape {
  background: black;
}

.Eden {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 70vw;
  height: 70vh;
  background-color: white;
  border-radius: var(--radius);
}

.shade .Shape:nth-child(1) {
  width: 50%;
  height: 100%;
}

.space .Eden {
  justify-content: space-between;
  overflow: hidden;
}

.space .Shape {
  width: 35%;
  height: 100%;
}
</style>
