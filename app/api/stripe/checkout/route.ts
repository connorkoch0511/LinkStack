import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { stripe, STRIPE_PRICE_ID } from '@/lib/stripe'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const origin = request.headers.get('origin') ?? 'http://localhost:3000'

  let customerId = profile.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      metadata: { userId: profile.id },
    })
    customerId = customer.id
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, profile.id))
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    mode: 'subscription',
    success_url: `${origin}/dashboard/billing?success=true`,
    cancel_url: `${origin}/dashboard/billing`,
  })

  return NextResponse.json({ url: session.url })
}
