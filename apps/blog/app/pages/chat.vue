<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConvexQuery, useConvexMutation } from 'convex-vue'
import { api } from '../../convex/_generated/api'

useSeoMeta({ title: 'Convex Chat' })

const name = ref('Anonymous')
const text = ref('')

const messagesResult = useConvexQuery(api.chat.getMessages)
const messages = computed(() => messagesResult.data.value ?? [])
const { mutate: sendMessage } = useConvexMutation(api.chat.sendMessage)

async function onSubmit() {
  if (!text.value.trim()) return
  await sendMessage({ user: name.value || 'Anonymous', body: text.value })
  text.value = ''
}
</script>

<template>
  <main class="chat">
    <h1>Convex Chat</h1>

    <form class="composer" @submit.prevent="onSubmit">
      <input v-model="name" placeholder="Your name" />
      <input v-model="text" placeholder="Type a message" />
      <button type="submit">Send</button>
    </form>

    <div v-if="messagesResult.isPending">Loading…</div>
    <div v-else-if="messagesResult.error" class="error">{{ String(messagesResult.error) }}</div>
    <ul v-else class="messages">
      <li v-for="m in messages" :key="m._id">
        <strong>{{ m.user }}</strong>: {{ m.body }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
.chat {
  display: grid;
  gap: 12px;
  max-width: 640px;
  margin: 24px auto;
}

.composer {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 8px;
}

.messages {
  display: grid;
  gap: 6px;
  list-style: none;
  padding: 0;
}

.error {
  color: #b00020
}

input {
  padding: 8px;
}

button {
  padding: 8px 12px;
}
</style>
