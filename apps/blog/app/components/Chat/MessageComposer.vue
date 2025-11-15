<script setup lang="ts">
import { watch, computed } from "vue";
import { Button, TextArea, toast } from "umbraco";
import { z } from "zod";
import { useFormula } from "@umbrajs/formula";
import { usePresence } from "../../composables/usePresence";
import type { ChatMessage } from "./chat.types"

const props = defineProps<{
  onSend: (props: ChatMessage) => Promise<void>;
  isDisabled: boolean;
}>();

// Auth management
const { session } = useAuth()

// Get user info from session
const currentUser = computed(() => ({
  userId: session.value?.user?.id || '',
  displayName: session.value?.user?.name || 'Anonymous',
}))

const presence = usePresence(currentUser);

// Watch for when user becomes authenticated and restart presence
watch(() => currentUser.value.userId, (newUserId) => {
  if (newUserId && newUserId !== '') {
    // User just logged in, start tracking their presence
    presence.updateUserPresence();
  }
});

// Form with just message field
const form = useFormula({
  message: ""
}, {
  validationMode: "onSubmit",
  schema: z.object({
    message: z.string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(1000, "Message must be less than 1000 characters")
  }),
});

function onTextareaKeydown(e: KeyboardEvent) {
  // Enter to send, Shift+Enter for newline
  if (e.key !== "Enter" || e.shiftKey) return
  e.preventDefault();
  onSubmit();
}

async function onSubmit() {
  const validation = form.validate();

  if (!validation.success) {
    // Show validation errors as toast notifications
    const errors = Object.entries(validation.fieldErrors);
    if (errors.length > 0) {
      // Show the first error as a toast
      const firstError = errors[0];
      if (firstError) {
        const [field, messages] = firstError;
        toast.error(`${messages[0]}`);
      }
    } else if (validation.formErrors.length > 0 && validation.formErrors[0]) {
      toast.error(validation.formErrors[0]);
    }
    return;
  }

  if (!validation.data) return;
  props.onSend({
    message: validation.data.message,
    form: form
  });
}
</script>

<template>
  <form class="MessageComposer" @submit.prevent="onSubmit">
    <TextArea v-model="form.data.value.message" placeholder="Type a message"
      :class="{ error: form.errors.value.message }"
      :error="form.errors.value.message ? form.errors.value.message[0] : ''" @keydown="onTextareaKeydown" />

    <Button type="submit" color="base" :isDisabled="props.isDisabled">
      <Icon name="carbon:send" class="icon" />
      <p>Send</p>
    </Button>
  </form>
</template>

<style>
.MessageComposer {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.MessageErrorText {
  color: var(--warning-100);
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: var(--space-half);
}
</style>
