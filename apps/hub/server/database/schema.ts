import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const user = sqliteTable('user', {
  id: text('id').primaryKey().$default(createId),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role', { enum: ['user', 'admin'] })
    .notNull()
    .default('user'),
  image: text('image'),
  emailVerified: integer('emailVerified', {
    mode: 'boolean',
  }).notNull(),
  banned: integer('banned', { mode: 'boolean' }).notNull().default(false),
  banReason: text('ban_reason'),
  banExpires: integer('ban_expires', { mode: 'timestamp' }),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey().$default(createId),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
  impersonatedBy: text('impersonated_by').references(() => user.id),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey().$default(createId),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: integer('accesTokenExiresAt', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  idToken: text('idToken'),
  password: text('password'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey().$default(createId),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
})
