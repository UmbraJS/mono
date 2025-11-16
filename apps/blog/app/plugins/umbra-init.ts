import type { UmbraInput } from '@umbrajs/core'
import { isDark } from '@umbrajs/core'

// Plugin to sync saved theme with Pinia store after hydration
export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<UmbraInput>('umbra-theme')

  if (import.meta.client) {
    // On client after hydration, ensure Pinia store reflects localStorage
    const stored = localStorage.getItem('umbra-theme-input')

    if (stored) {
      try {
        const savedTheme = JSON.parse(stored) as UmbraInput
        const savedIsDark = isDark(savedTheme.background || '')

        // Get the Pinia store
        const theme = useUmbra()

        // Check if store state matches localStorage (it should if cookie worked)
        const storeIsDark = theme.isDark

        // Only apply if there's a mismatch (shouldn't happen if cookie worked)
        if (storeIsDark !== savedIsDark) {
          theme.apply({ scheme: savedTheme })
        }
      } catch (e) {
        console.error('[umbra-init] Failed to parse saved theme:', e)
      }
    } else if (themeCookie.value) {
      // If no localStorage but cookie exists, sync cookie to localStorage
      localStorage.setItem('umbra-theme-input', JSON.stringify(themeCookie.value))
    }
  }
})
