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
    const { useAuth } = await import('convue')
    const auth = useAuth()

    // Set initial session value
    session.value = auth.session.value
    isPending.value = auth.isLoading.value

    // Watch for session changes
    watch(auth.session, (newSession) => {
      session.value = newSession
    })

    // Watch for loading state changes
    watch(auth.isLoading, (newPending) => {
      isPending.value = newPending
    })
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
