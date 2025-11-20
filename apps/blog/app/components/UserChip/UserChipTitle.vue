<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import { getShortId } from "../../utils/crypto";

const props = defineProps<{
  userName: string;
  userId: string;
}>();

const shortId = computedAsync(async () => {
  return getShortId(props.userId, 8);
}, null);
</script>

<template>
  <div class="MessageContentTitle">
    <p class="MessageName">
      <span>
        {{ userName }}
      </span>
    </p>
    <p class="UserID caption">#{{ shortId }}</p>
  </div>
</template>

<style>
p.MessageName {
  color: var(--base-100);
}

p.UserID {
  color: var(--base-70);
}

.MessageContentTitle {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}
</style>
