import { ref, onMounted, onUnmounted } from "vue";
import { useConvexMutation } from "convue";
import { api } from "../../convex/_generated/api";
import type { UseUser } from "./useUser";

export const usePresence = (currentUser: UseUser["currentUser"]) => {
  const isVisible = ref(true);
  const heartbeatInterval = ref<NodeJS.Timeout | null>(null);

  const { mutate: updatePresence } = useConvexMutation(api.chat.updateUserPresence);
  const { mutate: setOffline } = useConvexMutation(api.chat.setUserOffline);
  const { mutate: cleanup } = useConvexMutation(api.chat.cleanupStaleUsers);

  const updateUserPresence = async () => {
    try {
      // Add safety checks for client environment
      if (typeof window === 'undefined') return;
      if (!currentUser.value?.userId) {
        console.warn("No user ID available for presence update");
        return;
      }

      console.log("Rex er: ", currentUser.value.displayName);
      await updatePresence({
        userId: currentUser.value.userId,
      });
    } catch (error) {
      console.error("Failed to update presence:", error);
      // Don't throw the error to prevent breaking the app
    }
  };

  const setUserOffline = async () => {
    try {
      await setOffline({ userId: currentUser.value.userId });
    } catch (error) {
      console.error("Failed to set user offline:", error);
    }
  };

  const handleVisibilityChange = () => {
    if (typeof document === 'undefined') return
    isVisible.value = !document.hidden;

    if (isVisible.value) {
      // Page became visible - restart heartbeat (which will update presence)
      startHeartbeat();
    } else {
      // Page became hidden - stop heartbeat but don't set offline immediately
      // (user might switch tabs briefly)
      stopHeartbeat();
    }
  };

  const startHeartbeat = () => {
    stopHeartbeat(); // Clear any existing interval

    // Add a small delay before the first update to ensure everything is ready
    setTimeout(() => {
      updateUserPresence();
    }, 100);

    // Then every 30 seconds
    heartbeatInterval.value = setInterval(() => {
      if (!isVisible.value || typeof window === 'undefined') return
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
    if (typeof window === 'undefined' || import.meta.env.SSR) return
    // Set up page visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set up beforeunload listener to mark user as offline
    window.addEventListener('beforeunload', setUserOffline);

    // Delay starting heartbeat to allow user data to load first and Convex to initialize
    setTimeout(() => {
      startHeartbeat();
    }, 2000); // 2 second delay to ensure Convex is ready

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
