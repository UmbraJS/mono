import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath, URL } from 'node:url'

// Build-time flags
const isDev = process.env.NODE_ENV !== 'production'
const shouldCrawl = process.env.NUXT_PRERENDER_CRAWL !== 'false'
const prerenderExtraRoutes = (process.env.NUXT_PRERENDER_ROUTES || '')
  .split(',')
  .map(r => r.trim())
  .filter(Boolean)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/content',
    '@nuxtjs/mdc',
    'nuxt-time',
    '@vueuse/nuxt',
    'convex-nuxt',
  ],

  convex: {
    // Use Convex URL from .env.local per Convex Nuxt quickstart
    url: process.env.CONVEX_URL,
  },

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  // Ensure Umbraco styles are applied when consuming the built package
  css: ['umbraco/dist/umbraco.css'],

  // Use Umbraco source during dev for instant HMR across the monorepo
  alias: isDev
    ? {
      umbraco: fileURLToPath(new URL('../../packages/umbraco', import.meta.url)),
    }
    : {},

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
      // Expose Convex URL to the client as well, if needed
      convexUrl: process.env.CONVEX_URL,
    },
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  // Ensure source is transpiled when aliased (dev only); always transpile motion-v
  build: {
    transpile: [
      ...(isDev ? ['umbraco'] : []),
      'motion-v',
    ],
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  // NuxtHub removed

  vite: {
    define: { global: 'globalThis' },
    resolve: {
      dedupe: ['vue'],
    },
    server: {
      fs: { allow: ['..'] },
    },
  },

  // postcss: {
  //   plugins: {
  //     tailwindcss: {},
  //     autoprefixer: {},
  //   },
  // },

  nitro: {
    // Force Vercel preset for deployment
    preset: 'vercel',
    experimental: {
      openAPI: true,
    },
    sourceMap: process.env.NODE_ENV === 'production' ? false : undefined,
    prerender: {
      // Dev-friendly toggles: disable crawling or add extra routes via env
      routes: [
        '/',
        ...prerenderExtraRoutes,
      ],
      crawlLinks: shouldCrawl, // Disable with NUXT_PRERENDER_CRAWL=false
      ignore: [
        '/api/**', // Skip all API routes that might need server context
      ],
      // TEMP: enable to capture stack trace for '/' prerender failure
      failOnError: true,
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
      stylistic: false,
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

  // Ensure Prose components are auto-registered with exact names (e.g. `ProseH1`)
  components: {
    global: true,
    dirs: [
      { path: './components/prose', pathPrefix: false },
    ],
  },

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
})
