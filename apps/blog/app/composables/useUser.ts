import { useStorage } from "@vueuse/core";
import { computed } from "vue";

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Composable for managing user identity and persistence
 */
export const useUser = () => {
  // Store user ID in localStorage, generate if doesn't exist
  const userId = useStorage("userID", () => generateUUID());

  // Store display name in localStorage
  const displayName = useStorage("chatName", "Anonymous");

  // Computed property to ensure we always have a valid user ID
  const currentUser = computed(() => ({
    userId: userId.value,
    displayName: displayName.value
  }));

  /**
   * Get a deterministic color for the user based on their ID
   */
  const getUserColor = (userIdToColor: string) => {
    const colors = [
      "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
      "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
      "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
      "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"
    ];

    // Create a simple hash of the userId
    let hash = 0;
    for (let i = 0; i < userIdToColor.length; i++) {
      const char = userIdToColor.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return {
    userId: computed(() => userId.value),
    displayName,
    currentUser,
    getUserColor
  };
};
