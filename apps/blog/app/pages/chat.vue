<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
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

definePageMeta({
  ssr: false // Disable SSR for this page to avoid hydration issues
});

useSeoMeta({ title: "Convex Chat" });

// User management
const { currentUser, getUserColor } = useUser();

const messagesEl = ref<HTMLElement | null>(null);

// Create reactive values that will be populated after mounting
const isPending = ref(true);
const isClientReady = ref(false);

// Function to handle real query results
const realQuery = useConvexQuery(api.chat.getMessages);
const onlineUsersQuery = useConvexQuery(api.chat.getOnlineUsers);
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

function scrollToBottom() {
  const el = messagesEl.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}

watch(messages, async () => {
  await nextTick();
  scrollToBottom();
});

const emojis = ["😂", "😍", "😎", "😭", "🔥"];
</script>

<template>
  <main class="ConvexChat">
    <header class="ConvexChatHeader">
      <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady">
        <p class="caption">Online users: {{ onlineUsers.length }}</p>
        <div class="OnlineUsers">
          <UserChip :message="{ user: 'spacer', userId: 'someid', lastSeen: 1234 }" :color="'#808080'" />
        </div>
      </ChatMessagesLoading>
      <p v-else class="caption">Online users: {{ onlineUsers.length }}</p>
      <div v-if="onlineUsers.length > 0" class="OnlineUsers">
        <UserChip v-for="user in onlineUsers" :key="user.userId"
          :message="{ user: user.displayName, userId: user.userId, lastSeen: user.lastSeen }"
          :color="getUserColor(user.userId) || '#808080'" />
      </div>
    </header>

    <section class="ChatMessagesWrapper">
      <ChatMessagesLoading v-if="isPending" :isClientReady="isClientReady" />
      <div v-else-if="realQuery.error.value" class="MessagesState messagesStateError">
        Error: {{ String(realQuery.error.value) }}
      </div>
      <div v-else ref="messagesEl">
        <ScrollArea>
          <div class="Messages">
            <template v-for="m in messages" :key="m._id">
              <MyMessageBubble v-if="m.userId === currentUser.userId" :body="m.body" />
              <MessageChip v-else
                :message="{ user: m.displayName, body: m.body, userId: m.userId, lastSeen: m.lastSeen }"
                :color="getUserColor(m.userId) || '#808080'" />
            </template>
          </div>
        </ScrollArea>
      </div>
    </section>

    <footer class="ConvexChatFooter">
      <div class="LiveEmoji">
        <div class="Emojis">
          <button v-for="emoji in emojis" :key="emoji" class="button buttonHover buttonActive buttonFocus focus"
            @click="toast.info(emoji)">
            <span style="font-size: 1.5rem;">{{ emoji }}</span>
          </button>
        </div>
      </div>

      <!-- <div class="Info">
        <h4>Welcome to Convex Chat!</h4>
        <p class="caption">Messages are stored in Convex and visible to anyone using this app.</p>
        <p class="caption">Each user gets a unique ID that's stored locally on their device.</p>
      </div> -->
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
  padding: var(--space-2);
}

footer.ConvexChatFooter {
  grid-area: footer;
  display: grid;
  grid-template-columns: 1fr 30em;
  gap: var(--space-2);
}

footer.ConvexChatFooter .LiveEmoji {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-10);
  padding: var(--space-2);
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

.Messages {
  list-style: none;
  margin: 0;
  padding: 0px;
  display: grid;
  gap: var(--space-1);
  overflow-y: auto;
}

.OnlineUsers,
.Emojis {
  display: flex;
  gap: var(--space-1);
}

.LiveEmoji .Emojis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: var(--space-1);
  height: 100%;
}

.LiveEmoji .Emojis button.button {
  height: auto;
  width: auto;
}
</style>
