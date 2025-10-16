<script setup lang="ts">
import { onMounted } from 'vue';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

onMounted(() => {
  gsap.registerPlugin(MotionPathPlugin);

  // Animate both the mask and debug rectangle
  gsap.to(['#maskFollower'], {
    duration: 20.0,
    repeat: -1,
    ease: 'none',
    motionPath: {
      path: '#curve',
      autoRotate: true,
    },
  });
});

</script>

<template>
  <div>
    <h1>lol</h1>
    <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="curve" d="M20,150 C180,-40 420,240 580,50" fill="none" />
        <rect id="myRect" x="0" y="0" width="600" height="200" fill="black" />

        <linearGradient id="fade" x1="0%" y1="50%" x2="100%" y2="50%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stop-color="white" stop-opacity="0" />
          <stop offset="80%" stop-color="white" stop-opacity="1" />
          <stop offset="100%" stop-color="white" stop-opacity="1" />
        </linearGradient>

        <mask id="dashMask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="600"
          height="200" mask-type="alpha">
          <rect id="maskFollower" x="-25" y="-25" width="50" height="50" rx="8" ry="8" fill="url(#fade)" />
        </mask>
      </defs>

      <!-- Rectangle background (unmasked) -->
      <use href="#myRect" stroke="#38bdf8" stroke-width="0" />
      <!-- Curve path with mask applied -->
      <use href="#curve" fill="none" stroke="blue" stroke-width="8" mask="url(#dashMask)" />
    </svg>
  </div>
</template>
