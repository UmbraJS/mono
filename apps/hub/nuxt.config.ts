import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/mdc',
    'nuxt-time',
    '@vueuse/nuxt',
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  // css: ['@nobel/core/styles/main.scss'],

  // Image configuration
  image: {
    quality: 80,
    formats: ['webp'],
    // You can disable IPX entirely
    // provider: 'none',
    // Or configure specific behavior
    // provider: 'static',
    provider: "ipx",
    // ipx: {
    //   fs: { dir: process.env.NUXT_IMAGES_ROOT },
    // },
    target: 'static',
    domains: [],
    alias: {},
  },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋',
    },
    auth: {
      redirectUserTo: '/user',
      redirectGuestTo: '/',
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

  vite: {
    define: {
      global: 'globalThis',
    },
  },

  // postcss: {
  //   plugins: {
  //     tailwindcss: {},
  //     autoprefixer: {},
  //   },
  // },

  nitro: {
    experimental: {
      openAPI: true,
    },
    prerender: {
      routes: ['/'], // Add specific routes you want to pre-render
      crawlLinks: true, // This will crawl and pre-render linked pages
      ignore: [
        '/user', // Skip auth-protected routes
        '/api/auth/**', // Skip auth API routes
        '/api/**', // Skip all API routes that might need server context
      ],
      failOnError: false, // Don't fail the build if prerendering fails
    },
    alias: {
      'pkg-types': 'unenv/runtime/mock/proxy',
      'mlly': 'unenv/runtime/mock/proxy',
      'local-pkg': 'unenv/runtime/mock/proxy',
      'tinyexec': 'unenv/runtime/mock/proxy',
      'package-manager-detector': 'unenv/runtime/mock/proxy',
      '@antfu/install-pkg': 'unenv/runtime/mock/proxy',
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
  },

  // components: {
  //   global: true,
  //   dirs: ['./components/prose'],
  // },

  content: {
    preview: {
      api: 'https://api.nuxt.studio'
    },
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

  // Auto-import configuration for Studio compatibility
  imports: {
    dirs: [
      'composables/**',
    ],
    // Explicitly provide useContentState for @nuxthq/studio compatibility
    presets: [
      {
        from: '~/composables/useContentState',
        imports: ['useContentState'],
      },
    ],
  },
})
