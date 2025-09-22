<script setup lang="ts">
defineProps<{
  isClientReady: boolean;
}>();
</script>

<template>
  <div class="ChatMessagesLoading">
    <div class="ChatMessagesLoader">
      <Icon name="eos-icons:loading" />
      <p v-if="!isClientReady" style="color: orange;">⏳ Initializing client-side connection...</p>
    </div>
    <div class="ChatMessagesLoadingSpacer">
      <slot />
    </div>
  </div>
</template>

<style>
.ChatMessagesLoader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.ChatMessagesLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

.ChatMessagesLoadingSpacer {
  opacity: 0;
}
</style>
