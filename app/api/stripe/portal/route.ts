import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!profile?.stripeCustomerId) {
    return NextResponse.json({ error: 'No Stripe customer' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripeCustomerId,
    return_url: `${origin}/dashboard/billing`,
  })

  return NextResponse.json({ url: session.url })
}
