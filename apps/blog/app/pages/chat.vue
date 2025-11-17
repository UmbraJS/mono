<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { toast } from "umbraco";
import ChatHeader from "../components/Chat/ChatHeader.vue";
import ChatMessages from "../components/Chat/ChatMessages.vue";
import ChatFooter from "../components/Chat/ChatFooter.vue";
import type { ChatMessage } from "../components/Chat/chat.types"

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

const chatMessages = useTemplateRef('chatMessages')
function scrollToBottom() {
  chatMessages.value?.scrollToBottom()
}

function isThisYou(userId: string) {
  return userId === currentUser.value.userId
}
</script>

<template>
  <main v-if="isAuthenticated && session" class="ChatPage">
    <ChatHeader :isPending="isPending" :isClientReady="isClientReady" :onlineUsers="onlineUsers"
      :emojiEvents="emojiEvents" :getUserColor="getUserColor" :isThisYou="isThisYou" />

    <ChatMessages ref="chatMessages" :isPending="isPending" :isClientReady="isClientReady"
      :error="realQuery.error.value" :messages="messages" :currentUserId="currentUser.userId"
      :getUserColor="getUserColor" />

    <ChatFooter :isPending="isPending" :isClientReady="isClientReady" :isSending="isSending" :onSend="onSubmit" />
  </main>
</template>

<style scoped>
.ChatMessagesLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

.ChatPage {
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
</style>
