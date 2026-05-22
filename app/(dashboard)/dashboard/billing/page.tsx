import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { ArrowLeft, Zap, Check } from 'lucide-react'
import UpgradeButton from './UpgradeButton'
import ManageButton from './ManageButton'

const PRO_FEATURES = [
  'Unlimited links',
  '7 themes including premium',
  'Click analytics dashboard',
  'Custom profile slug',
  'Priority support',
]

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const profile = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!profile) redirect('/dashboard')

  const isPro = profile.subscriptionStatus === 'pro'

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-4 max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-semibold">Billing</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-slate-400 mb-1">Current plan</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{isPro ? 'Pro' : 'Free'}</span>
              {isPro && (
                <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-medium">
                  Active
                </span>
              )}
            </div>
            <span className="text-slate-400 text-sm">{isPro ? '$5 / month' : '$0 / month'}</span>
          </div>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              You&apos;re on Pro. Manage or cancel your subscription below.
            </p>
            <ManageButton />
          </div>
        ) : (
          <div className="bg-gradient-to-b from-violet-950/60 to-slate-900 border border-violet-700 rounded-xl p-8">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} className="text-violet-400" />
              <h2 className="text-xl font-bold">Upgrade to Pro</h2>
            </div>
            <p className="text-4xl font-bold mb-1">
              $5<span className="text-slate-400 text-lg font-normal">/mo</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">Cancel anytime.</p>
            <ul className="space-y-2.5 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={15} className="text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <UpgradeButton />
          </div>
        )}
      </main>
    </div>
  )
}
