import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users, links } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { BarChart3, ArrowLeft, Lock } from 'lucide-react'

export default async function AnalyticsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const profile = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!profile) redirect('/dashboard')

  const isPro = profile.subscriptionStatus === 'pro'
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
    orderBy: (l, { desc }) => [desc(l.clickCount)],
  })

  const totalClicks = userLinks.reduce((sum, l) => sum + l.clickCount, 0)
  const maxClicks = Math.max(...userLinks.map((l) => l.clickCount), 1)

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-4 max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-100 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 size={18} className="text-violet-400" />
          Analytics
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!isPro ? (
          <div className="bg-slate-900 border border-violet-800/50 rounded-2xl p-10 text-center">
            <Lock size={32} className="text-violet-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analytics is a Pro feature</h2>
            <p className="text-slate-400 text-sm mb-6">
              See how many times each of your links was clicked.
            </p>
            <Link
              href="/dashboard/billing"
              className="inline-block bg-violet-600 hover:bg-violet-500 transition-colors text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Upgrade to Pro — $5/mo
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm mb-1">Total clicks</p>
                <p className="text-3xl font-bold">{totalClicks}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm mb-1">Links tracked</p>
                <p className="text-3xl font-bold">{userLinks.length}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="font-medium">Clicks per link</h2>
              {userLinks.length === 0 ? (
                <p className="text-slate-400 text-sm">No links yet.</p>
              ) : (
                userLinks.map((link) => (
                  <div key={link.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300 truncate max-w-xs">{link.title}</span>
                      <span className="text-sm font-medium text-slate-100">{link.clickCount}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-600 rounded-full transition-all"
                        style={{ width: `${(link.clickCount / maxClicks) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
