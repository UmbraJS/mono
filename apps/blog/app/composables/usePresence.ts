import { ref, onMounted, onUnmounted } from "vue";
import { useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";

export const usePresence = (userId: string, displayName: string) => {
  const isVisible = ref(true);
  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);

  const { mutate: updatePresence } = useConvexMutation(api.chat.updateUserPresence);
  const { mutate: setOffline } = useConvexMutation(api.chat.setUserOffline);
  const { mutate: cleanup } = useConvexMutation(api.chat.cleanupStaleUsers);

  const updateUserPresence = async () => {
    try {
      await updatePresence({
        userId,
        displayName: displayName || "Anonymous"
      });
    } catch (error) {
      console.error("Failed to update presence:", error);
    }
  };

  const setUserOffline = async () => {
    try {
      await setOffline({ userId });
    } catch (error) {
      console.error("Failed to set user offline:", error);
    }
  };

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined') return
    isVisible.value = !document.hidden;

    if (isVisible.value) {
      // Page became visible - update presence immediately and restart heartbeat
      updateUserPresence();
      startHeartbeat();
    } else {
      // Page became hidden - stop heartbeat but don't set offline immediately
      // (user might switch tabs briefly)
      stopHeartbeat();
    }
  };

  const startHeartbeat = () => {
    stopHeartbeat(); // Clear any existing interval

    // Update presence immediately
    updateUserPresence();

    // Then every 30 seconds
    heartbeatInterval.value = setInterval(() => {
      if (!isVisible.value) return
      updateUserPresence();
    }, 30000);
  };

  const stopHeartbeat = () => {
    if (!heartbeatInterval.value) return
    clearInterval(heartbeatInterval.value);
    heartbeatInterval.value = null;
  };

  const cleanupStaleUsers = async () => {
    try {
      await cleanup({});
    } catch (error) {
      console.error("Failed to cleanup stale users:", error);
    }
  };

  onMounted(() => {
    if (typeof window === 'undefined') return
    // Set up page visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up beforeunload listener to mark user as offline
    window.addEventListener('beforeunload', setUserOffline);

    // Start heartbeat system
    startHeartbeat();

    // Cleanup very old users on mount
    cleanupStaleUsers();

    // Set up periodic cleanup (every hour since we're now deleting old records)
    const cleanupInterval = setInterval(cleanupStaleUsers, 60 * 60 * 1000);

    onUnmounted(() => {
      clearInterval(cleanupInterval);
    });
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', setUserOffline);
    }
    stopHeartbeat();
    setUserOffline();
  });

  return {
    isVisible,
    updateUserPresence,
    setUserOffline,
  };
};
