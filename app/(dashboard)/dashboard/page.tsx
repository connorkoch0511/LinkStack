import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, links } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  let profile = await db.query.users.findFirst({ where: eq(users.id, userId) })

  if (!profile) {
    const clerkUser = await currentUser()
    const emailAddress = clerkUser?.emailAddresses[0]?.emailAddress ?? ''
    // Auto-generate username from email prefix, strip non-alphanumeric
    const baseUsername = emailAddress.split('@')[0].replace(/[^a-z0-9_-]/gi, '').toLowerCase()
    const username = baseUsername || `user${userId.slice(-6)}`

    const [created] = await db
      .insert(users)
      .values({ id: userId, email: emailAddress, username })
      .onConflictDoNothing()
      .returning()
    profile = created
  }

  if (!profile) redirect('/login')

  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (l, { asc }) => [asc(l.position)],
  })

  return <DashboardClient profile={profile} links={userLinks} />
}
