import type { UmbraInput } from '@umbrajs/core'
import { isDark } from '@umbrajs/core'

// Plugin to sync saved theme with Pinia store after hydration
export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<UmbraInput>('umbra-theme')

  if (import.meta.client) {
    // On client after hydration, check if localStorage has a theme
    const stored = localStorage.getItem('umbra-theme-input')
    if (stored) {
      try {
        const savedTheme = JSON.parse(stored) as UmbraInput
        console.log('[umbra-init] Found saved theme in localStorage:', isDark(savedTheme.background || '') ? 'dark' : 'light')

        // Get the Pinia store and apply the saved theme
        const theme = useUmbra()
        theme.apply({ scheme: savedTheme })
      } catch (e) {
        console.error('[umbra-init] Failed to parse saved theme:', e)
      }
    } else if (themeCookie.value) {
      // If no localStorage but cookie exists, sync cookie to localStorage
      console.log('[umbra-init] Syncing cookie to localStorage')
      localStorage.setItem('umbra-theme-input', JSON.stringify(themeCookie.value))
    }
  }
})
