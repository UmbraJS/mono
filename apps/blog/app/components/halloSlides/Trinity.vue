<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, useTemplateRef } from 'vue';

const space = useTemplateRef('space');
const shape = useTemplateRef('shape');
const color = useTemplateRef('color');

const from = {
  scale: 1,
  x: 0,
  y: 0,
  opacity: 0
};

const duration = 0.4;
const tl = gsap.timeline({
  paused: true
});

onMounted(() => {
  gsap.set([space.value, shape.value], from);
  gsap.set(color.value, {
    ...from,
    opacity: 1
  });

  tl.to(color.value, {
    scale: 1,
    x: -125,
    y: 50,
    opacity: 1,
    duration,
    ease: "back.out(1.7)",
  });

  tl.to(shape.value, {
    scale: 1,
    x: 0,
    y: -75,
    opacity: 1,
    duration,
    ease: "back.out(1.7)",
  }, "-=0.3");


  tl.to(space.value, {
    scale: 1,
    x: 125,
    y: 50,
    opacity: 1,
    duration,
    ease: "back.out(1.7)",
  }, "-=0.3");
});

function playTimeline() {
  tl.play();
}
</script>

<template>
  <div class="SamSlide Trinity" @click="playTimeline">
    <div ref="space" class="TrinityItem">
      <h1>Space</h1>
    </div>
    <div ref="shape" class="TrinityItem">
      <h1>Shape</h1>
    </div>
    <div ref="color" class="TrinityItem">
      <h1>Color</h1>
    </div>
  </div>
</template>

<style>
.Trinity {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 30em;
  cursor: pointer;
}

.TrinityItem {
  position: absolute;
}
</style>
