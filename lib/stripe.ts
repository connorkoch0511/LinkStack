import Stripe from 'stripe'

let _stripe: Stripe

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return _stripe
}

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!

export { FREE_LINK_LIMIT, FREE_THEMES, PRO_THEMES, ALL_THEMES } from './constants'
