import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.BETTER_AUTH_URL || '',
    // authToken: process.env.BETTER_AUTH_SECRET,
  },
})
