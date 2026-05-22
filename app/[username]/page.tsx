import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { users, links } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import ProfileCard from '@/components/profile/ProfileCard'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const profile = await db.query.users.findFirst({ where: eq(users.username, username) })
  if (!profile) return { title: 'Not found' }
  return {
    title: `${profile.displayName ?? profile.username} | LinkStack`,
    description: profile.bio ?? `${profile.username}'s link page`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await db.query.users.findFirst({ where: eq(users.username, username) })
  if (!profile) notFound()

  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, profile.id),
    orderBy: (l, { asc }) => [asc(l.position)],
  })

  return <ProfileCard profile={profile} links={userLinks} />
}
