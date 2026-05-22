import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const status = subscription.status === 'active' ? 'pro' : 'free'
      await db
        .update(users)
        .set({ subscriptionStatus: status, stripeSubscriptionId: subscription.id })
        .where(eq(users.stripeCustomerId, customerId))
      break
    }
    case 'customer.subscription.deleted': {
      await db
        .update(users)
        .set({ subscriptionStatus: 'free', stripeSubscriptionId: null })
        .where(eq(users.stripeCustomerId, customerId))
      break
    }
  }

  return NextResponse.json({ received: true })
}
