'use client'

import type { Link } from '@/lib/schema'

interface Props {
  link: Link
  btnClass: string
}

export default function ClickableLink({ link, btnClass }: Props) {
  async function handleClick() {
    // Fire-and-forget click tracking
    fetch(`/api/links/${link.id}/click`, { method: 'POST' })
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 px-4 rounded-xl border text-sm font-medium text-center transition-colors ${btnClass}`}
    >
      {link.title}
    </button>
  )
}
