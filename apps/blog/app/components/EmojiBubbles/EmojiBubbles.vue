<script setup lang="ts">
import { onUnmounted } from 'vue'
import EmojiBubble from './EmojiBubble.vue'

const emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊"]
const addedEmojis = ref<{
  id: string;
  emoji: string;
  left: string;
}[]>([])

function removeEmojiById(id: string) {
  const index = addedEmojis.value.findIndex(e => e.id === id);
  if (index !== -1) {
    addedEmojis.value.splice(index, 1);
  }
}

function randomLeft() {
  return Math.random() * 100 + "vw"
}

onMounted(() => {
  const interval = setInterval(() => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)] ?? "😀"
    addedEmojis.value.push({ id: crypto.randomUUID(), emoji, left: randomLeft() })
    if (addedEmojis.value.length > 20) {
      addedEmojis.value.shift()
    }
  }, 5000)
  onUnmounted(() => clearInterval(interval))
});
</script>


<template>
  <div id="EmojiContainer">
    <EmojiBubble v-for="emoji in addedEmojis" :key="emoji.id" :emoji="emoji" @animation-end="removeEmojiById" />
  </div>
</template>

<style>
#EmojiContainer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}
</style>
