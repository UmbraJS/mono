import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

export const user = sqliteTable('user', {
  id: text('id').primaryKey().$default(createId),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', {
    mode: 'boolean',
  }).notNull(),
  image: text('image'),
  createdAt: integer('createdAt', {
    mode: 'timestamp',
  }).notNull(),
  updatedAt: integer('updatedAt', {
    mode: 'timestamp',
  }).notNull(),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey().$default(createId),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey().$default(createId),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }),
  password: text('password'),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey().$default(createId),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', {
    mode: 'timestamp',
  }).notNull(),
})
