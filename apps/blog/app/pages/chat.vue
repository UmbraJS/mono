<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import { Input, Button, TextArea } from "umbraco";
import OtherMessageBubble from "../components/OtherMessageBubble.vue";
import MyMessageBubble from "../components/MyMessageBubble.vue";
import { useStorage } from "@vueuse/core";

useSeoMeta({ title: "Convex Chat" });

const name = useStorage("chatName", "Anonymous");
const text = ref("");
const isSending = ref(false);
const messagesEl = ref<HTMLElement | null>(null);

const messagesResult = useConvexQuery(api.chat.getMessages);
const messages = computed(() => messagesResult.data.value ?? []);
const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage);

async function onSubmit() {
  const body = text.value.trim();
  if (!body || isSending.value) return;
  isSending.value = true;
  try {
    await sendMessage({ user: name.value || "Anonymous", body });
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
  <main class="chat">
    <header>
      <h2>Convex Chat</h2>
      <p>Welcome to the chat! Feel free to share your thoughts.</p>
    </header>

    <section class="ChatMessages">
      <div v-if="messagesResult.isPending" class="state">
        <Icon name="eos-icons:loading" class="icon icon--spin" />
      </div>
      <div v-else-if="messagesResult.error.value" class="state state--error">
        Error: {{ String(messagesResult.error.value) }}
      </div>
      <ul class="messages">
        <template v-for="m in messages" :key="m._id">
          <MyMessageBubble v-if="m.user === name" :message="m" />
          <OtherMessageBubble v-else :message="m" />
        </template>
      </ul>
    </section>

    <footer>
      <div class="Info">
        <h4>Welcome to Convex Chat!</h4>
        <p class="caption">Messages are stored in Convex and visible to anyone using this app.</p>
      </div>
      <form class="composer" @submit.prevent="onSubmit">
        <Input v-model="name" label="Your name" size="small" />
        <TextArea v-model="text" placeholder="Type a message" @keydown="onTextareaKeydown" />
        <Button type="submit" color="base" :disabled="!text.trim() || isSending">
          <Icon name="carbon:send" class="icon" />
          <p>Send</p>
        </Button>
      </form>
    </footer>
  </main>
</template>

<style scoped>
footer {
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

header {
  background-color: var(--base-10);
  padding: var(--space-2);
  border-radius: var(--radius);
}

.chat {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-2);
  padding: var(--space-2);
  padding-bottom: 100px;
  width: 100%;
}

.ChatMessages {
  overflow-y: auto;
  background: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-2);
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
}

.composer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
