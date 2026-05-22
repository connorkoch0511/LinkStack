import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!

export { FREE_LINK_LIMIT, FREE_THEMES, PRO_THEMES, ALL_THEMES } from './constants'
