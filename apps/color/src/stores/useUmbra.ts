import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { UmbraInput, FormatedRange, UmbraOutputs, UmbraSettings, Accent } from '@umbrajs/core'
import { umbra, isDark, getReadability } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: 'red',
}

const successAccent: Accent = {
  name: 'success',
  color: 'green',
}

const defaultThemeInput: UmbraInput = {
  foreground: '#000000',
  background: '#ffffff',
  accents: ['#6400ff', warningAccent, successAccent],
}

export const useUmbra = defineStore('umbra', () => {
  const input = ref<UmbraInput>(defaultThemeInput)


  const formated = ref<FormatedRange[]>([])
  const dark = ref<boolean>(false)
  const activeThemeName = ref<string | null>(null)

  const readability = ref({
    target: 50,
    input: 50,
    output: 50,
  })

  let settings: UmbraSettings = {
    readability: readability.value.target,
  }

  function stringableInput(input: UmbraInput) {
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

  async function store(theme: Promise<UmbraOutputs>) {
    const targetReadability = settings.readability
    detectReadability(targetReadability)
    const themeResolved = await theme
    input.value = stringableInput(themeResolved.input)
    settings = themeResolved.input.settings || settings
    formated.value = themeResolved.formated
    dark.value = isDark(themeResolved.input.background || '')
    return themeResolved
  }

  function apply({ scheme, element }: { scheme?: UmbraInput; element?: HTMLElement } = {}) {
    const schemeInput = {
      ...input.value, // previous input
      ...scheme, // new input
    }

    const schemeSettings = {
      ...settings, // default settings
      ...scheme?.settings, // new settings
    }

    const theme = umbra({
      ...schemeInput,
      settings: schemeSettings,
    })

    const output = theme.apply({
      target: element,
    })

    return store(output)
  }

  const debounced = useDebounceFn((s) => apply(s), 50, {
    maxWait: 200,
  })

  function inverse({ element }: { element?: HTMLElement } = {}) {
    const theme = umbra({
      settings: settings,
      ...input.value,
    })
    const inverse = theme.inverse()
    const output = inverse.apply({
      target: element,
    })
    return store(output)
  }

  function detectReadability(target?: number) {
    const base = formated.value.find((item) => item.name === 'base')
    const inputValue = getReadability(input.value.foreground || '', input.value.background || '')
    if (!base) return
    const fg = `rgb(${base.foreground})`
    const bg = `rgb(${base.background})`
    const outputValue = getReadability(fg, bg)
    readability.value = {
      target: target || readability.value.target,
      input: inputValue,
      output: outputValue,
    }
  }

  function setReadability(value: number) {
    const settings = {
      readability: value,
    }
    detectReadability(value)
    apply({ scheme: { settings } })
    return readability.value
  }

  function setActiveTheme(themeName: string | null) {
    activeThemeName.value = themeName
  }

  watch(dark, (value) => {
    document.querySelector('html')?.classList.toggle('dark', value)
  })

  return {
    input,
    formated,
    isDark: dark,
    readability,
    activeThemeName,
    setActiveTheme,
    setReadability,
    inverse,
    change: (scheme: UmbraInput) => debounced(scheme),
    apply: (props?: { scheme?: UmbraInput; element?: HTMLElement }) => apply(props),
  }
})
