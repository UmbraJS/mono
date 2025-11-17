<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { useConvexQuery, useConvexMutation } from "convue";
import { api } from "../../../convex/_generated/api";
import { toast } from "umbraco";
import type { Id } from "../../../convex/_generated/dataModel";

interface Props {
  disabled?: boolean;
  chatroomId: Id<"chatrooms">;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
});

// Auth management
const { session } = useAuth()

// Get user info from session
const currentUser = computed(() => ({
  userId: session.value?.user?.id || '',
  displayName: session.value?.user?.name || 'Anonymous',
}))

// Emoji combo counter state
const comboCount = ref<{
  timestamp: number;
}[]>([]);

const cooldownRemaining = ref(0);
const isOnCooldown = ref(false);
const COMBO_LIMIT = 30;
const COOLDOWN_DURATION = 30; // 30 seconds

// Convex mutations and queries
const emojiEventsQuery = useConvexQuery(api.chat.getRecentEmojiEvents, () => ({
  chatroomId: props.chatroomId
}));
const { mutate: sendEmoji } = useConvexMutation(api.chat.sendEmoji);

const emojiEvents = computed(() => emojiEventsQuery.data.value || []);

function getAllEmojisSentInTheLast30Seconds() {
  const now = Date.now();
  return emojiEvents.value.filter(event => now - event.timestamp <= COOLDOWN_DURATION * 1000);
}

async function onEmojiClick(emoji: string) {
  // Check if component is disabled
  if (props.disabled) {
    return;
  }

  // Check if we're on cooldown
  if (isOnCooldown.value) {
    toast.error(`Please wait ${cooldownRemaining.value}s before sending more emojis!`);
    return;
  }

  const recentEmojis = getAllEmojisSentInTheLast30Seconds();

  // Check if we've reached the combo limit
  if (recentEmojis.length >= COMBO_LIMIT) {
    startCooldown();
    toast.error(`Combo limit reached! Wait ${COOLDOWN_DURATION}s before sending more emojis.`);
    return;
  }

  try {
    await sendEmoji({
      userId: currentUser.value.userId,
      chatroomId: props.chatroomId,
      emoji: emoji,
    });

    // Increment combo counter
    comboCount.value.push({ timestamp: Date.now() });
    toast.success(`${emoji} sent! Combo: ${comboCount.value.length}/${COMBO_LIMIT}`);

    const countdownMs = COOLDOWN_DURATION * 1000;

    setTimeout(() => {
      comboCount.value.shift();
    }, countdownMs);

    // Start cooldown if we hit the limit
    if (comboCount.value.length >= COMBO_LIMIT) {
      startCooldown();
    }
  } catch (error) {
    console.error("Failed to send emoji:", error);

    // Handle rate limit error from backend
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      toast.error("Rate limit exceeded! Please wait before sending more emojis.");
      startCooldown();
    } else {
      toast.error("Failed to send emoji. Please try again.");
    }
  }
}

const emojis = ["😂", "😍", "😎", "😭", "🔥"];

// Cooldown timer functionality
let cooldownInterval: NodeJS.Timeout | null = null;

function startCooldown() {
  isOnCooldown.value = true;
  cooldownRemaining.value = COOLDOWN_DURATION;

  // Clear any existing interval
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }

  cooldownInterval = setInterval(() => {
    cooldownRemaining.value--;
    if (cooldownRemaining.value <= 0) {
      resetCombo();
    }
  }, 1000);
}

function resetCombo() {
  comboCount.value = [];
  isOnCooldown.value = false;
  cooldownRemaining.value = 0;

  if (cooldownInterval) {
    clearInterval(cooldownInterval);
    cooldownInterval = null;
  }
}

// Computed properties for UI
const isEmojiDisabled = computed(() => props.disabled || isOnCooldown.value || comboCount.value.length >= COMBO_LIMIT);
const comboStatus = computed(() => {
  if (isOnCooldown.value) {
    return `Cooldown: ${cooldownRemaining.value}s`;
  }
  return `Combo: ${comboCount.value.length ?? 0}/${COMBO_LIMIT}x`;
});

// Cleanup on component unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>

<template>
  <div class="LiveEmojiWrapper">
    <div class="LiveEmojiMeta">
      <div class="LiveEmojiCombo" :class="{ 'combo-cooldown': isOnCooldown }">
        <div class="LiveEmojiLabel"><span>{{ comboStatus }}</span></div>
        <div class="ComboStatusBar" :style="{ width: `${(comboCount.length / COMBO_LIMIT) * 100}%` }"></div>
      </div>
    </div>
    <div class="LiveEmojis">
      <button v-for="emoji in emojis" :key="emoji" class="button buttonHover buttonActive buttonFocus focus"
        :class="{ 'button-disabled': isEmojiDisabled }" :disabled="isEmojiDisabled" @click="onEmojiClick(emoji)">
        <span style="font-size: 2rem;">{{ emoji }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.LiveEmojiWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.LiveEmojis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  gap: var(--space-1);
  height: 100%;
}

.LiveEmojis button.button {
  height: auto;
  width: auto;
}

.LiveEmojis button.button span {
  transition: transform var(--time-2);
}

.LiveEmojis button.button:active span {
  transform: scale(0.3);
  transition: transform var(--time);
}

.LiveEmojiMeta {
  grid-column: 1 / -1;
  background-color: var(--base-10);
  border-radius: var(--radius);
  padding: var(--space-1);
}

.LiveEmojiCombo {
  position: relative;
  display: flex;
  gap: var(--space-1);
  background: var(--base);
  padding: var(--space-1);
  border-radius: var(--radius);
  transition: background-color var(--time);
}

.LiveEmojiCombo.combo-cooldown {
  background: var(--warning-10);
  color: var(--warning-120);
}

.LiveEmojis button.button.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.LiveEmojis button.button.button-disabled span {
  transform: scale(0.8);
}

.LiveEmojiLabel {
  z-index: 1;
  position: relative;
}

.ComboStatusBar {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: var(--warning-30);
  border-radius: var(--radius);
  transition: var(--time);
}
</style>
