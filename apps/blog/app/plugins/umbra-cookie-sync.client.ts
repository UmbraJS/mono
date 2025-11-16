import type { UmbraInput } from '@umbrajs/core'

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<UmbraInput>('umbra-theme', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  })

  if (typeof window !== 'undefined') {
    const STORAGE_KEY = 'umbra-theme-input'

    // Poll localStorage for changes (storage events don't fire in same window)
    let lastValue = localStorage.getItem(STORAGE_KEY)

    const checkForChanges = () => {
      const currentValue = localStorage.getItem(STORAGE_KEY)
      if (currentValue !== lastValue) {
        lastValue = currentValue
        if (currentValue) {
          try {
            const themeInput = JSON.parse(currentValue) as UmbraInput
            themeCookie.value = themeInput
          } catch {
            // Invalid JSON, ignore
          }
        }
      }
    }

    // Check every 100ms for changes
    const interval = setInterval(checkForChanges, 100)

    // Also check on mount
    checkForChanges()

    // Clean up on unmount
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        clearInterval(interval)
      })
    }
  }
})
