<template>
  <li class="OtherMessage" :style="{ '--color': color }">
    <div class="OtherMessageBubble">
      <div class="MessageHead">
        <Icon name="mdi:account" />
      </div>
      <div class="MessageContent">
        <div class="MessageContentTitle">
          <p class="MessageName">{{ message.user }}</p>
          <p class="UserID caption">#{{ shortId }}</p>
        </div>
        <div class="UserChipMetadata">
          <p v-if="timeSinceLastSeen < 60000" class="caption">Just now</p>
          <p v-else-if="timeSinceLastSeen < 3600000" class="caption">{{ Math.floor(timeSinceLastSeen / 60000) }}
            minutes
            ago</p>
          <p v-else class="caption">{{ Math.floor(timeSinceLastSeen / 3600000) }} hours ago</p>
        </div>
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
    lastSeen: number;
    userId: string;
  };
}>();

const timeSinceLastSeen = computed(() => {
  return Date.now() - props.message.lastSeen;
});

const shortId = computedAsync(async () => {
  return getShortId(props.message.userId, 8);
}, null);
</script>

<style scoped>
.UserChipMetadata {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

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
