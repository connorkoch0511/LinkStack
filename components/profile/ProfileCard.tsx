import type { User, Link } from '@/lib/schema'
import ClickableLink from './ClickableLink'

const THEME_STYLES: Record<
  string,
  { bg: string; card: string; text: string; sub: string; btn: string; btnHover: string }
> = {
  default: {
    bg: 'bg-slate-50',
    card: 'bg-white border-slate-200',
    text: 'text-slate-900',
    sub: 'text-slate-500',
    btn: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200',
    btnHover: '',
  },
  dark: {
    bg: 'bg-[#0a0a0f]',
    card: 'bg-slate-900 border-slate-800',
    text: 'text-slate-100',
    sub: 'text-slate-400',
    btn: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700',
    btnHover: '',
  },
  sunset: {
    bg: 'bg-gradient-to-br from-orange-100 to-pink-100',
    card: 'bg-white/80 border-orange-200',
    text: 'text-slate-900',
    sub: 'text-orange-700',
    btn: 'bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white border-transparent',
    btnHover: '',
  },
  ocean: {
    bg: 'bg-gradient-to-br from-blue-900 to-cyan-900',
    card: 'bg-white/10 border-blue-700',
    text: 'text-white',
    sub: 'text-blue-200',
    btn: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
    btnHover: '',
  },
  forest: {
    bg: 'bg-gradient-to-br from-green-950 to-emerald-900',
    card: 'bg-white/10 border-green-700',
    text: 'text-white',
    sub: 'text-green-200',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent',
    btnHover: '',
  },
  midnight: {
    bg: 'bg-gradient-to-br from-indigo-950 to-violet-950',
    card: 'bg-white/10 border-violet-700',
    text: 'text-white',
    sub: 'text-violet-200',
    btn: 'bg-violet-600 hover:bg-violet-500 text-white border-transparent',
    btnHover: '',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-50',
    card: 'bg-white/80 border-rose-200',
    text: 'text-slate-900',
    sub: 'text-rose-500',
    btn: 'bg-rose-500 hover:bg-rose-400 text-white border-transparent',
    btnHover: '',
  },
}

interface Props {
  profile: User
  links: Link[]
}

export default function ProfileCard({ profile, links }: Props) {
  const t = THEME_STYLES[profile.theme] ?? THEME_STYLES.default

  return (
    <div className={`min-h-screen ${t.bg} flex items-start justify-center py-16 px-4`}>
      <div className={`w-full max-w-sm border rounded-2xl p-8 ${t.card}`}>
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
          {(profile.displayName ?? profile.username).charAt(0).toUpperCase()}
        </div>

        {/* Name & bio */}
        <div className="text-center mb-6">
          <h1 className={`font-bold text-lg ${t.text}`}>
            {profile.displayName ?? profile.username}
          </h1>
          <p className={`text-sm mt-0.5 ${t.sub}`}>@{profile.username}</p>
          {profile.bio && <p className={`text-sm mt-2 ${t.sub}`}>{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="space-y-2.5">
          {links.map((link) => (
            <ClickableLink key={link.id} link={link} btnClass={t.btn} />
          ))}
        </div>

        <p className={`text-center text-xs mt-8 ${t.sub} opacity-60`}>
          Powered by LinkStack
        </p>
      </div>
    </div>
  )
}
