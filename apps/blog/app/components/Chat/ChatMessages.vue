<script setup lang="ts">
import { ScrollArea } from 'umbraco'
import ChatMessagesLoading from './ChatMessagesLoading.vue'
import MyMessageBubble from './MyMessageBubble.vue'
import UserChipMessage from '../UserChip/variants/UserChipMessage.vue'

interface Message {
  _id: string
  userId: string
  displayName: string
  body: string
}

const props = defineProps<{
  isPending: boolean
  isClientReady: boolean
  error: Error | null
  messages: Message[]
  currentUserId: string
  getUserColor: (userId: string) => string
}>()

defineExpose({
  scrollToBottom: () => {
    // Exposed method will be handled by parent ref
  }
})
</script>

<template>
  <section class="ChatMessages border">
    <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady" />

    <div v-else-if="error" class="MessagesState messagesStateError">
      Error: {{ String(error) }}
    </div>

    <ScrollArea v-else ref="scrollArea">
      <div class="MessagesList">
        <template v-for="m in messages" :key="m._id">
          <MyMessageBubble v-if="m.userId === currentUserId" :body="m.body" />
          <UserChipMessage v-else :message="{ user: m.displayName, body: m.body, userId: m.userId }"
            :color="getUserColor(m.userId)" />
        </template>
      </div>
    </ScrollArea>
  </section>
</template>

<style scoped>
.ChatMessages {
  grid-area: messages;
  overflow-y: auto;
  background: var(--base-10);
  border-radius: var(--radius);
}

.MessagesState {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  color: var(--base-80);
  padding: var(--space-2) 0;
}

.messagesStateError {
  color: var(--warning-100);
}

.MessagesList {
  list-style: none;
  margin: 0;
  padding: var(--space-2);
  padding-left: var(--space-1);
  display: grid;
  gap: var(--space-1);
  overflow-y: auto;
}
</style>
