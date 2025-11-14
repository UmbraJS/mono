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
    'motion-v/nuxt',
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: true },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      convexUrl: process.env.CONVEX_URL || '',
      convexSiteUrl: process.env.VITE_CONVEX_SITE_URL || '',
    },
  },

  // Ensure Umbraco styles are applied when consuming the built package
  css: ['umbraco/dist/umbraco.css'],

  // Use Umbraco source during dev for instant HMR across the monorepo
  alias: isDev
    ? {
      umbraco: fileURLToPath(new URL('../../packages/umbraco/index.ts', import.meta.url)),
      'umbraco/styles': fileURLToPath(new URL('../../packages/umbraco/styles', import.meta.url)),
      'umbraco/dist': fileURLToPath(new URL('../../packages/umbraco/dist', import.meta.url)),
      convue: fileURLToPath(new URL('../../packages/convue/src', import.meta.url)),
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
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',

  // Ensure source is transpiled when aliased (dev only); always transpile motion-v
  build: {
    transpile: [
      ...(isDev ? ['umbraco', 'convue'] : []),
      'motion-v',
    ],
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  // NuxtHub removed

  vite: {
    define: { global: 'globalThis' },
    resolve: {
      dedupe: ['vue'],
      alias: isDev ? [
        {
          find: /^umbraco\/(.*)$/,
          replacement: fileURLToPath(new URL('../../packages/umbraco/$1', import.meta.url))
        },
        {
          find: 'umbraco',
          replacement: fileURLToPath(new URL('../../packages/umbraco/index.ts', import.meta.url))
        }
      ] : [],
    },
    server: {
      fs: { allow: ['..'] },
    },
  },

  nitro: {
    // Force Vercel preset for deployment
    preset: 'vercel',
    experimental: {
      openAPI: true,
    },
    sourceMap: process.env.NODE_ENV === 'production' ? false : undefined,
    prerender: {
      // Disable prerendering in development to avoid SSR issues
      routes: isDev ? [] : [
        '/',
        ...prerenderExtraRoutes,
      ],
      crawlLinks: isDev ? false : shouldCrawl,
      ignore: [
        '/api/**', // Skip all API routes that might need server context
        '/tasks', // Requires runtime Convex queries
        '/chat',  // Requires runtime Convex queries
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
    hooks: {
      // Force exit after build to prevent hanging
      close: () => {
        // Only force exit during actual build, not during prepare/dev
        if ((process.env.VERCEL || process.env.CI) && process.env.NODE_ENV === 'production') {
          console.log('[nitro] Build complete, exiting...')
          process.exit(0)
        }
      }
    }
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
