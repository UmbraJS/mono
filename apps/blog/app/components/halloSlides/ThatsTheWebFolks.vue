<script setup lang="ts">
import MockPage from './MockPage/MockPage.vue';
import { ref, useTemplateRef, onMounted } from 'vue';
import { gsap } from 'gsap';

const hovered = ref(false);
const typographyQuote = useTemplateRef<HTMLElement>('typographyQuote');

let enterTween: gsap.core.Tween | null = null;
let exitTween: gsap.core.Tween | null = null;

onMounted(() => {
  if (!typographyQuote.value) return;

  // Set initial state
  gsap.set(typographyQuote.value, {
    y: 15,
    opacity: 0
  });
});

const handleMouseEnter = () => {
  if (!typographyQuote.value) return;

  // Kill any existing exit tween
  if (exitTween) exitTween.kill();

  enterTween = gsap.to(typographyQuote.value, {
    y: 0,
    opacity: 1,
    duration: 0.4,
    ease: "power2.out"
  });

  hovered.value = true;
};

const handleMouseLeave = () => {
  if (!typographyQuote.value) return;

  // Kill any existing enter tween
  if (enterTween) enterTween.kill();

  exitTween = gsap.to(typographyQuote.value, {
    y: 15,
    opacity: 0,
    duration: 0.4,
    ease: "power2.out"
  });

  hovered.value = false;
};
</script>

<template>
  <div class="TheWeb" :class="{ hovered }">
    <p ref="typographyQuote" class="typographyQuote"><span>Typography is just a bunch of shapes in a line</span></p>
    <MockPage @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" />
    <p class="display">And onto this we attempt to build systems</p>
  </div>
</template>

<style scoped>
.TheWeb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  max-width: 660px;
}
</style>
