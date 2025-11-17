<script setup lang="ts">
import { ScrollArea, Input, Button } from 'umbraco'
import { useConvexQuery, useConvexMutation } from 'convue'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import MyMessageBubble from './Chat/MyMessageBubble.vue'
import UserChipMessage from './UserChip/variants/UserChipMessage.vue'

const props = withDefaults(defineProps<{
  slug?: string
  name?: string
  description?: string
}>(), {
  slug: 'global',
  name: 'Global Chat',
  description: 'General discussion for everyone'
})

const { user } = useAuth()
const scrollArea = ref<InstanceType<typeof ScrollArea> | null>(null)
const messageBody = ref('')
const isSending = ref(false)
const chatroomId = ref<Id<"chatrooms"> | null>(null)

// Get or create the chatroom for this slug
const { mutate: getOrCreateChatroom } = useConvexMutation(api.chat.getOrCreateChatroomBySlug)

// Fetch the chatroom ID
const initializeChatroom = async () => {
  if (!user.value?.id) return

  try {
    const id = await getOrCreateChatroom({
      slug: props.slug,
      name: props.name,
      description: props.description,
      createdBy: user.value.id,
    })
    chatroomId.value = id
  } catch (error) {
    console.error('Failed to initialize chatroom:', error)
  }
}

// Initialize when user is available
watch(() => user.value?.id, (userId) => {
  if (userId && !chatroomId.value) {
    initializeChatroom()
  }
}, { immediate: true })

// Fetch messages for the chatroom
const messagesQuery = useConvexQuery(api.chat.getMessages, () => ({
  chatroomId: chatroomId.value!
}))

const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage)

const currentUserId = computed(() => user.value?.id ?? '')

// Simple color assignment based on user ID hash
const getUserColor = (userId: string) => {
  const colors = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
    "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000075", "#ff0000"
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return colors[Math.abs(hash) % colors.length];
};

const scrollToBottom = () => {
  const area = scrollArea.value
  if (!area) return

  nextTick(() => {
    const el = area.$el as HTMLElement
    const scrollContainer = el?.querySelector('[data-radix-scroll-area-viewport]')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  })
}

const handleSend = async () => {
  const body = messageBody.value.trim()
  if (!body || !user.value?.id || !chatroomId.value) return

  isSending.value = true
  try {
    await sendMessage({
      userId: user.value.id,
      chatroomId: chatroomId.value,
      body,
    })
    messageBody.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    isSending.value = false
  }
}

const handleKeydown = (e: Event) => {
  const keyEvent = e as KeyboardEvent
  if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
    keyEvent.preventDefault()
    handleSend()
  }
}

// Scroll to bottom when new messages arrive
watch(() => messagesQuery.data.value?.length, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="GlobalChatPanel">
    <div v-if="!chatroomId" class="ChatLoading">
      Initializing chatroom...
    </div>

    <div v-else-if="messagesQuery.isPending.value" class="ChatLoading">
      Loading messages...
    </div>

    <div v-else-if="messagesQuery.error.value" class="ChatError">
      Error: {{ String(messagesQuery.error.value) }}
    </div>

    <ScrollArea v-else ref="scrollArea" class="ChatMessages">
      <div class="MessagesList">
        <template v-for="m in messagesQuery.data.value" :key="m._id">
          <MyMessageBubble v-if="m.userId === currentUserId" :body="m.body" />
          <UserChipMessage v-else :message="{ user: m.displayName, body: m.body, userId: m.userId }"
            :color="getUserColor(m.userId)" />
        </template>
      </div>
    </ScrollArea>

    <div class="MessageComposer">
      <Input v-model="messageBody" label="Message" placeholder="Type a message..."
        :disabled="isSending || !user || !chatroomId" @keydown="handleKeydown" />
      <Button size="medium" :disabled="!messageBody.trim() || isSending || !user || !chatroomId" @click="handleSend">
        <Icon name="carbon:send" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.GlobalChatPanel {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  height: 100%;
  min-height: 300px;
}

.ChatTitle {
  font-size: var(--h5-size);
  font-weight: var(--h5-weight);
  margin: 0;
  padding: var(--space-1);
  color: var(--base-text);
}

.ChatLoading,
.ChatError {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: var(--base-80);
  padding: var(--space-2);
}

.ChatError {
  color: var(--warning-100);
}

.ChatMessages {
  flex: 1;
  background: var(--base-10);
  border-radius: var(--radius);
  border: var(--border);
  overflow: hidden;
}

.MessagesList {
  display: grid;
  gap: var(--space-1);
}

.MessageComposer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-quark);
  align-items: end;
}
</style>
