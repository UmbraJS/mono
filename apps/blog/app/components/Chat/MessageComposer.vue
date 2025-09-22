<script setup lang="ts">
import { watch } from "vue";
import { useConvexQuery } from "convue";
import { api } from "../../../convex/_generated/api";
import { Input, Button, TextArea, toast } from "umbraco";
import { z } from "zod";
import { useUser } from "../../composables/useUser";
import { useFormula } from "../../composables/useForm";
import { usePresence } from "../../composables/usePresence";
import type { ChatMessage } from "./chat.types"

const props = defineProps<{
  onSend: (props: ChatMessage) => Promise<void>;
  isDisabled: boolean;
}>();

// User management
const { currentUser, setDisplayName } = useUser();

usePresence(currentUser);

// Initialize validated form with empty display name initially
const form = useFormula({
  message: "",
  displayName: ""
}, {
  validationMode: "onSubmit", // Only validate when submitting
  schema: z.object({
    message: z.string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(1000, "Message must be less than 1000 characters"),
    displayName: z.string()
      .trim()
      .min(1, "Display name is required")
      .max(50, "Display name must be less than 50 characters")
  }),
});

// Function to handle real query results
const userQuery = useConvexQuery(api.chat.getUser, () => ({ userId: currentUser.value.userId }));

// Watch for form display name changes to update the user composable
watch(() => form.data.value.displayName, (newDisplayName) => {
  if (!newDisplayName) return
  setDisplayName(newDisplayName);
});

// Load user's display name from backend when available
watch(() => userQuery.data.value, (userData) => {
  if (userData?.displayName && userData?.displayName !== "Anonymous" && currentUser.value.displayName === "Anonymous") {
    // Only set initial value if form is empty
    setDisplayName(userData.displayName);
    form.setForm({ displayName: userData.displayName });
  } else if (currentUser.value.displayName === "Anonymous") {
    // Set default if no backend data and form is empty
    setDisplayName("Anonymous");
    form.setForm({ displayName: "Anonymous" });
  }
}, { immediate: true });

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
        toast.error(`${field}: ${messages[0]}`);
      }
    } else if (validation.formErrors.length > 0 && validation.formErrors[0]) {
      toast.error(validation.formErrors[0]);
    }
    return;
  }

  if (!validation.data) return;
  props.onSend({
    message: validation.data.message,
    displayName: validation.data.displayName,
    form: form
  });
}
</script>

<template>
  <form class="MessageComposer" @submit.prevent="onSubmit">
    <Input v-model="form.data.value.displayName" label="Your name" size="small"
      :class="{ error: form.errors.value.displayName }" />
    <span v-if="form.errors.value.displayName" class="MessageErrorText">
      {{ form.errors.value.displayName[0] }}
    </span>

    <TextArea v-model="form.data.value.message" placeholder="Type a message"
      :class="{ error: form.errors.value.message }" @keydown="onTextareaKeydown" />
    <span v-if="form.errors.value.message" class="MessageErrorText">
      {{ form.errors.value.message[0] }}
    </span>

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
