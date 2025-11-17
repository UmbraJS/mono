<script setup lang="ts">
import { ScrollArea, Input, Button, toast } from 'umbraco'
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
const inputError = ref('')

// Query for chatroom by slug (returns null if doesn't exist)
const chatroomQuery = useConvexQuery(api.chat.getChatroomBySlug, () => ({
  slug: props.slug
}))

const chatroomId = computed(() => chatroomQuery.data.value?._id ?? null)

interface Message {
  _id: string
  userId: string
  displayName: string
  body: string
  timestamp: number
}

// Messages state
const messagesData = ref<Message[]>([])
const messagesError = ref<Error | null>(null)
const messagesPending = ref(false)

// Watch for chatroom changes and conditionally fetch messages
let messagesUnsub: (() => void) | null = null

watch(chatroomId, async (id) => {
  // Clean up previous subscription
  if (messagesUnsub) {
    messagesUnsub()
    messagesUnsub = null
  }

  if (!id) {
    messagesData.value = []
    messagesPending.value = false
    return
  }

  // Manually subscribe to messages when chatroom exists
  const query = useConvexQuery(api.chat.getMessages, () => ({ chatroomId: id }))

  watch([() => query.data.value, () => query.error.value, () => query.isPending.value],
    ([data, error, pending]) => {
      messagesData.value = data || []
      messagesError.value = error
      messagesPending.value = pending
    },
    { immediate: true }
  )
}, { immediate: true })

const { mutate: sendMessageToSlug } = useConvexMutation(api.chat.sendMessageToSlug)

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

  // Clear previous error
  inputError.value = ''

  if (!user.value?.id) {
    inputError.value = 'You must be signed in to send messages'
    toast.error('You must be signed in to send messages')
    return
  }

  if (!body) {
    inputError.value = 'Message cannot be empty'
    toast.error('Message cannot be empty')
    return
  }

  if (body.length > 1000) {
    inputError.value = 'Message must be less than 1000 characters'
    toast.error('Message must be less than 1000 characters')
    return
  }

  isSending.value = true
  try {
    const roomId = await sendMessageToSlug({
      userId: user.value.id,
      slug: props.slug,
      name: props.name,
      description: props.description,
      body,
    })

    messageBody.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
    inputError.value = 'Failed to send message. Please try again.'
    toast.error('Failed to send message. Please try again.')
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

// Clear error when user starts typing
watch(messageBody, () => {
  if (!inputError.value) return
  inputError.value = ''
})

// Scroll to bottom when new messages arrive
watch(() => messagesData.value.length, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="GlobalChatPanel">
    <div v-if="chatroomQuery.isPending.value" class="ChatLoading">
      Loading chatroom...
    </div>

    <!-- No chatroom yet - show empty state with composer -->
    <div v-else-if="!chatroomId" class="ChatEmpty">
      <p>No messages yet. Be the first to start the conversation!</p>
    </div>

    <template v-else>
      <div v-if="messagesPending" class="ChatLoading">
        Loading messages...
      </div>

      <div v-else-if="messagesError" class="ChatError">
        Error: {{ String(messagesError) }}
      </div>

      <ScrollArea v-else ref="scrollArea" class="ChatMessages">
        <div class="MessagesList">
          <template v-for="m in messagesData" :key="m._id">
            <MyMessageBubble v-if="m.userId === currentUserId" :body="m.body" />
            <UserChipMessage v-else :message="{ user: m.displayName, body: m.body, userId: m.userId }"
              :color="getUserColor(m.userId)" />
          </template>
        </div>
      </ScrollArea>
    </template>

    <div v-if="user" class="MessageComposer">
      <Input v-model="messageBody" label="Message" placeholder="Type a message..." :disabled="isSending"
        :error="inputError" @keydown="handleKeydown" />
      <Button size="medium" @click="handleSend">
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
.ChatError,
.ChatEmpty {
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

.ChatEmpty {
  flex-direction: column;
  text-align: center;
  font-size: var(--paragraph);
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
