import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from '../database/schema'
import { useDrizzle } from './database'

import { betterAuth } from 'better-auth'
import { anonymous, admin } from 'better-auth/plugins'

// export const auth = betterAuth({
//   database: drizzleAdapter(useDrizzle(), {
//     provider: 'sqlite',
//     schema,
//   }),
//   emailAndPassword: {
//     enabled: true,
//   },
//   // socialProviders: {
//   //    github: {
//   //     clientId: process.env.GITHUB_CLIENT_ID,
//   //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   //    }
//   // },
// })

let _auth: ReturnType<typeof betterAuth>
export function serverAuth() {
  if (!_auth) {
    _auth = betterAuth({
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
      plugins: [anonymous(), admin()],
    })
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    } catch (e) {}
  }
  return baseURL
}
