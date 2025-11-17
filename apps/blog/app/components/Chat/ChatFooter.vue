<script setup lang="ts">
import ChatMessagesLoading from './ChatMessagesLoading.vue'
import MessageComposer from './MessageComposer.vue'
import LiveEmojiPanel from './LiveEmojiPanel.vue'
import type { ChatMessage } from './chat.types'
import type { Id } from '../../../convex/_generated/dataModel'

defineProps<{
  isPending: boolean
  isClientReady: boolean
  isSending: boolean
  chatroomId: Id<"chatrooms">
  onSend: (data: ChatMessage) => Promise<void>
}>()
</script>

<template>
  <footer class="ChatFooter">
    <LiveEmojiPanel :disabled="isPending || !isClientReady" :chatroomId="chatroomId" />

    <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady">
      <MessageComposer :isDisabled="true" :onSend="onSend" />
    </ChatMessagesLoading>
    <MessageComposer v-else :isDisabled="isSending || !isClientReady" :onSend="onSend" />
  </footer>
</template>

<style scoped>
.ChatFooter {
  grid-area: footer;
  display: grid;
  grid-template-columns: 1fr 30em;
  gap: var(--space-1);
}

@media (max-width: 768px) {
  .ChatFooter {
    grid-template-columns: 1fr;
  }
}
</style>
