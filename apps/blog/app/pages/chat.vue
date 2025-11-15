<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { toast, ScrollArea } from "umbraco";
import MessageChip from "../components/Chat/MessageChip.vue";
import UserChip from "../components/Chat/UserChip.vue";
import MyMessageBubble from "../components/Chat/MyMessageBubble.vue";
import ChatMessagesLoading from "../components/Chat/ChatMessagesLoading.vue";
import MessageComposer from "../components/Chat/MessageComposer.vue";
import type { ChatMessage } from "../components/Chat/chat.types"
import EmojiBubbles from "../components/EmojiBubbles/EmojiBubbles.vue";
import LiveEmojiPanel from "../components/Chat/LiveEmojiPanel.vue";

useSeoMeta({ title: "Convex Chat" });

// Auth management
const { session, isAuthenticated, isLoading } = useAuth()
const router = useRouter()

// Redirect to signin if not authenticated
watch([isAuthenticated, isLoading], ([auth, loading]) => {
  if (loading || auth) return
  router.push('/signin')
}, { immediate: true })

// Get user info from session
const currentUser = computed(() => ({
  userId: session.value?.user?.id || '',
  displayName: session.value?.user?.name || 'Anonymous',
}))

// Generate deterministic color from user ID
const getUserColor = (userId: string) => {
  const colors = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
    "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return colors[Math.abs(hash) % colors.length];
};

// Create reactive values that will be populated after mounting
const isPending = ref(true);
const isClientReady = ref(false);

// Function to handle real query results
const realQuery = useConvexQuery(api.chat.getMessages);
const onlineUsersQuery = useConvexQuery(api.chat.getOnlineUsers);
const emojiEventsQuery = useConvexQuery(api.chat.getRecentEmojiEvents);
const { mutate: sendMessage, isPending: isSending } = useConvexMutation(api.chat.sendMessage);

// Initialize display name from backend or default
onMounted(async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  isClientReady.value = true;

  // Set up pending watcher
  watch(() => realQuery?.isPending?.value, (newPending) => {
    isPending.value = newPending;
  }, { immediate: true });
});

const messages = computed(() => realQuery.data.value || []);
const onlineUsers = computed(() => onlineUsersQuery.data.value || []);
const emojiEvents = computed(() => emojiEventsQuery.data.value || []);

async function onSubmit({ message, form }: ChatMessage) {
  try {
    await sendMessage({
      userId: currentUser.value.userId,
      body: message,
    });

    form.setForm({ message: "" });
    toast.success("Message sent!");

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Failed to send message:", error);
    toast.error("Failed to send message. Please try again.");
  }
}

const scrollArea = useTemplateRef('scrollArea')
function scrollToBottom() {
  scrollArea.value?.scrollToBottom()
}

function isThisYou(userId: string) {
  return userId === currentUser.value.userId
}


</script>

<template>
  <main v-if="isAuthenticated && session" class="ConvexChat">
    <header class="ConvexChatHeader border">
      <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady">
        <p class="caption">Recent Online users: {{ onlineUsers.length }}</p>
        <div class="OnlineUsers">
          <UserChip :message="{ user: 'spacer', userId: 'someid', lastSeen: 1234 }" :color="'#808080'" :isYou="true" />
        </div>
      </ChatMessagesLoading>
      <p v-else class="caption">Recent Online users: {{ onlineUsers.length }}</p>
      <div v-if="onlineUsers.length > 0" class="OnlineUsers">
        <UserChip v-for="user in onlineUsers" :key="user.userId"
          :message="{ user: user.displayName, userId: user.userId, lastSeen: user.lastSeen }"
          :color="getUserColor(user.userId) || '#808080'" :isYou="isThisYou(user.userId)" />
      </div>
      <EmojiBubbles :emojiEvents="emojiEvents" />
    </header>

    <section class="ChatMessagesWrapper border">
      <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady" />
      <div v-else-if="realQuery.error.value" class="MessagesState messagesStateError">
        Error: {{ String(realQuery.error.value) }}
      </div>
      <ScrollArea v-else ref="scrollArea">
        <div class="Messages">
          <template v-for="m in messages" :key="m._id">
            <MyMessageBubble v-if="m.userId === currentUser.userId" :body="m.body" />
            <MessageChip v-else :message="{ user: m.displayName, body: m.body, userId: m.userId }"
              :color="getUserColor(m.userId) || '#808080'" />
          </template>
        </div>
      </ScrollArea>
    </section>

    <footer class="ConvexChatFooter">
      <LiveEmojiPanel :disabled="isPending || !isClientReady" />

      <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady">
        <MessageComposer :isDisabled="true" :onSend="onSubmit" />
      </ChatMessagesLoading>
      <MessageComposer v-else :isDisabled="isSending || !isClientReady" :onSend="onSubmit" />
    </footer>
  </main>
</template>

<style>
.ChatMessagesLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

.ConvexChat {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "messages"
    "footer";
  height: 100vh;
  gap: var(--space-2);
  padding: var(--space-2);
  padding-bottom: 100px;
  width: 100%;
}

header.ConvexChatHeader {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  grid-area: header;
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.ChatMessagesWrapper {
  grid-area: messages;
  overflow-y: auto;
  background: var(--base-10);
  border-radius: var(--radius);
}

footer.ConvexChatFooter {
  grid-area: footer;
  display: grid;
  grid-template-columns: 1fr 30em;
  gap: var(--space-1);
}

@media (max-width: 768px) {
  footer.ConvexChatFooter {
    grid-template-columns: 1fr;
  }
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

.Messages {
  list-style: none;
  margin: 0;
  padding: var(--space-2);
  padding-left: var(--space-1);
  display: grid;
  gap: var(--space-1);
  overflow-y: auto;
}

.OnlineUsers,
.Emojis {
  display: flex;
  gap: var(--space-1);
}
</style>
