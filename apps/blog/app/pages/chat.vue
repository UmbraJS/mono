<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { toast, ScrollArea } from "umbraco";
import MessageChip from "../components/Chat/MessageChip.vue";
import UserChip from "../components/Chat/UserChip.vue";
import MyMessageBubble from "../components/Chat/MyMessageBubble.vue";
import { useUser } from "../composables/useUser";
import ChatMessagesLoading from "../components/Chat/ChatMessagesLoading.vue";
import MessageComposer from "../components/Chat/MessageComposer.vue";
import type { ChatMessage } from "../components/Chat/chat.types"
import EmojiBubbles from "../components/EmojiBubbles/EmojiBubbles.vue";

definePageMeta({
  ssr: false // Disable SSR for this page to avoid hydration issues
});

useSeoMeta({ title: "Convex Chat" });

// User management
const { currentUser, getUserColor } = useUser();

// Create reactive values that will be populated after mounting
const isPending = ref(true);
const isClientReady = ref(false);

// Emoji combo counter state
const comboCount = ref<{
  timestamp: number;
}[]>([]);

const cooldownRemaining = ref(0);
const isOnCooldown = ref(false);
const COMBO_LIMIT = 30;
const COOLDOWN_DURATION = 30; // 30 seconds

// Function to handle real query results
const realQuery = useConvexQuery(api.chat.getMessages);
const onlineUsersQuery = useConvexQuery(api.chat.getOnlineUsers);
const emojiEventsQuery = useConvexQuery(api.chat.getRecentEmojiEvents);
const { mutate: sendMessage, isPending: isSending } = useConvexMutation(api.chat.sendMessage);
const { mutate: sendEmoji } = useConvexMutation(api.chat.sendEmoji);

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

async function onSubmit({ message, displayName, form }: ChatMessage) {
  try {
    await sendMessage({
      userId: currentUser.value.userId,
      body: message,
      displayName: displayName
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

function getAllEmojisSentInTheLast30Seconds() {
  const now = Date.now();
  return emojiEvents.value.filter(event => now - event.timestamp <= COOLDOWN_DURATION * 1000);
}

async function onEmojiClick(emoji: string) {
  // Check if we're on cooldown
  if (isOnCooldown.value) {
    toast.error(`Please wait ${cooldownRemaining.value}s before sending more emojis!`);
    return;
  }

  const recentEmojis = getAllEmojisSentInTheLast30Seconds();

  // Check if we've reached the combo limit
  if (recentEmojis.length >= COMBO_LIMIT) {
    startCooldown();
    toast.error(`Combo limit reached! Wait ${COOLDOWN_DURATION}s before sending more emojis.`);
    return;
  }

  try {
    await sendEmoji({
      userId: currentUser.value.userId,
      emoji: emoji,
    });

    // Increment combo counter
    comboCount.value.push({ timestamp: Date.now() });
    toast.success(`${emoji} sent! Combo: ${comboCount.value.length}/${COMBO_LIMIT}`);

    const countdownMs = COOLDOWN_DURATION * 1000;

    setTimeout(() => {
      comboCount.value.shift();
    }, countdownMs);

    // Start cooldown if we hit the limit
    if (comboCount.value.length >= COMBO_LIMIT) {
      startCooldown();
    }
  } catch (error) {
    console.error("Failed to send emoji:", error);

    // Handle rate limit error from backend
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      toast.error("Rate limit exceeded! Please wait before sending more emojis.");
      startCooldown();
    } else {
      toast.error("Failed to send emoji. Please try again.");
    }
  }
}

const emojis = ["😂", "😍", "😎", "😭", "🔥"];

const scrollArea = useTemplateRef('scrollArea')
function scrollToBottom() {
  scrollArea.value?.scrollToBottom()
}

function isThisYou(userId: string) {
  return userId === currentUser.value.userId
}

// Cooldown timer functionality
let cooldownInterval: NodeJS.Timeout | null = null;

function startCooldown() {
  isOnCooldown.value = true;
  cooldownRemaining.value = COOLDOWN_DURATION;

  // Clear any existing interval
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }

  cooldownInterval = setInterval(() => {
    cooldownRemaining.value--;
    if (cooldownRemaining.value <= 0) {
      resetCombo();
    }
  }, 1000);
}

function resetCombo() {
  comboCount.value = [];
  isOnCooldown.value = false;
  cooldownRemaining.value = 0;

  if (cooldownInterval) {
    clearInterval(cooldownInterval);
    cooldownInterval = null;
  }
}

// Computed properties for UI
const isEmojiDisabled = computed(() => isOnCooldown.value || comboCount.value.length >= COMBO_LIMIT);
const comboStatus = computed(() => {
  if (isOnCooldown.value) {
    return `Cooldown: ${cooldownRemaining.value}s`;
  }
  return `Combo: ${comboCount.value.length ?? 0}/${COMBO_LIMIT}x`;
});

// Cleanup on component unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>

<template>
  <main class="ConvexChat">
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
            <MessageChip v-else :message="{ user: m.displayName, body: m.body, userId: m.userId, lastSeen: m.lastSeen }"
              :color="getUserColor(m.userId) || '#808080'" />
          </template>
        </div>
      </ScrollArea>
    </section>

    <footer class="ConvexChatFooter">
      <div class="LiveEmojiWrapper">
        <div class="LiveEmojiMeta">
          <div class="LiveEmojiCombo" :class="{ 'combo-cooldown': isOnCooldown }">
            <div class="LiveEmojiLabel"><span>{{ comboStatus }}</span></div>
            <div class="ComboStatusBar" :style="{ width: `${(comboCount.length / COMBO_LIMIT) * 100}%` }"></div>
          </div>
        </div>
        <div class="LiveEmojis">
          <button v-for="emoji in emojis" :key="emoji" class="button buttonHover buttonActive buttonFocus focus"
            :class="{ 'button-disabled': isEmojiDisabled }" :disabled="isEmojiDisabled" @click="onEmojiClick(emoji)">
            <span style="font-size: 2rem;">{{ emoji }}</span>
          </button>
        </div>
      </div>

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

.LiveEmojiWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.LiveEmojis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: var(--space-1);
  height: 100%;
}

.LiveEmojis button.button {
  height: auto;
  width: auto;
}

.LiveEmojis button.button span {
  transition: transform var(--slow);
}

.LiveEmojis button.button:active span {
  transform: scale(0.3);
  transition: transform var(--time);
}

.LiveEmojiMeta {
  grid-column: 1 / -1;

  background-color: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-1);
}

.LiveEmojiCombo {
  position: relative;
  display: flex;
  gap: var(--space-1);
  background: var(--base);
  padding: var(--space-1);
  border-radius: var(--radius);
  transition: background-color var(--time);
}

.LiveEmojiCombo.combo-cooldown {
  background: var(--warning-10);
  color: var(--warning-120);
}

.LiveEmojis button.button.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.LiveEmojis button.button.button-disabled span {
  transform: scale(0.8);
}

.LiveEmojiLabel {
  z-index: 1;
  position: relative;
}

.ComboStatusBar {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: var(--warning-30);
  border-radius: var(--radius);
  transition: var(--time);
}
</style>
