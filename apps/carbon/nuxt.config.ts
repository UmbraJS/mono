// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/image', '@pinia/nuxt', '@nuxt/icon'],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  alias: {
    umbraco: fileURLToPath(new URL('../../packages/umbraco', import.meta.url)),
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {},

  image: {
    quality: 80,
    formats: ['webp'],
    // You can disable IPX entirely
    // provider: 'none',
    // Or configure specific behavior
    // provider: 'static',
    provider: 'ipx',
    // ipx: {
    //   fs: { dir: process.env.NUXT_IMAGES_ROOT },
    // },
    target: 'static',
    domains: [],
    alias: {},
  },

  nitro: {
    experimental: {
      openAPI: true
    }
  },

  build: {
    transpile: ['umbraco'],
  },

  vite: {
    resolve: {
      dedupe: ['vue'],
    },
    server: {
      fs: { allow: ['..'] },
    },
  },
})
