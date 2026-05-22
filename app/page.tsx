import Link from 'next/link'
import { Check } from 'lucide-react'

const FREE_FEATURES = [
  '1 profile page',
  'Up to 5 links',
  '2 themes (Default, Dark)',
  'Shareable public URL',
]

const PRO_FEATURES = [
  'Unlimited links',
  '7 themes including premium',
  'Click analytics dashboard',
  'Change your profile slug',
  'Priority support',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-bold tracking-tight">
          Link<span className="text-violet-400">Stack</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-2 rounded-lg font-medium"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-20 pb-16 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Your links,{' '}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            one page
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
          Create a beautiful link-in-bio page in seconds. Share it everywhere — your bio, email
          signature, anywhere.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-violet-600 hover:bg-violet-500 transition-colors text-white px-8 py-3 rounded-xl font-semibold text-lg"
        >
          Create your page — it&apos;s free
        </Link>

        {/* Mock profile preview */}
        <div className="mt-16 mx-auto max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-3" />
          <p className="font-semibold text-slate-100">@yourname</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">Full-stack developer ✦ Open to work</p>
          <div className="space-y-2">
            {['Portfolio', 'GitHub', 'LinkedIn', 'Twitter'].map((label) => (
              <div
                key={label}
                className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-1">Free</h3>
            <p className="text-4xl font-bold mb-1">
              $0<span className="text-slate-400 text-lg font-normal">/mo</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">Everything you need to get started.</p>
            <Link
              href="/signup"
              className="block text-center w-full border border-slate-700 hover:border-violet-500 transition-colors text-slate-100 py-2.5 rounded-lg font-medium mb-6"
            >
              Get started
            </Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-violet-950/60 to-slate-900 border border-violet-700 rounded-2xl p-8 relative">
            <span className="absolute top-4 right-4 text-xs bg-violet-600 text-white px-2.5 py-1 rounded-full font-medium">
              Popular
            </span>
            <h3 className="text-xl font-semibold mb-1">Pro</h3>
            <p className="text-4xl font-bold mb-1">
              $5<span className="text-slate-400 text-lg font-normal">/mo</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">For creators who want more.</p>
            <Link
              href="/signup"
              className="block text-center w-full bg-violet-600 hover:bg-violet-500 transition-colors text-white py-2.5 rounded-lg font-medium mb-6"
            >
              Start free, upgrade anytime
            </Link>
            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-violet-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="text-center text-slate-600 text-sm pb-10">
        Built with Next.js, Supabase, and Stripe
      </footer>
    </div>
  )
}
