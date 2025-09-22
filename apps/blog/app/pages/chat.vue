<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { Input, Button, TextArea, toast, ScrollArea } from "umbraco";
import { z } from "zod";
import MessageChip from "../components/MessageChip.vue";
import UserChip from "../components/UserChip.vue";
import MyMessageBubble from "../components/MyMessageBubble.vue";
import { useUser } from "../composables/useUser";
import { usePresence } from "../composables/usePresence";
import { useFormula } from "../composables/useForm";

definePageMeta({
  ssr: false // Disable SSR for this page to avoid hydration issues
});

useSeoMeta({ title: "Convex Chat" });

// User management
const { currentUser, getUserColor, setDisplayName } = useUser();

// Initialize validated form with empty display name initially
const form = useFormula({
  message: "",
  displayName: ""
}, {
  validationMode: "onSubmit", // Only validate when submitting
  schema: z.object({
    message: z.string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(1000, "Message must be less than 1000 characters"),
    displayName: z.string()
      .trim()
      .min(1, "Display name is required")
      .max(50, "Display name must be less than 50 characters")
  }),
});

const isSending = ref(false);
const messagesEl = ref<HTMLElement | null>(null);

// Create reactive values that will be populated after mounting
const isPending = ref(true);
const isClientReady = ref(false);

// Function to handle real query results
const realQuery = useConvexQuery(api.chat.getMessages);
const onlineUsersQuery = useConvexQuery(api.chat.getOnlineUsers);
const userQuery = useConvexQuery(api.chat.getUser, () => ({ userId: currentUser.value.userId }));
const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage);

// Watch for form display name changes to update the user composable
watch(() => form.data.value.displayName, (newDisplayName) => {
  if (!newDisplayName) return
  setDisplayName(newDisplayName);
});

// Initialize display name from backend or default
onMounted(async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  isClientReady.value = true;

  // Set up pending watcher
  watch(() => realQuery?.isPending?.value, (newPending) => {
    isPending.value = newPending;
  }, { immediate: true });
});

// Load user's display name from backend when available
watch(() => userQuery.data.value, (userData) => {
  if (userData?.displayName && userData?.displayName !== "Anonymous") {
    // Only set initial value if form is empty
    setDisplayName(userData.displayName);
    form.setForm({ displayName: userData.displayName });
  } else if (currentUser.value.displayName === "Anonymous") {
    // Set default if no backend data and form is empty
    setDisplayName("Anonymous");
    form.setForm({ displayName: "Anonymous" });
  }
}, { immediate: true });

usePresence(currentUser);

const messages = computed(() => realQuery.data.value || []);
const onlineUsers = computed(() => onlineUsersQuery.data.value || []);

async function onSubmit() {
  if (isSending.value || !isClientReady.value) return;

  // Validate the form
  const validation = form.validate();

  if (!validation.success) {
    // Show validation errors as toast notifications
    const errors = Object.entries(validation.fieldErrors);
    if (errors.length > 0) {
      // Show the first error as a toast
      const firstError = errors[0];
      if (firstError) {
        const [field, messages] = firstError;
        toast.error(`${field}: ${messages[0]}`);
      }
    } else if (validation.formErrors.length > 0 && validation.formErrors[0]) {
      toast.error(validation.formErrors[0]);
    }
    return;
  }

  if (!validation.data) return;

  const { message } = validation.data;
  isSending.value = true;

  try {
    await sendMessage({
      userId: currentUser.value.userId,
      body: message,
      displayName: validation.data.displayName
    });

    // Clear the message on successful send
    form.setForm({ message: "" });

    // Show success feedback
    toast.success("Message sent!");

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Failed to send message:", error);
    toast.error("Failed to send message. Please try again.");
  } finally {
    isSending.value = false;
  }
}

function onTextareaKeydown(e: KeyboardEvent) {
  // Enter to send, Shift+Enter for newline
  if (e.key !== "Enter" || e.shiftKey) return
  e.preventDefault();
  onSubmit();
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
    <header class="ConvexChatHeader">
      <p v-if="!isClientReady" style="color: orange;">⏳ Initializing client-side connection...</p>
      <p v-if="isClientReady" class="caption">Online users: {{ onlineUsers.length }}</p>
      <div v-if="onlineUsers.length > 0" class="OnlineUsers">
        <UserChip v-for="user in onlineUsers" :key="user.userId"
          :message="{ user: user.displayName, userId: user.userId, lastSeen: user.lastSeen }"
          :color="getUserColor(user.userId) || '#808080'" />
      </div>
    </header>

    <section class="ChatMessagesWrapper">
      <div v-if="isPending" class="ChatMessagesLoading">
        <Icon name="eos-icons:loading" />
      </div>
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
      <div class="Info">
        <h4>Welcome to Convex Chat!</h4>
        <p class="caption">Messages are stored in Convex and visible to anyone using this app.</p>
        <p class="caption">Each user gets a unique ID that's stored locally on their device.</p>
      </div>
      <form class="MessageComposer" @submit.prevent="onSubmit">
        <Input v-model="form.data.value.displayName" label="Your name" size="small"
          :class="{ error: form.errors.value.displayName }" />
        <span v-if="form.errors.value.displayName" class="MessageErrorText">
          {{ form.errors.value.displayName[0] }}
        </span>

        <TextArea v-model="form.data.value.message" placeholder="Type a message"
          :class="{ error: form.errors.value.message }" @keydown="onTextareaKeydown" />
        <span v-if="form.errors.value.message" class="MessageErrorText">
          {{ form.errors.value.message[0] }}
        </span>

        <Button type="submit" color="base" :disabled="isSending || !isClientReady">
          <Icon name="carbon:send" class="icon" />
          <p>Send</p>
        </Button>
      </form>
    </footer>
  </main>
</template>

<style>
.ChatMessagesLoading {
  display: flex;
  justify-content: center;
  align-items: center;
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

footer.ConvexChatFooter .Info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.MessagesState {
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

.MessageComposer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.MessageErrorText {
  color: var(--warning-100);
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: var(--space-half);
}

.OnlineUsers {
  display: flex;
  gap: var(--space-1);
}
</style>
