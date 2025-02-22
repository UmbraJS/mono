import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/content',
    // '@unocss/nuxt',
    '@nuxtjs/mdc',
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  // css: ['@nobel/core/styles/main.scss'],

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      // parserOptions: {
      //   parser: '@typescript-eslint/parser',
      //   sourType: 'module',
      // },
      stylistic: false,
      // {
      //   quotes: 'single',
      //   arrowParens: false,
      //   semi: false,
      // }
    },
  },

  mdc: {
    remarkPlugins: {
      // Override remark-emoji options
      'remark-emoji': {
        options: {
          emoticon: true,
        },
      },
    },
    highlight: {
      theme: {
        // TODO: Figure out why this doesn't work
        default: 'dracula',
        dark: 'github-dark',
      },
    },
    components: {
      // prose: false, // Add predefined map to render Prose Components instead of HTML tags, like p, ul, code
      map: {
        // This map will be used in `<MDCRenderer>` to control rendered components
        // 'p': 'Prose',
      },
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            // TODO: Figure out why this doesn't work
            default: 'dracula',
            dark: 'github-dark',
          },
        },
        remarkPlugins: {
          // Override remark-emoji options
          'remark-emoji': {
            options: {
              emoticon: true,
            },
          },
        },
      },
    },
  },
})
