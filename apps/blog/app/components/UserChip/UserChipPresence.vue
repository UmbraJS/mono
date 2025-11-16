<script setup lang="ts">
const props = defineProps<{
  isYou: boolean;
  message: {
    user: string;
    lastSeen: number;
    userId: string;
  };
}>();

const timeSinceLastSeen = computed(() => {
  return Date.now() - props.message.lastSeen;
});
</script>

<template>
  <div class="UserChipMetadata">
    <p v-if="isYou" class="caption">You</p>
    <p v-else-if="timeSinceLastSeen < 60000" class="caption">Just now</p>
    <p v-else-if="timeSinceLastSeen < 3600000" class="caption">{{ Math.floor(timeSinceLastSeen / 60000) }}
      minutes
      ago</p>
    <p v-else class="caption">{{ Math.floor(timeSinceLastSeen / 3600000) }} hours ago</p>
  </div>
</template>

<style>
.UserChipMetadata {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}
</style>
