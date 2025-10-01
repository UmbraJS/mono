<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';

const exampleRefs = ref<HTMLElement[]>([]);

onMounted(() => {
  gsap.fromTo(
    exampleRefs.value,
    {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 0
    },
    {
      scale: 1,
      x: (index) => index * 50,
      y: (index) => index * 50,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1
    }
  );
});
</script>

<template>
  <div class="SamSlide RoundedTokens">
    <p class="display">
      <span>--radius-1:</span> 00px;<br />
      <span>--radius-2:</span> 10px;<br />
      <span>--radius-3:</span> 30px;
    </p>

    <div class="RoundedExamples">
      <div v-for="(item) in 3" :key="item" :ref="(el) => exampleRefs[item] = el as HTMLElement"
        class="Example border" />
    </div>
  </div>
</template>

<style>
.RoundedTokens {
  --radius-1: 0px;
  --radius-2: 10px;
  --radius-3: 30px;

  display: flex;
  gap: var(--space-5);
}

.RoundedExamples {
  transform: translate(0, -50px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 30em;
}

.Example {
  position: absolute;
  height: 100px;
  width: 100%;
  background: var(--base-20);
  box-shadow: -20px -20px 50px 18px var(--base);
}

.Example:nth-child(1) {
  border-top-left-radius: var(--radius-1);
}

.Example:nth-child(2) {
  border-top-left-radius: var(--radius-2);
}

.Example:nth-child(3) {
  border-top-left-radius: var(--radius-3);
}
</style>
