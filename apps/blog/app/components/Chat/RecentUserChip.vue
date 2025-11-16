<script setup lang="ts">
import UserChip from "../UserChip/UserChip.vue";
import UserChipTitle from "../UserChip/UserChipTitle.vue";
import UserChipAvatar from "../UserChip/UserChipAvatar.vue";
import UserChipPresence from "../UserChip/UserChipPresence.vue";

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
  <UserChip :color="color">
    <UserChipAvatar />
    <div class="MessageContent">
      <UserChipTitle :userName="message.user" :userId="message.userId" />
      <UserChipPresence :isYou="isYou" :message="message" />
    </div>
  </UserChip>
</template>
