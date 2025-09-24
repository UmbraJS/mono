<template>
  <span ref="emojiRef" class="emoji" :style="{ left: emoji.left }">
    {{ emoji.emoji }}
  </span>
</template>


<script setup lang="ts">
import { gsap } from 'gsap'
import { useTemplateRef } from 'vue'

const emojiRef = useTemplateRef("emojiRef");

const props = defineProps<{
  emoji: {
    id: string;
    emoji: string;
    left: string;
  }
}>()

const emit = defineEmits<{
  (e: 'animationEnd', id: string): void;
}>();

onMounted(() => {
  const el = emojiRef.value;
  if (!el) return;
  gsap.to(el, {
    y: -1000,
    opacity: 0,
    scale: 0.5,
    duration: 4,
    ease: "power1.out",
    onComplete: () => {
      // Remove the emoji from the DOM after animation
      emit('animationEnd', props.emoji.id);
    }
  });
});
</script>


<style>
.emoji {
  position: absolute;
  bottom: 87px;
  animation-name: floatUp;
  animation-timing-function: ease-out;
  font-size: 3em;
}
</style>
