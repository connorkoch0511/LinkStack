'use client'

import { useState } from 'react'

export default function ManageButton() {
  const [loading, setLoading] = useState(false)

  async function handleManage() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-100 px-6 py-2.5 rounded-lg font-medium"
    >
      {loading ? 'Loading…' : 'Manage subscription'}
    </button>
  )
}
