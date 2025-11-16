import { defineStore } from 'pinia'
import { useUmbra as useUmbraCore } from 'umbraco'
import type { UmbraInput } from '@umbrajs/core'
import { defaultThemeInput } from '../theme'

export const useUmbra = defineStore('umbra', () => {
  // Check if we have a saved theme from the cookie (SSR) or localStorage (client)
  let initialTheme = defaultThemeInput

  // During SSR, check if umbra-ssr plugin stored a theme
  // Wrap in try-catch for prerendering where cookies might not be available
  try {
    const themeCookie = useCookie<UmbraInput>('umbra-theme')
    if (themeCookie.value) {
      console.log('[useUmbra store] Using theme from cookie:', themeCookie.value)
      initialTheme = themeCookie.value
    }
  } catch {
    // During prerendering, cookies might not be available - use default theme
    console.log('[useUmbra store] Cookie not available (prerendering), using default theme')
  }

  return useUmbraCore(initialTheme)
})

