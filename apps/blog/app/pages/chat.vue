<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useConvexQuery, useConvexMutation } from "convex-vue";
import { api } from "../../convex/_generated/api";
import { Input, Button, TextArea } from "umbraco";
import OtherMessageBubble from "../components/OtherMessageBubble.vue";
import MyMessageBubble from "../components/MyMessageBubble.vue";

useSeoMeta({ title: "Convex Chat" });

const name = ref("Anonymous");
const text = ref("");
const isSending = ref(false);
const messagesEl = ref<HTMLElement | null>(null);

const messagesResult = useConvexQuery(api.chat.getMessages);
const messages = computed(() => messagesResult.data.value ?? []);
const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage);

// Workaround: Some users observe messagesResult.isPending staying true even after data arrives.
// Derive our own initial loading state based on first meaningful value (data OR error).
const hasFirstValue = computed(
  () =>
    messagesResult.data.value !== undefined ||
    messagesResult.error.value !== undefined,
);
const initialLoading = computed(() => !hasFirstValue.value);

// Temporary debug instrumentation (remove once stable): log state transitions.
if (import.meta.dev) {
  watch(
    [
      () => messagesResult.data.value,
      () => messagesResult.error.value,
      () => messagesResult.isPending,
    ],
    ([data, error, isPending]) => {

      console.debug("[chat debug] convex query state", {
        hasData: data !== undefined,
        dataSample: Array.isArray(data)
          ? `array(len=${data.length})`
          : typeof data,
        error: error || null,
        isPending,
        derivedInitialLoading: initialLoading.value,
      });
    },
    { immediate: true },
  );
}

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
    <header class="chat__header">
      <h3>Convex Chat</h3>
    </header>

    <section ref="messagesEl" class="chat__messages">
      <div v-if="initialLoading" class="state">Loading…</div>
      <div v-else-if="messagesResult.error.value" class="state state--error">
        Error: {{ String(messagesResult.error.value) }}
      </div>
      <ul v-else class="messages">
        <template v-for="m in messages" :key="m._id">
          <MyMessageBubble v-if="m.user === name" :message="m" />
          <OtherMessageBubble v-else :message="m" />
        </template>
      </ul>
    </section>

    <form class="composer" @submit.prevent="onSubmit">
      <Input v-model="name" label="Your name" size="small" />
      <TextArea v-model="text" placeholder="Type a message" @keydown="onTextareaKeydown" />
      <Button type="submit" color="base" :disabled="!text.trim() || isSending">
        <Icon name="carbon:send" class="icon" />
        <p>Send</p>
      </Button>
    </form>
  </main>
</template>

<style scoped>
.chat {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: var(--space-2);
  padding: var(--space-2);
  padding-bottom: 100px;
  background: var(--base-10);
}

.chat__messages {
  overflow-y: auto;
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
  padding: 0;
  display: grid;
  gap: var(--space-1);
}

.composer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
