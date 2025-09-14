<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useConvexQuery, useConvexMutation } from "convex-vue";
import { api } from "../../convex/_generated/api";

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
      // eslint-disable-next-line no-console
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
      <h1>Convex Chat</h1>
      <div class="you">
        <label class="sr-only" for="your-name">Your name</label>
        <input
          id="your-name"
          v-model="name"
          placeholder="Your name"
          class="input input--sm"
        />
      </div>
    </header>

    <section ref="messagesEl" class="chat__messages">
      <div v-if="initialLoading" class="state">Loading…</div>
      <div v-else-if="messagesResult.error.value" class="state state--error">
        Error: {{ String(messagesResult.error.value) }}
      </div>
      <ul v-else class="messages">
        <li
          v-for="m in messages"
          :key="m._id"
          class="message"
          :class="{ 'message--self': m.user === name }"
        >
          <div class="message__meta">
            <span class="message__author">{{
              m.user === name ? "You" : m.user
            }}</span>
          </div>
          <div class="message__bubble">{{ m.body }}</div>
        </li>
      </ul>
    </section>

    <form class="composer" @submit.prevent="onSubmit">
      <label class="sr-only" for="message-input">Type a message</label>
      <textarea
        id="message-input"
        v-model="text"
        class="composer__input"
        placeholder="Type a message"
        rows="1"
        @keydown="onTextareaKeydown"
      ></textarea>
      <button
        class="composer__send"
        type="submit"
        :disabled="!text.trim() || isSending"
      >
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
        </svg>
        <span>Send</span>
      </button>
    </form>
  </main>
</template>

<style scoped>
:root {
  --bg: #0b0d12;
  --card: #0f141b;
  --muted: #94a3b8;
  --text: #e5e7eb;
  --accent: #6366f1;
  --accent-700: #4f46e5;
  --error: #ef4444;
  --bubble: #1f2937;
  --bubble-self: #3b82f6;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg: #f5f7fb;
    --card: #ffffff;
    --muted: #6b7280;
    --text: #0f172a;
    --accent: #4f46e5;
    --accent-700: #4338ca;
    --error: #dc2626;
    --bubble: #eef2f7;
    --bubble-self: #4f46e5;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.chat {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  max-width: 860px;
  height: min(85vh, 900px);
  margin: 24px auto;
  padding: 16px;
  background: var(--card);
  border: 1px solid color-mix(in oklab, var(--text) 12%, transparent);
  border-radius: 16px;
  color: var(--text);
}

.chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat__header h1 {
  font-size: 18px;
  margin: 0;
}

.you .input--sm {
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  border: 1px solid color-mix(in oklab, var(--text) 14%, transparent);
}

.chat__messages {
  overflow-y: auto;
  padding: 4px 2px;
}

.state {
  text-align: center;
  color: var(--muted);
  padding: 16px 0;
}

.state--error {
  color: var(--error);
}

.messages {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.message {
  display: grid;
  gap: 4px;
  justify-items: start;
}

.message--self {
  justify-items: end;
}

.message__meta {
  font-size: 12px;
  color: var(--muted);
}

.message__bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  background: var(--bubble);
  color: var(--text);
  line-height: 1.35;
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

.message--self .message__bubble {
  background: color-mix(in oklab, var(--bubble-self) 92%, transparent);
  color: white;
}

.composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: end;
}

.composer__input {
  min-height: 44px;
  max-height: 200px;
  resize: vertical;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in oklab, var(--text) 14%, transparent);
  background: transparent;
  color: var(--text);
}

.composer__send {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  background: var(--accent);
  color: white;
  border: 1px solid color-mix(in oklab, var(--accent-700) 40%, transparent);
  cursor: pointer;
}

.composer__send:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
</style>
