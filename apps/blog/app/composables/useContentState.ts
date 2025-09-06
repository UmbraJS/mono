/**
 * Composable to manage content state for Nuxt Studio compatibility
 * This provides the missing useContentState that @nuxthq/studio expects
 * Based on Nuxt Content module patterns
 */
export function useContentState() {
  // Create a reactive state for content
  const state = useState('content:state', () => ({
    // Content navigation state
    navigation: [],
    // Current content item
    current: null,
    // Content surround (prev/next)
    surround: [],
    // Content query state
    query: {},
    // Loading state
    loading: false,
    // Error state
    error: null as Error | null,
  }))

  // Provide methods that Nuxt Studio might expect
  const refresh = async () => {
    state.value.loading = true
    try {
      // Refresh content state
      await refreshCookie('content:state')
    } catch (error) {
      state.value.error = error as Error | null
    } finally {
      state.value.loading = false
    }
  }

  const reset = () => {
    state.value = {
      navigation: [],
      current: null,
      surround: [],
      query: {},
      loading: false,
      error: null as Error | null,
    }
  }

  return {
    ...toRefs(state.value),
    refresh,
    reset,
    state: readonly(state),
  }
}
