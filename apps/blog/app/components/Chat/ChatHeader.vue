<script setup lang="ts">
import ChatMessagesLoading from './ChatMessagesLoading.vue'
import RecentUserChip from '../UserChip/variants/RecentUserChip.vue'
import EmojiBubbles from '../EmojiBubbles/EmojiBubbles.vue'

interface OnlineUser {
  userId: string
  displayName: string
  lastSeen: number
}

interface EmojiEvent {
  _id: string
  userId: string
  emoji: string
  timestamp: number
}

defineProps<{
  isPending: boolean
  isClientReady: boolean
  onlineUsers: OnlineUser[]
  emojiEvents: EmojiEvent[]
  getUserColor: (userId: string) => string
  isThisYou: (userId: string) => boolean
}>()
</script>

<template>
  <header class="ChatHeader border">
    <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady">
      <p class="caption">Recent Online users: {{ onlineUsers.length }}</p>
    </ChatMessagesLoading>
    <p v-else class="caption">Recent Online users: {{ onlineUsers.length }}</p>

    <div v-if="onlineUsers.length > 0" class="OnlineUsers">
      <RecentUserChip v-for="user in onlineUsers" :key="user.userId"
        :message="{ user: user.displayName, userId: user.userId, lastSeen: user.lastSeen }"
        :color="getUserColor(user.userId)" :isYou="isThisYou(user.userId)" />
    </div>

    <EmojiBubbles :emojiEvents="emojiEvents" />
  </header>
</template>

<style scoped>
.ChatHeader {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  grid-area: header;
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.OnlineUsers {
  display: flex;
  gap: var(--space-1);
}
</style>
