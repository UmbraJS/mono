<template>
  <li class="OtherMessage" :style="{ '--color': color }">
    <div class="OtherMessageBubble">
      <div class="MessageHead">
        <Icon name="mdi:account" />
      </div>
      <div class="MessageContent">
        <div class="MessageContentTitle">
          <p class="MessageName caption">{{ message.user }}</p>
          <p v-if="shortId" class="UserID caption">#{{ shortId }}</p>
        </div>
        <p>{{ message.body }}</p>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { getShortId } from "../../utils";

const props = defineProps<{
  color: string;
  message: {
    user: string;
    body: string;
    userId: string;
  };
}>();

const shortId = computedAsync(async () => {
  return getShortId(props.message.userId, 8);
}, null);
</script>

<style scoped>
.MessageName {
  color: var(--color);
}

.OtherMessage {
  display: grid;
  gap: var(--space-1);
  justify-items: start;
}

.UserID {
  color: var(--base-70);
}

.OtherMessageBubble {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-1);
  justify-items: start;
  align-items: center;

  max-width: 80%;
  padding: var(--space-1);
  border-radius: var(--radius);
  background: var(--base);
  color: var(--base-text);
  word-wrap: break-word;
  overflow-wrap: anywhere;
}

.MessageHead span {
  width: 20px;
  color: var(--color);
}

.MessageHead {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: var(--base-10);
  border-radius: var(--radius);

}

.MessageContentTitle {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}
</style>
