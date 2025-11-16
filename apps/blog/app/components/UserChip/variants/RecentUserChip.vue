<script setup lang="ts">
import UserChipWrapper from "../UserChipWrapper.vue";
import UserChipTitle from "../UserChipTitle.vue";
import UserChipAvatar from "../UserChipAvatar.vue";
import UserChipPresence from "../UserChipPresence.vue";

defineProps<{
  color: string;
  isYou: boolean;
  message: {
    user: string;
    lastSeen: number;
    userId: string;
  };
}>();
</script>

<template>
  <UserChipWrapper :color="color">
    <UserChipAvatar />
    <div class="MessageContent">
      <UserChipTitle :userName="message.user" :userId="message.userId" />
      <UserChipPresence :isYou="isYou" :message="message" />
    </div>
  </UserChipWrapper>
</template>
