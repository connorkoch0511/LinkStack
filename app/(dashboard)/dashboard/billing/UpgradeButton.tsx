'use client'

import { useState } from 'react'

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-colors text-white py-3 rounded-lg font-semibold"
    >
      {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro — $5/mo'}
    </button>
  )
}
