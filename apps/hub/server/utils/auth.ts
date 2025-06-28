import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '../database/schema'
import { useDrizzle } from './database'

import { betterAuth } from 'better-auth'
import { anonymous, admin } from 'better-auth/plugins'

let auth: ReturnType<typeof betterAuth>

export function getServerAuth() {
  if (auth) return auth
  auth = betterAuth({
    database: drizzleAdapter(useDrizzle(), {
      provider: 'sqlite',
      schema,
    }),
    secondaryStorage: {
      get: (key) => hubKV().getItemRaw(`_auth:${key}`),
      set: (key, value, ttl) => {
        return hubKV().set(`_auth:${key}`, value, { ttl })
      },
      delete: (key) => hubKV().del(`_auth:${key}`),
    },
    baseURL: getBaseURL(),
    emailAndPassword: {
      enabled: true,
    },
    // emailVerification: {
    //   async sendVerificationEmail({ user, url }) {
    //     await sendUserVerificationEmail(user, url)
    //   },
    //   sendOnSignUp: true,
    // },
    // emailAndPassword: {
    //   enabled: true,
    //   requireEmailVerification: true,
    //   async sendResetPassword(url) {
    //     console.log('Reset password url:', url)
    //   },
    // },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    user: {
      // additionalFields: {
      //   firstName: {
      //     type: 'string',
      //     fieldName: 'firstName',
      //     returned: true,
      //     input: true,
      //     required: true,
      //   },
      //   lastName: {
      //     type: 'string',
      //     fieldName: 'lastName',
      //     returned: true,
      //     input: true,
      //     required: true,
      //   },
      // },
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [
      anonymous(),
      admin({
        defaultRole: 'user',
        defaultBanExpiresIn: 7 * 24 * 60 * 60,
        defaultBanReason: 'Spamming',
        impersonationSessionDuration: 1 * 24 * 60 * 60,
      }),
    ],
  })
  return auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      const event = useEvent()
      if (event) {
        baseURL = getRequestURL(event).origin
      }
    } catch (e) {
      // During prerendering, event might not be available
      // Fall back to a default or environment variable
      // TODO: This environment variable is not set. It should probably exist in the github repo for the CI to work properly
      baseURL = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
  return baseURL
}
