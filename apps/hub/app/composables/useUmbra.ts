import { set, useDebounceFn } from '@vueuse/core'
import type { Promisify } from '@vueuse/core'
import type { UmbraInput, FormatedRange, UmbraOutputs, UmbraSettings, Accent } from '@umbrajs/core'
import { umbra, isDark, getReadability } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: '#ff0000',
}

const successAccent: Accent = {
  name: 'success',
  color: '#00ff00',
}

const themeInput: UmbraInput = {
  foreground: '#16121f',
  background: '#f3f6ea',
  accents: ['#9999ff', warningAccent, successAccent],
  inversed: {
    foreground: '#f3f6ea',
    background: '#16121f',
    accents: ['#9999ff', warningAccent, successAccent],
  },
}

interface UseUmbra {
  input: globalThis.Ref<UmbraInput>
  formated: globalThis.Ref<FormatedRange[]>
  isDark: globalThis.Ref<boolean>
  readability: globalThis.Ref<{ target: number; output: number; input: number }>
  setReadability: (value: number) => { target: number; output: number; input: number }
  inverse: (props?: { element?: HTMLElement }) => UmbraOutputs
  change: (scheme: UmbraInput) => Promisify<UmbraOutputs>
  apply: (props?: { scheme?: UmbraInput; element?: HTMLElement }) => UmbraOutputs
}

export const useUmbra = defineStore('umbra', () => {
  const input = ref<UmbraInput>(themeInput)
  const formated = ref<FormatedRange[]>([])
  const dark = ref<boolean>(true)

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

  function store(theme: UmbraOutputs) {
    const targetReadability = settings.readability
    detectReadability(targetReadability)
    input.value = stringableInput(theme.input)
    settings = theme.input.settings || settings
    formated.value = theme.formated
    dark.value = isDark(theme.input.background || '')
    return theme
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

    setTimeout(() => {
      theme.inverse().apply({
        target: '.inverted-theme',
      })
    }, 0)

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
    setTimeout(() => {
      theme.apply({
        target: '.inverted-theme',
      })
    }, 0)
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

  return {
    input,
    formated,
    isDark: dark,
    readability,
    setReadability,
    inverse,
    change: (scheme: UmbraInput) => debounced(scheme),
    apply: (props?: { scheme?: UmbraInput; element?: HTMLElement }) => apply(props),
  } as UseUmbra
})
