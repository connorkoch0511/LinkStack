import { pgTable, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const subscriptionStatusEnum = pgEnum('subscription_status', ['free', 'pro'])

export const themeEnum = pgEnum('theme', [
  'default',
  'dark',
  'sunset',
  'ocean',
  'forest',
  'midnight',
  'rose',
])

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID (user_xxx)
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  theme: themeEnum('theme').notNull().default('default'),
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').notNull().default('free'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url').notNull(),
  position: integer('position').notNull().default(0),
  clickCount: integer('click_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert
