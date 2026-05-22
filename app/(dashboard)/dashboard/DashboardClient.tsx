'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Plus, Trash2, GripVertical, BarChart3, CreditCard } from 'lucide-react'
import type { User, Link as LinkRow } from '@/lib/schema'
import { FREE_LINK_LIMIT, FREE_THEMES, PRO_THEMES, ALL_THEMES } from '@/lib/constants'
import { UserButton } from '@clerk/nextjs'
import {
  saveProfile,
  addLink,
  deleteLink,
  updateLink,
  reorderLinks,
} from './actions'

const THEME_LABELS: Record<string, string> = {
  default: 'Default',
  dark: 'Dark',
  sunset: 'Sunset',
  ocean: 'Ocean',
  forest: 'Forest',
  midnight: 'Midnight',
  rose: 'Rose',
}

interface Props {
  profile: User
  links: LinkRow[]
}

export default function DashboardClient({ profile, links: initialLinks }: Props) {
  const router = useRouter()
  const isPro = profile.subscriptionStatus === 'pro'
  const [links, setLinks] = useState(initialLinks)
  const [displayName, setDisplayName] = useState(profile.displayName ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [theme, setTheme] = useState(profile.theme)
  const [username, setUsername] = useState(profile.username)
  const [profileSaving, startProfileSave] = useTransition()
  const [linkPending, startLinkTransition] = useTransition()
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const atFreeLimit = !isPro && links.length >= FREE_LINK_LIMIT

  function handleSaveProfile() {
    startProfileSave(async () => {
      await saveProfile({ displayName, bio, theme, username: isPro ? username : undefined })
      router.refresh()
    })
  }

  function handleAddLink() {
    if (!newTitle || !newUrl) return
    startLinkTransition(async () => {
      const link = await addLink({ title: newTitle, url: newUrl, position: links.length })
      setLinks((prev) => [...prev, link])
      setNewTitle('')
      setNewUrl('')
    })
  }

  function handleDeleteLink(id: string) {
    startLinkTransition(async () => {
      await deleteLink(id)
      setLinks((prev) => prev.filter((l) => l.id !== id))
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Link<span className="text-violet-400">Stack</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/${profile.username}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors"
          >
            <ExternalLink size={14} />
            View page
          </Link>
          {isPro ? null : (
            <Link
              href="/dashboard/billing"
              className="text-sm bg-violet-600 hover:bg-violet-500 transition-colors text-white px-3 py-1.5 rounded-lg font-medium"
            >
              Upgrade to Pro
            </Link>
          )}
          <Link
            href="/dashboard/analytics"
            className="text-slate-400 hover:text-slate-100 transition-colors"
            title="Analytics"
          >
            <BarChart3 size={18} />
          </Link>
          <Link
            href="/dashboard/billing"
            className="text-slate-400 hover:text-slate-100 transition-colors"
            title="Billing"
          >
            <CreditCard size={18} />
          </Link>
          <UserButton
            appearance={{
              elements: { avatarBox: 'w-8 h-8' },
            }}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">
        {/* Profile editor */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            {isPro && (
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">
                  Username <span className="text-violet-400 text-xs">Pro</span>
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="yourname"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Display name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                placeholder="A short bio…"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_THEMES.map((t) => {
                  const isLocked = !isPro && (PRO_THEMES as readonly string[]).includes(t)
                  return (
                    <button
                      key={t}
                      onClick={() => !isLocked && setTheme(t as User['theme'])}
                      disabled={isLocked}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                        theme === t
                          ? 'border-violet-500 bg-violet-950 text-violet-300'
                          : isLocked
                          ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                          : 'border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                      title={isLocked ? 'Pro only' : undefined}
                    >
                      {THEME_LABELS[t]}
                      {isLocked && <span className="block text-[10px] text-violet-600">Pro</span>}
                    </button>
                  )
                })}
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition-colors text-white py-2 rounded-lg text-sm font-medium"
            >
              {profileSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </section>

        {/* Links editor */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Links</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            {/* Existing links */}
            {links.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                onDelete={() => handleDeleteLink(link.id)}
                onUpdate={async (title, url) => {
                  startLinkTransition(async () => {
                    await updateLink(link.id, { title, url })
                    setLinks((prev) =>
                      prev.map((l) => (l.id === link.id ? { ...l, title, url } : l))
                    )
                  })
                }}
              />
            ))}

            {/* Add new link */}
            {atFreeLimit ? (
              <div className="border border-dashed border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-400 mb-2">
                  Free plan is limited to {FREE_LINK_LIMIT} links
                </p>
                <Link
                  href="/dashboard/billing"
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  Upgrade to Pro for unlimited links →
                </Link>
              </div>
            ) : (
              <div className="border border-dashed border-slate-700 rounded-lg p-4 space-y-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="Link title"
                />
                <input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder="https://"
                />
                <button
                  onClick={handleAddLink}
                  disabled={!newTitle || !newUrl || linkPending}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors text-slate-300 py-2 rounded-lg text-sm font-medium"
                >
                  <Plus size={14} />
                  Add link
                </button>
              </div>
            )}

            {!isPro && (
              <p className="text-xs text-slate-500 text-center">
                {links.length}/{FREE_LINK_LIMIT} links used
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function LinkRow({
  link,
  onDelete,
  onUpdate,
}: {
  link: LinkRow
  onDelete: () => void
  onUpdate: (title: string, url: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(link.title)
  const [url, setUrl] = useState(link.url)

  return (
    <div className="bg-slate-800 rounded-lg px-3 py-2.5">
      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-100 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onUpdate(title, url)
                setEditing(false)
              }}
              className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-slate-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium text-slate-100 truncate cursor-pointer hover:text-violet-300"
              onClick={() => setEditing(true)}
            >
              {link.title}
            </p>
            <p className="text-xs text-slate-500 truncate">{link.url}</p>
          </div>
          <button
            onClick={onDelete}
            className="text-slate-600 hover:text-red-400 transition-colors shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
