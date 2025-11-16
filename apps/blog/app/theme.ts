import type { UmbraInput, Accent } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: 'red',
}

const successAccent: Accent = {
  name: 'success',
  color: 'green',
}

export const defaultThemeInput: UmbraInput = {
  foreground: '#080113',
  background: '#f3f6ea',
  accents: ['violet', warningAccent, successAccent],
  inversed: {
    foreground: '#f3f6ea',
    background: '#080113',
    accents: ['violet', warningAccent, successAccent],
  },
}
