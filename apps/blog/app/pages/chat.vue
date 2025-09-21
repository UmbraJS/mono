<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { Input, Button, TextArea } from "umbraco";
import OtherMessageBubble from "../components/OtherMessageBubble.vue";
import MyMessageBubble from "../components/MyMessageBubble.vue";
import { useUser } from "../composables/useUser";
import { usePresence } from "../composables/usePresence";
import { getShortIdSync } from "../utils";

definePageMeta({
  ssr: false // Disable SSR for this page to avoid hydration issues
});

useSeoMeta({ title: "Convex Chat" });

// User management
const { userId, displayName, currentUser, getUserColor } = useUser();

const text = ref("");
const isSending = ref(false);
const messagesEl = ref<HTMLElement | null>(null);

// Create reactive values that will be populated after mounting
const isPending = ref(true);
const isClientReady = ref(false);

// Function to handle real query results
const realQuery = useConvexQuery(api.chat.getMessages);
const onlineUsersQuery = useConvexQuery(api.chat.getOnlineUsers);
const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage);

// Presence tracking - initialize after user data is available
let presenceSystem: ReturnType<typeof usePresence> | null = null;

onMounted(async () => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    isClientReady.value = true;

    // Initialize presence system once we have user data
    presenceSystem = usePresence(userId.value, displayName.value);

    watch(() => realQuery?.isPending?.value, (newPending) => {
      isPending.value = newPending;
    }, { immediate: true });

    // Watch for display name changes to update presence
    watch(displayName, (newName) => {
      if (presenceSystem && newName) {
        presenceSystem.updateUserPresence();
      }
    });
  }
});

const messages = computed(() => realQuery.data.value || []);
const onlineUsers = computed(() => onlineUsersQuery.data.value || []);

async function onSubmit() {
  const body = text.value.trim();
  if (!body || isSending.value || !isClientReady.value) return;
  isSending.value = true;
  try {
    await sendMessage({
      userId: userId.value,
      body
    });
    text.value = "";
    await nextTick();
    scrollToBottom();
  } finally {
    isSending.value = false;
  }
}

function onTextareaKeydown(e: KeyboardEvent) {
  // Enter to send, Shift+Enter for newline
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSubmit();
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
</script>

<template>
  <main class="ConvexChat">
    <header>
      <h2>Convex Chat</h2>
      <p>Welcome to the chat! Feel free to share your thoughts.</p>
      <p v-if="!isClientReady" style="color: orange;">⏳ Initializing client-side connection...</p>
      <div v-if="isClientReady" class="user-info">
        <p><strong>Your ID:</strong> <code>{{ getShortIdSync(userId, 8) }}</code></p>
        <p><strong>Online users:</strong> {{ onlineUsers.length }}</p>
      </div>
    </header>

    <aside v-if="onlineUsers.length > 0" class="online-users">
      <h3>Online Now ({{ onlineUsers.length }})</h3>
      <ul class="user-list">
        <li v-for="user in onlineUsers" :key="user.userId" class="user-item">
          <div class="user-indicator" :style="{ backgroundColor: getUserColor(user.userId) }"></div>
          <span>{{ user.displayName }}</span>
          <span v-if="user.userId === userId" class="you-indicator">(you)</span>
        </li>
      </ul>
    </aside>

    <section class="ChatMessages">
      <div v-if="isPending" class="state">
        <Icon name="eos-icons:loading" class="icon icon--spin" />
      </div>
      <div v-else-if="realQuery.error.value" class="state state--error">
        Error: {{ String(realQuery.error.value) }}
      </div>
      <div v-else ref="messagesEl" class="messages">
        <template v-for="m in messages" :key="m._id">
          <MyMessageBubble v-if="m.userId === userId" :message="{ _id: m._id, user: m.displayName, body: m.body }" />
          <OtherMessageBubble v-else :message="{ _id: m._id, user: m.displayName, body: m.body }"
            :color="getUserColor(m.userId) || '#808080'" />
        </template>
      </div>
    </section>

    <footer>
      <div class="Info">
        <h4>Welcome to Convex Chat!</h4>
        <p class="caption">Messages are stored in Convex and visible to anyone using this app.</p>
        <p class="caption">Each user gets a unique ID that's stored locally on their device.</p>
      </div>
      <form class="composer" @submit.prevent="onSubmit">
        <Input :model-value="displayName" label="Your name" size="small" />
        <TextArea v-model="text" placeholder="Type a message" @keydown="onTextareaKeydown" />
        <Button type="submit" color="base" :disabled="!text.trim() || isSending || !isClientReady">
          <Icon name="carbon:send" class="icon" />
          <p>Send</p>
        </Button>
      </form>
    </footer>
  </main>
</template>

<style scoped>
.ConvexChat {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header sidebar"
    "messages sidebar"
    "footer sidebar";
  gap: var(--space-2);
  padding: var(--space-2);
  padding-bottom: 100px;
  width: 100%;
}

header {
  grid-area: header;
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.user-info {
  margin-top: var(--space-1);
  font-size: 0.875rem;
  opacity: 0.8;
}

.user-info code {
  background: var(--base-20);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.online-users {
  grid-area: sidebar;
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
  min-width: 200px;
  max-width: 250px;
}

.online-users h3 {
  margin: 0 0 var(--space-1) 0;
  font-size: 1rem;
  color: var(--base-100);
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: var(--space-half);
  padding: var(--space-half);
  border-radius: var(--radius-sm);
  margin-bottom: 2px;
}

.user-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.you-indicator {
  font-size: 0.75rem;
  color: var(--base-60);
  font-style: italic;
}

.ChatMessages {
  grid-area: messages;
  overflow-y: auto;
  background: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-2);
}

footer {
  grid-area: footer;
  display: grid;
  grid-template-columns: 1fr 30em;
  gap: var(--space-2);
}

footer .Info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.state {
  text-align: center;
  color: var(--base-80);
  padding: var(--space-2) 0;
}

.state--error {
  color: var(--warning-100);
}

.messages {
  list-style: none;
  margin: 0;
  padding: 0px;
  display: grid;
  gap: var(--space-1);
  overflow-y: auto;
}

.composer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

/* Responsive layout */
@media (max-width: 1024px) {
  .ConvexChat {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "sidebar"
      "messages"
      "footer";
  }

  footer {
    grid-template-columns: 1fr;
  }

  .online-users {
    max-width: none;
  }
}
</style>
