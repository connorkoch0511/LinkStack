'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, links } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import type { User } from '@/lib/schema'

async function getAuthUserId() {
  const { userId } = await auth()
  if (!userId) redirect('/login')
  return userId
}

export async function saveProfile(data: {
  displayName: string
  bio: string
  theme: User['theme']
  username?: string
}) {
  const userId = await getAuthUserId()
  await db
    .update(users)
    .set({
      displayName: data.displayName,
      bio: data.bio,
      theme: data.theme,
      ...(data.username ? { username: data.username } : {}),
    })
    .where(eq(users.id, userId))
  revalidatePath('/dashboard')
}

export async function addLink(data: { title: string; url: string; position: number }) {
  const userId = await getAuthUserId()
  const [link] = await db
    .insert(links)
    .values({ userId, ...data })
    .returning()
  revalidatePath('/dashboard')
  return link
}

export async function updateLink(id: string, data: { title: string; url: string }) {
  const userId = await getAuthUserId()
  await db
    .update(links)
    .set(data)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
  revalidatePath('/dashboard')
}

export async function deleteLink(id: string) {
  const userId = await getAuthUserId()
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)))
  revalidatePath('/dashboard')
}

export async function reorderLinks(orderedIds: string[]) {
  const userId = await getAuthUserId()
  await Promise.all(
    orderedIds.map((id, position) =>
      db
        .update(links)
        .set({ position })
        .where(and(eq(links.id, id), eq(links.userId, userId)))
    )
  )
  revalidatePath('/dashboard')
}
