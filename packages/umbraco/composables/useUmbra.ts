import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { UmbraInput, FormatedRange, UmbraOutputs, UmbraSettings } from '@umbrajs/core'
import { umbra, isDark, getReadability } from '@umbrajs/core'

const defaultThemeInput: UmbraInput = {
  foreground: '#080113',
  background: '#f3f6ea',
  accents: ['violet', 'red', 'green'],
  inversed: {
    foreground: '#f3f6ea',
    background: '#080113',
    accents: ['violet', 'red', 'green'],
  },
}

export function useUmbra(initialTheme: UmbraInput = defaultThemeInput) {
  const input = ref<UmbraInput>(initialTheme)
  const formated = ref<FormatedRange[]>([])
  const dark = ref<boolean>(false)
  const settings = ref<UmbraSettings>({
    readability: 50,
  })

  const readability = ref({
    target: 50,
    input: 50,
    output: 50,
  })

  function stringableInput(input: UmbraInput): Omit<UmbraInput, 'settings'> {
    // Returns only the part of the input that can be stringified
    return {
      background: input.background,
      foreground: input.foreground,
      accents: input.accents,
      inversed: input.inversed
        ? {
          background: input.inversed.background,
          foreground: input.inversed.foreground,
          accents: input.inversed.accents,
        }
        : undefined,
    }
  }

  function store(theme: UmbraOutputs): UmbraOutputs {
    const targetReadability = settings.value.readability
    detectReadability(targetReadability)
    input.value = stringableInput(theme.input)
    settings.value = theme.input.settings || settings.value
    formated.value = theme.formated
    dark.value = isDark(theme.input.background || '')

    // Save to localStorage for cookie sync
    if (typeof window !== 'undefined') {
      const themeToStore = {
        ...theme.input,
        settings: settings.value,
      }
      localStorage.setItem('umbra-theme-input', JSON.stringify(themeToStore))
      // Trigger storage event for cookie sync plugin
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'umbra-theme-input',
        newValue: JSON.stringify(themeToStore),
      }))
    }

    return theme
  }

  async function apply({ scheme, element }: { scheme?: UmbraInput; element?: HTMLElement } = {}) {
    const schemeInput = {
      ...input.value, // previous input
      ...scheme, // new input
    }

    const schemeSettings = {
      ...settings.value, // default settings
      ...scheme?.settings, // new settings
    }

    const theme = umbra({
      ...schemeInput,
      settings: schemeSettings,
    })

    // During theme swaps, temporarily restrict transitions to color-only to avoid jank
    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-changing')
    }

    const output = await theme.apply({
      target: element,
    })

    setTimeout(async () => {
      await theme.inverse().apply({
        target: '.inverted-theme',
      })
      if (typeof document === 'undefined') return
      requestAnimationFrame(() => document.documentElement.classList.remove('theme-changing'))
    }, 0)

    return store(output)
  }

  const debounced = useDebounceFn((s) => apply(s), 50, {
    maxWait: 200,
  })

  async function inverse({ element }: { element?: HTMLElement } = {}) {
    const theme = umbra({
      settings: settings.value,
      ...input.value,
    })

    const inverse = theme.inverse()

    if (typeof document !== 'undefined') {
      document.documentElement.classList.add('theme-changing')
    }

    const output = await inverse.apply({
      target: element,
    })

    setTimeout(async () => {
      await theme.apply({
        target: '.inverted-theme',
      })
      if (typeof document === 'undefined') return
      requestAnimationFrame(() => document.documentElement.classList.remove('theme-changing'))
    }, 0)

    return store(output)
  }

  function detectReadability(target?: number): void {
    const base = formated.value.find((item) => item.name === 'base')
    if (!base) return

    const inputValue = getReadability(input.value.foreground || '', input.value.background || '')
    const fg = `rgb(${base.foreground})`
    const bg = `rgb(${base.background})`
    const outputValue = getReadability(fg, bg)

    readability.value = {
      target: target ?? readability.value.target,
      input: inputValue,
      output: outputValue,
    }
  }

  function setReadability(value: number) {
    detectReadability(value)
    apply({ scheme: { settings: { readability: value } } })
    return readability.value
  }

  // Toggle HTML class only on client to avoid SSR errors during prerender
  if (typeof document !== 'undefined') {
    watch(dark, (value) => {
      document.querySelector('html')?.classList.toggle('dark', value)
    })
  }

  return {
    input,
    formated,
    isDark: dark,
    readability,
    setReadability,
    inverse,
    change: (scheme: UmbraInput) => debounced(scheme),
    apply: (props?: { scheme?: UmbraInput; element?: HTMLElement }) => apply(props),
  }
}
