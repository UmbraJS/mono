<script setup lang="ts">
import SignUser from '../components/SignUser.vue'
import UserPanel from '../components/UserPanel.vue'

const session = ref<{ user?: { email?: string; name?: string; id?: string } } | null>(null)
const isPending = ref(true)
const user = computed(() => session.value?.user ?? null)

// Only access auth client after component is mounted (client-side only)
onMounted(async () => {
  // Wait for plugins to be fully initialized
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // Dynamically import to avoid calling during setup
    const { useBetterAuthClient } = await import('convue')
    const authClient = useBetterAuthClient()
    const sessionData = authClient?.useSession?.()

    if (sessionData?.data) {
      session.value = sessionData.data.value
      // Watch for session changes
      watch(sessionData.data, (newSession) => {
        session.value = newSession
      })
    }

    if (sessionData?.isPending) {
      isPending.value = sessionData.isPending.value
      watch(sessionData.isPending, (newPending) => {
        isPending.value = newPending
      })
    }
    else {
      isPending.value = false
    }
  }
  catch (error) {
    console.error('Failed to initialize auth:', error)
    isPending.value = false
  }
})
</script>

<template>
  <ClientOnly>
    <div v-if="isPending">Loading...</div>
    <SignUser v-else-if="!user" />
    <UserPanel v-else />
  </ClientOnly>
</template>
