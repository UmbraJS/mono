<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import EmojiBubble from './EmojiBubble.vue'

interface EmojiEvent {
  _id: string;
  userId: string;
  emoji: string;
  timestamp: number;
}

interface Props {
  emojiEvents?: EmojiEvent[];
}

const props = withDefaults(defineProps<Props>(), {
  emojiEvents: () => []
})

const addedEmojis = ref<{
  id: string;
  emoji: string;
  left: string;
}[]>([])

// Track processed events to avoid duplicates
const processedEvents = ref<Set<string>>(new Set())

function removeEmojiById(id: string) {
  const index = addedEmojis.value.findIndex(e => e.id === id);
  if (index !== -1) {
    addedEmojis.value.splice(index, 1);
  }
}

function randomLeft() {
  return Math.random() * 100 + "vw"
}

function addEmojiFromEvent(emoji: string) {
  addedEmojis.value.push({
    id: crypto.randomUUID(),
    emoji,
    left: randomLeft()
  })
  if (addedEmojis.value.length > 20) {
    addedEmojis.value.shift()
  }
}

// Watch for new emoji events from Convex
watch(() => props.emojiEvents, (newEvents) => {
  if (!newEvents) return;

  newEvents.forEach(event => {
    if (!processedEvents.value.has(event._id)) {
      processedEvents.value.add(event._id)
      addEmojiFromEvent(event.emoji)
    }
  })

  // Clean up old processed events to prevent memory leaks
  if (processedEvents.value.size > 100) {
    const eventsArray = Array.from(processedEvents.value)
    const toKeep = eventsArray.slice(-50) // Keep last 50
    processedEvents.value = new Set(toKeep)
  }
}, { deep: true })

// onMounted(() => {
//   const interval = setInterval(() => {
//     const emoji = emojis[Math.floor(Math.random() * emojis.length)] ?? "😀"
//     addEmojiFromEvent(emoji)
//   }, 5000)
//   onUnmounted(() => clearInterval(interval))
// });
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
