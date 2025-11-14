import { defineStore } from 'pinia'
import { useUmbra as useUmbraCore } from 'umbraco'
import type { UmbraInput, Accent } from '@umbrajs/core'

const warningAccent: Accent = {
  name: 'warning',
  color: 'red',
}

const successAccent: Accent = {
  name: 'success',
  color: 'green',
}

const themeInput: UmbraInput = {
  foreground: '#080113',
  background: '#f3f6ea',
  accents: ['violet', warningAccent, successAccent],
  inversed: {
    foreground: '#f3f6ea',
    background: '#080113',
    accents: ['violet', warningAccent, successAccent],
  },
}

export const useUmbra = defineStore('umbra', () => useUmbraCore(themeInput))

