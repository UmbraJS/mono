<script setup lang="ts">
import UserChipWrapper from "../UserChipWrapper.vue";
import UserChipTitle from "../UserChipTitle.vue";
import UserChipAvatar from "../UserChipAvatar.vue";
import { useScopedTheme } from "../../../composables/useScopedTheme";

const props = defineProps<{
  color: string;
  message: {
    user: string;
    body: string;
    userId: string;
  };
}>();

useScopedTheme("chipWrapperRef", () => props.color);
</script>

<template>
  <div ref="chipWrapperRef">
    <UserChipWrapper :color="color" class="base-accent">
      <UserChipAvatar />
      <div class="MessageContent">
        <UserChipTitle :userName="message.user" :userId="message.userId" />
        <p>{{ message.body }}</p>
      </div>
    </UserChipWrapper>
  </div>
</template>
