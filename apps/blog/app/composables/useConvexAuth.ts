import { useConvexClient } from 'convue'
import { api } from '@/convex/_generated/api'

export interface ConvexAuthUser {
  id: string
  name?: string
  email?: string
  image?: string
}

export function useConvexAuth() {
  const client = useConvexClient()
  const user = ref<ConvexAuthUser | null>(null)
  const isLoading = ref(true)
  const isAuthenticated = computed(() => user.value !== null)

  // Check if user is authenticated
  onMounted(async () => {
    try {
      // Query current user from Convex
      const currentUser = await client.query(api.auth.getCurrentUser, {})
      if (currentUser) {
        user.value = currentUser as ConvexAuthUser
      }
    } catch (error) {
      console.error('Failed to check auth status:', error)
    } finally {
      isLoading.value = false
    }
  })

  return {
    user,
    isLoading,
    isAuthenticated,
  }
}
